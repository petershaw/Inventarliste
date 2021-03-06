/**
 * 
 */
require.config({

	"baseUrl": "app/",

    "shim": {
        "backbone": {
            deps: ["jquery", "underscore"],
            exports: "Backbone"
        },
        "underscore": {
            exports: "_"
        },
        "bootstrap": {
            deps: ["jquery"],
            exports: "$.fn.popover"
        },
        "data-table": {
            deps: ["jquery"],
            exports: "$.fn.dataTable"
        },
        "data-table-bootstrap": {
            deps: ["data-table"],
            exports: "$.fn.dataTable"
        }
    },

    "paths": {
        // App
        "main"                : "main"

        // Core
        , "jquery"              : "../components/jquery/dist/jquery"
        , "underscore"          : "../components/underscore/underscore"
        , "backbone"            : "../components/backbone/backbone"
        , "text"                : "../components/requirejs-text/text"
    },

    "priority": [
        "jquery"
    ]

});