/**
 * collections/items.js
 */

define([
    'backbone'
    // Collections & Models
    , 'models/item'
], function (
	Backbone
	, Model
){
	var Collection = Backbone.Collection.extend({
	  model: Model
	  , url: '/items'
	  
	  // pages
	  , count: null
	  , current: null
	  , last: null
	  , next: null
	  , prev: null
	  , pages: []
	  
	, parse: function(response, options){
		this.count = response.count || 0;
		this.current = response.current || 0;
		this.last = response.last || null;
		this.next = response.next || null;
		this.prev = response.prev || null;
		this.pages = response.pages || [];
		
		if(response.results){
			return response.results;
		}
		return response;
	}
	});
	return Collection;
});