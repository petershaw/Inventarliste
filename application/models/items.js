"use strict";

var _				= require('underscore')
	, mongoose		= require('mongoose')
	, paginate		= require('mongoose-query-paginate')
	;

var ObjectId = mongoose.Types.ObjectId;

/**
 * @class
 * Items Model
 *
 * @returns {object} Object of functions
 * @params object app Global application scope
 */
var Item = module.exports = function feedback(app) {

	/**
	 * @constant Define how many items should shown per page
	 */
	const showPerPage = 20;

	// Item schema definition
	var Item = require(__dirname +'/itemsSchema');
	 
	 /**
	  * @function	  
	  * Get a item by its ID.
	  * 
	  * @param ObjectId id of the document
	  * @param function callback that will be called with the results
	  * @example
	  * item.getById('507c7f79bcf86cd7994f6c0e', function(err, result){
	  *	   // do something with result.
	  * });
	  */
	 var getById = function getById(id, callback) {
		Item.findOne(
			{_id: ObjectId(id)}
			, function(err,doc) {
			   if(err){
				   app.log.error("Can not get item by id "+ id +". "+ JSON.stringify(err));
			   }
			   callback(err, doc);
		   }
		);
	 };
	 
	 /**
	  * @function	  
	  * Get a item by its indexNumber.
	  * 
	  * @param indexNumber  of the item
	  * @param function callback that will be called with the results
	  * @example
	  * item.getById('507c7f79bcf86cd7994f6c0e', function(err, result){
	  *	   // do something with result.
	  * });
	  */
	 var getByIndexNumber = function getById(indexNumber, callback) {
		Item.findOne(
			{indexNumber: indexNumber}
			, function(err,doc) {
			   if(err){
				   app.log.error("Can not get item by indexNumber "+ indexNumber +". "+ JSON.stringify(err));
			   }
			   callback(err, doc);
		   }
		);
	 };	 
	 
	 /**
	  * @function
	  * Get the total count of all items 
	  * 
	  * @param function Callback that will be called with the result
	  */
	 var count = function count(callback){
		Item.count(callback);
	 };

	 /**
	  * @function
	  * Adds a new item
	  * 
	  * @param object item
	  * @param function Callback that will be called with the result
	  */
	 var addItem = function add(item, callback){
		Item.create(item, callback);
	 };
	 
	  /**
	  * @function
	  * Updates a item
	  * 
	  * @param ObjectId id
	  * @param object new data
	  * @param function Callback that will be called with the result
	  */
	 var updateItem = function update(id, data, callback){
		Item.update({ _id: ObjectId(id) }, data, callback);				
	 };

	 /**
	  * @function
	  * get a filterd and sorted and paged list of all items
	  * 
	  * @param Number page
	  * @param object filters
	  * @param function Callback that will be called with the result
	  */
	 var getPagedList = function getPagedList(page, filters, callback){
		page = page || 1;
		var f = Item.find(
			filters
		).sort({ name: 1 });
		f.paginate({
			perPage: showPerPage
			, delta: 1
			, page: page
		}
		, callback);
	 };
	 

	/** 
	 * @public	Feedback api
	 * @returns object of functions
	 */
	 return {
		  getById:				getById
		, getByIndexNumber: 	getByIndexNumber
		, count:				count
		, addItem: 				addItem
		, updateItem: 			updateItem
		, getPagedList: 		getPagedList
		, showPerPage:			showPerPage
		, Model:				Item
	 };

};

