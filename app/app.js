#!/usr/bin/env node 

/**
# ----------------------------------------
# Inventar
# ----------------------------------------
# node and mongodb service for inventar
# 
# build on iojs
#
# ----------------------------------------
*/

// require the project modules 
var   path 					= require('path')
	, fs 					= require('fs')
	, conf					= require(__dirname +'/config')
	, optsMethodHandler		= require(__dirname +'/lib/optsMethodHandler')
	, events 				= require('events')
	, mongoose 				= require('mongoose')
	, async					= require('async')
	, Log					= require('log')
	, _						= require('underscore')
	, S						= require('string')
	, restify 				= require('restify')
	;
	
/**
 * global application scope
 */
var app = {};

/**
 * Set the configuration to the application scope
 * @var object conf
 */
app.conf = conf;

// Set application defaults
process.env.NODE_ENV 	= process.env.NODE_ENV 	|| 'development';
conf.log.level  		= conf.log.level 		|| 'debug';
conf.log.file			= conf.log.file 		|| __dirname +'/log/application.log';

// Alwasy log everything in debug mode.
if ('development' 		== process.env.NODE_ENV) {
	conf.log.level		= "debug"; 
	mongoose.set('debug', true);
}

// ensure directories 
if(fs.existsSync( path.dirname(conf.log.file) ) == false){
	console.log("Create log directory: "+ conf.log.file);
	fs.mkdirSync(path.dirname(conf.log.file));
}

// open logging
var log = new Log(''+ conf.log.level , fs.createWriteStream(''+ conf.log.file));
app.log = log;

// overwrite error logging
app.log.error = function(e){
	console.error(e);
}

// open database
if(process.env.NODE_ENV == 'test'){
	console.log("TEST MODE: running Mock-Database!");
	var mockgoose 		= require('mockgoose');
	app.mongoConn 		= mongoose;
	mockgoose(app.mongoConn);
	app.mongoConn.connect('mongodb://localhost/TestingDB');
} else {
	if(  conf.databases.replset ){
		var options = {
			server: { poolSize: _.findWhere(conf.databases, {type: 'primary'}).poolSize || 4 },
			replset: conf.databases.replset
		}
		if( conf.databases.user ){
			options.user = conf.databases.user;
		}
		if( conf.databases.password ){
			options.user = conf.databases.password;
		}
		mongoose.connect(
			_.findWhere(conf.databases, {type: 'primary'}).url +","+
			_.findWhere(conf.databases, {type: 'secondary'}).url, 
			options
		);
	} else {
		mongoose.connect(
			_.findWhere(conf.databases, {type: 'primary'}).url, {
				server: { poolSize: _.findWhere(conf.databases, {type: 'primary'}).poolSize || 4 }
			}
		);
	}
}

// Set the database connection to the application scope
app.db = mongoose.connection;

app.db.on('error', function error(err) {
  console.log('Mongo Database connection failed. '+ JSON.stringify(err));
});	
app.db.once('open', function callback () {
  console.log("Database is connected.");
});

/**
 * Global eventEmitter
 * @var object eventEmitter
 */
app.eventEmitter = 		new events.EventEmitter();

/**
 * All ODM Models are set into application scope.
 * @var
 */
app.models = {}

// Load models
var modelFileList = fs.readdirSync(__dirname +'/models');
_.each(modelFileList, function(file){
	var moduleName = file.substr(0, file.indexOf('.'));
	if(S(moduleName).startsWith(".") == false 
		&& S(moduleName).endsWith("Schema") == false
		&& moduleName.length > 0){
		console.log("Load Module ", moduleName);
		app.models[moduleName] = require(__dirname +'/models/'+ moduleName)(app);
	}
});

/** 
 * The REST-Server
 * @var object server 
 */
 app.server = restify.createServer(_.extend({
	'acceptable': 'application/json'
}, conf.server));

// pass X-Domain check 
app.server.use(
  function crossOrigin(req,res,next){
    res.header("Access-Control-Allow-Origin", req.headers.origin);
    return next();
  }
);

