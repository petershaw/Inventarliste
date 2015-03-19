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
        
        , queryTerm: null
		
		, currentPage: 1
		
        , events: {
             'click [data-action="next"]':			'shouldLoadNextPage'
        	,'click [data-action="prev"]':			'shouldLoadPrevPage'
        	,'click [data-action="page"]':			'shouldLoadPage'
        	,'click [data-id]':					'shouldEdit'
        	,'mouseover [data-omo="underline"]':	'shouldUnderline'
        	, 'change input': 						'didValueChange'
        }

        , initialize: function () {
        	var that = this;
        	that.globalEvent = _.extend(window, Backbone.Events);
        	
        	this.fetchAndRender();
        	this.collection.on('add', function(model){
        		that.fetchAndRender();
        	});
        	this.collection.on('remove', function(model){
	        	that.fetchAndRender();
        	});
        }
		
		, fetchAndRender: function(){
			var that = this;
			var data = {page: that.currentPage};
			if(this.queryTerm && this.queryTerm.length > 0){
				data.q = this.queryTerm;
			}
			this.collection.fetch({
        		data: data
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
            $('[name="q"]').val(this.queryTerm || '');
	        $('.alert-success').fadeOut(4000);
        }
        
        , didValueChange: function valueChange(event){
        	var that = this;
        	if(event.target.name == "q"){	// perform query
        		this.queryTerm = event.target.value;
        		return this.fetchAndRender();
        	}
        	
        	console.log( event.target.name, event.target.value );
        }
        
        , shouldUnderline: function underline(event){
        	$(event.target).addClass('omo-underline');
        	$(event.target).mouseout(function mouseout(){
	        	$(event.target).removeClass('omo-underline');
        	});
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
        
        , shouldEdit: function edit(event){
        	var id = $(event.target).data('id');
        	this.globalEvent.trigger("item:edit", id);
        }
        
    });

    return DashboardView;
});