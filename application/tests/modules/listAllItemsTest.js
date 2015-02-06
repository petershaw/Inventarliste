
var   assert 		= require("assert")
	, chai 			= require("chai")
	, path 			= require('path')
	, mockgoose 	= require('mockgoose')
	, async			= require('async')
	, fs			= require("fs")
	, S				= require('string')
	;
	
process.env.NODE_ENV = process.env.NODE_ENV  || 'test';
var app = require('../../app.js');

describe('list items', function(){
	
	var item1 = {
		  "indexNumber": 12345678
		, "name": 'Birne'
		, "owner": ""
		, "description": "Eine Frucht"
	};
	var item2 = {
		  "indexNumber": 90123456
		, "name": 'Apfel'
		, "owner": "Hans Behr"
		, "description": "Eine Frucht"
	};
	beforeEach(function (done) {
		mockgoose.reset();
		var models = app.context.models;
		async.parallel([
			function(next){
				models.items.addItem(item1 , function(err, document){				
					chai.expect(err).to.be.null;
					next(null, document);
				});
			}
			, function(next){
				models.items.addItem(item2 , function(err, document){				
					chai.expect(err).to.be.null;
					next(null, document);
				});
			}
		], function(err, results){
			chai.expect(err).to.be.undefined;
			chai.expect(results).to.have.length(2);
			done();
		});
	});

	it('should return a list of items', function(done){
		var models = app.context.models;
 		async.series([
			function(callback){
 				models.items.getPagedList(null, {}, function(err, result){
 					chai.expect(err).to.be.null;
 					chai.expect(result.results).to.have.length(2);
 					chai.expect(result.current).to.equal(1);
 					chai.expect(result.pages).to.be.a('array');
 					callback();
 				});
			}
 		], function(){
 			done();
 		});
	});

});