// Configure the server
app.server.use(restify.authorizationParser());
app.server.use(restify.queryParser());
app.server.use(restify.bodyParser());
app.server.use(restify.CORS({origins: ['*']}));
app.server.use(restify.fullResponse());

// Acccess Limits
app.server.use(restify.throttle({
  burst: conf.server.throttle.burst,
  rate: conf.server.throttle.rate,
  ip: conf.server.throttle.ip,
  xff: conf.server.throttle.xff
}));

app.server.pre(restify.pre.userAgentConnection());

// Support for OPTIONS request methods
app.server.on('MethodNotAllowed', optsMethodHandler);

// error handling
app.server.on('uncaughtException', function error(req, res, route, err){
	console.log("ROUTE", route);
	console.log("ERROR", err);

	var ERR = require("async-stacktrace");
	ERR(err, function callback(stack){
		// log to "told log recorder"
	 	app.told.tell({
	 		 message: 'Fatal Error'
		 	, route: route
 			, error: stack.toString()
 			, stack: stack.stack
	 		, tags: ['uncaughtException', process.env.NODE_ENV]
 		});
	});

});

/**
 * EventEmitter listen on system:error
 * It takes a message and write a told message, before it sends the message to 
 * app.log.error
 *
 * @parameter string message the log message
 */
app.eventEmitter.on('system::error', function errormessage(msg){
	var ERR = require("async-stacktrace");
	ERR(new Error(), function callback(stack){
		// log to "told log recorder"
	 	app.told.tell({
	 		 message: msg
 			, stack: stack.stack
	 		, tags: ['SystemError', process.env.NODE_ENV]
 		});
	});
	app.log.error(msg);
});

// Routes
fs.readdir(__dirname +'/routes', function(err, files){
	if(err){
		app.log.error(err);
		return;
	}
	_.each(files, function(file){
		var routeName = file.substr(0, file.indexOf('.'));
		if(S(routeName).startsWith(".") == false 
			&& routeName.length > 0){
			app.log.debug("Add route '%s' to application.", routeName );
			require(__dirname +'/routes/'+ routeName)(app);
		}
	});
});

// Events
fs.readdir(__dirname +'/events', function eventLoader(err, files){
	if(err){
		app.log.error(err);
		app.eventEmitter.emit('health:report', 'loaded-events', false, {error: err });
		return;
	}
	_.each(files, function(file){
		var stats = fs.lstatSync(__dirname +'/events/'+ file);
		var eventName;
		if(stats.isDirectory()){
			eventName = file;
		} else {
			eventName = file.substr(0, file.indexOf('.'));
		}
		if(S(eventName).startsWith(".") == false 
			&& eventName.length > 0){
			if(app.conf.events[eventName] && app.conf.events[eventName].enabled == true){
				app.log.debug("Add event '%s' to application.", eventName );
				require(__dirname +'/events/'+ eventName)(app, app.conf.events[eventName]);
			} else {
				app.log.debug("No configuration or disabled plugin '%s'.", eventName );
			}
		}
	});
});

/**
 * Call startServer to start the REST Server. 
 * @defaults Port 3000, ir set in conf.port, or take PORT= env Variable.
 * @function startServer starts the Rest Server
 */
var startServer = function startServer(callback){
	app.server.listen(process.env.PORT || conf.port || 3000, function() {
      console.log('%s listening at %s', app.server.name, app.server.url);
      if( isRunning() == true ){
	      callback(null);
	} else { 
		callback(false);
		}
    });
    
}

/**
 * Stops the Server
 * @function
 */
var stopServer = function stopServer(callback){
	app.server.close();
}

/**
 * Checks if the server is running
 * @return boolean isRunning
 * @function
 */
var isRunning = function isRunning(){
	if(app.server && app.server.address() ){
		return true;
	}
	return false;
}

// Do not start the service in test mode. 
if(process.env.NODE_ENV != 'test'){
	startServer(function(err){
		if(err){ 
			app.eventEmitter.emit('health:report', 'server', false, {errormessage: "Server not running."});
			console.error("Server not running!");
		}
	});
}

// Export the global functions
exports.start 		= startServer;
exports.stop 		= stopServer;
exports.isRunning 	= isRunning;
exports.context		= app;
