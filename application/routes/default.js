
var	  _		  = require('underscore')
	, cluster = require('cluster')
	, restify = require('restify')
	;
	
module.exports = function(app) {

	app.server.get('/'
		, function(req, res, next){
			console.log(app.conf.server.name);
			
			if(cluster && cluster.worker){
				res.send(200, {server:{name: app.conf.server.name, version: app.conf.version ,build: app.conf.build, cluster: cluster.worker.id  }});
			} else {
				res.send(200, {server:{name: app.conf.server.name, version: app.conf.version ,build: app.conf.build, cluster: 'none' }});
			}
			return next();
		}
	);
	
	app.server.get(/.(html|js|css|map)/, restify.serveStatic({
		directory: './static'
	}));
	
};
