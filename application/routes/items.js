
var	  _		  = require('underscore')
	, cluster = require('cluster')
	;
	
module.exports = function(app) {

	app.server.get('/items'
		, function(req, res, next){
			app.models.items.getPagedList(req.params.page, req.params.filter || {}, function(err, documents){
				if(err){
					return res.send(500, new Error(err));
				}
				if(documents){
					return res.send(200, documents);
				}
				return res.send(204);
			});
		}
	);


	app.server.get('/items/:indexNumber'
		, function(req, res, next){
			app.models.items.getByIndexNumber(req.params.indexNumber, function(err, document){
				if(err){
					return res.send(500, new Error(err));
				}
				if(document){
					return res.send(200, document);
				}
				return res.send(204);
			});
		}
	);
	
	app.server.put('/items/:indexNumber'
		, function(req, res, next){
			app.models.items.getByIndexNumber(req.params.indexNumber, function(err, document){
				if(document){
					app.models.items.updateItem(document._id, req.body, function(err, document){
						if(err){
							return res.send(500, new Error(err));
						}
						app.eventEmitter.emit('item::update', document);
						return res.send(200, document);
					});
				} else {
					app.models.items.addItem(req.body, function(err, document){
						if(err){
							return res.send(500, new Error(err));
						}
						app.eventEmitter.emit('item::new', document);
						return res.send(200, document);
					});
				}
			});
			return next();
		}
	);
	
	app.server.del('/items/:indexNumber' 
		, function(req, res, next){
			app.models.items.getByIndexNumber(req.params.indexNumber, function(err, document){
				if(!document || document == null){
					err = "Item nicht gefunden."
				}
				if(err){
					return res.send(500, new Error(err));
				}
console.log("HABEN INDEX", document);
				app.models.items.deleteItem(document._id, function(err, document){
					if(err){ 
						return res.send(500, new Error(err)); 
					}
					res.send(200, document);
				});
			});
		}
	);
	
	app.server.post('/items'
		, function(req, res, next){
			console.log("NOT IMPLEMENTED, YET");
			return res.send(500, 'neu generieren fehlt noch');		
			return next();
		}
	);
	
};
