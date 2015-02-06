/**
 * Initialize the app by invoking the router
 */
 
define([
      'backbone'
    , 'jquery'
	], function(
      Backbone
    , JQuery
	) {
	
    // Extend Router
    var AppRouter = Backbone.Router.extend({

        // Define routes
        routes: {
            // Dashboard
            'dashboard'             : function() {
                require(['controller/dashboard'], function(Dashboard) {
                    Dashboard.index();
                });
            },
            '*index.html'             : function() {
                require(['controller/dashboard'], function(Dashboard) {
                    Dashboard.index();
                });
            },
            
            // Default
            '*actions'          : function(actions) {
                console.warn('No route:', actions);
            }
        }
    });

    jQuery(function() {
        // Be sure jquery is ready
        // Create router
        router = new AppRouter();
	
        // Start history
        Backbone.history.start({ pushState: true, root: '/static' });
    });

});