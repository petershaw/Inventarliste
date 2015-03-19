
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

describe('Add item', function(){
	
	var item = {
		  "indexNumber": 12345678
		, "name": 'Ein Sofa'
		, "owner": "Hans Behr"
		, "description": "Es ist blau"
	};

	beforeEach(function (done) {
		mockgoose.reset();
		done();
	});

	it('should increase the count', function(done){
		var models = app.context.models;
 		async.series([
			function(callback){
 				models.items.count(function(err, result){
 					chai.expect(err).to.be.null;
 					chai.expect(result).to.equal(0);
 					callback();
 				});
			}
  			, function(callback){
  				models.items.addItem(item , function(err, document){				
  					chai.expect(err).to.be.null;
  					chai.expect(document).have.property('_id');
  					chai.expect(document).have.property('createdAt');
  					chai.expect(document).have.property('name');
  					chai.expect(document.name).to.equal(item.name);
  					chai.expect(document).have.property('indexNumber');
  					callback();
  				});
  			}
 			, function(callback){
 				models.items.count(function(err, result){
 					chai.expect(err).to.be.null;
 					chai.expect(result).to.equal(1);
 					callback();
 				});
 			}
 		], function(){
 			done();
 		});
	});

});
