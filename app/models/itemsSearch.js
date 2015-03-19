"use strict";

var _				= require('underscore')
	, mongoose		= require('mongoose')
	, paginate		= require('mongoose-query-paginate')
	, S				= require('string')
	;

var ObjectId = mongoose.Types.ObjectId;

/**
 * @class
 * Items Model
 *
 * @returns {object} Object of functions
 * @params object app Global application scope
 */
var ItemSearch = module.exports = function feedback(app) {

	/**
	 * @constant Define how many items should shown per page
	 */
	var showPerPage = 20;

	// Item schema definition
	var Item = require(__dirname +'/itemsSchema');
	

	// Bast-Options that are uses in every search
	var searchOptions = {
    	  fieldToSearch: 'name'			// which field you want to search 
	    , caseSensitive: false 			// apply case sensitivity to your search 
	}

	var search = function search(term, callback){
		var p = [];
		var filterd = _.filter( _.keys(Item.schema.paths), function(elm){ 
			if(S(elm).startsWith("_")){ return false; } 
			if(Item.schema.paths[elm].instance != "String"){
				return false;
			}
			return true; 
		});
 		_.each(filterd, function(key){
 			var m = {};
 			m[key] = { $regex: term, $options: 'si' };
 			p.push(m);
 		});
 		var s = { $or: p };
 		Item.find( s, function(err, docs) {
 			callback(err, docs);
 		});
	}
	 
	/** 
	 * @public	Feedback api
	 * @returns object of functions
	 */
	 return {
		  search: 					search
	 };

};

