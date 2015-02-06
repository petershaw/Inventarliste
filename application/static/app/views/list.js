/**
 * views/list.js
 */

define([
    'jquery'
    , 'underscore'
    , 'backbone'
    // Collections & Models
    , 'models/item'
    // Text template
    , 'text!templates/list.html'
], function (
	  $
	, _
	, Backbone
	, Model
	, Template
){
    var DashboardView = Backbone.View.extend({

        el: $('#list')
		
		, currentPage: 1
		
        , events: {
             'click [data-action="next"]':		'shouldLoadNextPage'
        	,'click [data-action="prev"]':		'shouldLoadPrevPage'
        	,'click [data-action="page"]':		'shouldLoadPage'
           , 'change input': 					'didValueChange'
        }

        , initialize: function () {
        	var that = this;
        	this.fetchAndRender();
        	this.collection.on('add', function(model){
        		that.fetchAndRender();
        	});
        }
		
		, fetchAndRender: function(){
			var that = this;
			this.collection.fetch({
        		data: {page: that.currentPage}
        		, success: function(collection, response, options){
        			that.render();
        		}
        		, error: function(collection, response, options){	
        			that.render(response.statusText);
        		}
        	});		
		}
		
        /**
         * Render models to view
         * @returns void
         */
        , render: function(err, msg) {
        	var that = this;
            var compiledTemplate = _.template(Template);
            this.$el.html(compiledTemplate({
            	data: {
	            	error: err
	            	, message: msg
	            	, collection: that.collection
	            }
            	, collection: that.collection
            }));
	        $('.alert-success').fadeOut(4000);
        }
        
        , didValueChange: function valueChange(event){
        	var that = this;
        	console.log( event.target.name, event.target.value );
        }
        
        , shouldLoadNextPage: function add(event){
        	this.currentPage = this.currentPage +1;
    		return this.fetchAndRender();
        }
        
        , shouldLoadPrevPage: function add(event){
        	this.currentPage = this.currentPage -1;
    		return this.fetchAndRender();
        }
         
        , shouldLoadPage: function add(event){
        	this.currentPage = $(event.target).attr('data');
    		return this.fetchAndRender();
        }        
        
    });

    return DashboardView;
});