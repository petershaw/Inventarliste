/**
 * views/editor.js
 */

define([
    'jquery'
    , 'underscore'
    , 'backbone'
    // Collections & Models
    , 'models/item'
    // Text template
    , 'text!templates/editor.html'
], function (
	  $
	, _
	, Backbone
	, Model
	, Template
){
    var DashboardView = Backbone.View.extend({

        el: $('#editor')

        , events: {
             'click [data-action="save"]':		'shouldAddItem'
        	,'click [data-action="cancel"]':	'shouldCancel'
           , 'change input': 					'didValueChange'
		   , 'change textarea': 				'didValueChange'
        }

        , initialize: function () {
        	//this.collection = new Collection();
			this.render();
        }

        /**
         * Render models to view
         * @returns void
         */
        , render: function(err, msg) {
        	var that = this;
        	that.model = that.model || new Model();
            var compiledTemplate = _.template(Template);
            this.$el.html(compiledTemplate({
            	data: {
	            	error: err
	            	, message: msg
	            }
            	, model: that.model
            }));
            if(that.model.isNew()){
	            $('[name="indexNumber"]').focus();
	        } else {
	            $('[name="name"]').focus();
	        }
	        $('.alert-success').fadeOut(4000);
        }
        
        , didValueChange: function valueChange(event){
        	var that = this;
        	if(event.target.name === 'indexNumber'){
	        	that.model = new Model({id: event.target.value});
	        	that.model.fetch({
	        		success: function ok( model, response, options ){
		        		that.model = model;
	        			return that.render();
	        		}
	        		, error: function err(model, err){
	        			if(err.status === 204){
	        				// ist noch nicht vorhanden, anlegen
	        				that.model = model;
	        				return that.render();
	        			} else {
	        				that.render(err.statusText);
	        			}
	        		}
	        	});
        	}
        	that.model.set(event.target.name, event.target.value);
        }
        
        , shouldAddItem: function add(event){
        	var that = this;
        	var saveresponse = that.model.save();
        	saveresponse.error(function(){ 
        		return that.render("Item konnte <b>nicht</b> gespeichert werden.");
        	});
        	saveresponse.success(function(){ 
 				that.collection.add(that.model);
 				delete that.model;
        		return that.render(null, "Item wurde erfolgreich hinzugefügt");
        		$(document).trigger("reload");
        	});
        }
        
        , shouldCancel: function add(event){
        	var that = this;
	        delete that.model;
    		return that.render();
        }
        
    });

    return DashboardView;
});