/**
 * models/items.js
 */

define([

], function() {
	// ***********************************************

    var ItemModel = Backbone.Model.extend({
		  idAttribute: "indexNumber"
        , url: function(){
         	return '/items/'+ this.get('id');
        }
        , parse: function(response, options){
        	if(response && response.indexNumber){
	        	response.id = response.indexNumber;
	        }
        	return response;
        }
        , defaults:{
         	  name: ''
         	, owner: ''
         	, description: ''
         }
    });
    return ItemModel;
});