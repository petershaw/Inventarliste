
var   assert 		= require("assert")
	, chai 			= require("chai")
	, path 			= require('path')
	, mockgoose 	= require('mockgoose')
	, async			= require('async')
	, fs			= require("fs")
	, S				= require('string')
	, _				= require('underscore')
	;
	
process.env.NODE_ENV = process.env.NODE_ENV  || 'test';
var app = require('../../app.js');

describe.skip('Search item', function(){ // can not test in moogoose
	
	var items = [{
		  "indexNumber": 12345678
		, "name": 'Ein Sofa'
		, "owner": "Hans Behr"
		, "description": "Es ist blau"
	},{
		  "indexNumber": 12345679
		, "name": 'Bett'
		, "owner": "Micky Mouse"
		, "description": "gemütlich"
	},{
		  "indexNumber": 12345680
		, "name": 'Arbeitstisch zum arbeiten'
		, "description": "nicht zum spielen"
	},{
		  "indexNumber": 12345681
		, "name": 'Handtuch blau'
		, "description": "Es ist blau und flauschig"
	}];

	beforeEach(function (done) {
		var models = app.context.models;
		mockgoose.reset();
		async.each(items, function(item, callback) {
			models.items.addItem(item , function(err, document){
				if(err){ console.error(err); }
				console.log("insert item "+ document._id);
				callback();
			});
		}, function end(){
			done();
		});
	});

	it('should have some documents to search in', function(done){
		var models = app.context.models;
		models.items.count(function(err, result){
 			chai.expect(err).to.be.null;
 			chai.expect(result).to.be.above(0);
 			done();
 		});
	});

	it('should find something when the searched name is exact', function(done){
		var models = app.context.models;
		models.itemsSearch.search("Bett", function(err, documents){
			chai.expect(err).to.be.null;
			chai.expect(documents).to.have.length.above(0);
			chai.expect(_.first(documents).name).to.be.equals("Bett");
			done();
		});
	});
	
	it('should find something when the searched name is exact', function(done){
		var models = app.context.models;
		models.itemsSearch.search("zum", function(err, documents){
			chai.expect(err).to.be.null;
			chai.expect(documents).to.have.length.above(0);
			chai.expect(_.first(documents).name).to.be.equals("Arbeitstisch zum arbeiten");
			done();
		});
	});
	
	it('should find something in description', function(done){
		//var models = app.context.models;
		var models = app.context.models;
		models.itemsSearch.search("spielen", function(err, documents){
			chai.expect(err).to.be.null;
			chai.expect(documents).to.have.length.above(0);
			chai.expect(_.first(documents).indexNumber).to.be.equals(12345680);
			done();
		});
	});

});
