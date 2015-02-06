/**
 * controller/dashboard.js
 */
 
define([
	'collections/items'
	// Views
	, 'views/editor'
	, 'views/list'
	// Templates
], function(
	  Collection
	, EditorView
	, ListView
) {
    /**
     * Dashboard home
     */
    var index = function() {
    	var collection = new Collection();
    	
		var editor = new EditorView({
			collection: collection
		});
		var list = new ListView({
			collection: collection
		});	
    };
    
    /**
     * Returns an object with actions
     *
     * @returns {object}
     */
    return {
        index: index
    };

});