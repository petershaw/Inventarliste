/**
 * User: Hannes Moser <hannes@impossiblearts.com>
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

// 		"asyncjs"			  : "libs/async/lib/async",
// 
//         // Utils
//         "jquery.validate"     : "../plugins/jquery-validation-1.11.1/jquery.validate",
//         "jquery.browser"	  : "libs/jquery.browser/dist/jquery.browser.min",
// 
//         // UI
//         "bootstrap"                     : "../plugins/bootstrap/js/bootstrap",
//         "jquery-ui"                     : "../plugins/jquery-ui-1.10.3/jqueryui",
//         "jquery.ui.widget"              : "libs/jquery-file-upload/js/vendor/jquery.ui.widget",
//         // migrate to moment in the future?
//         "moment"                        : "libs/moment/moment",
//         // data-tables
//         "data-table"                    : "../plugins/data-tables/jquery.dataTables",
//         "data-table-bootstrap"          : "../plugins/data-tables/DT_bootstrap",
//         "templates"						: "./templates"
    },

    "priority": [
        "jquery",
//         "jquery-ui",
//         "jquery-ui-widget",
//         "data-table",
//         "data-table-bootstrap"
    ]

});