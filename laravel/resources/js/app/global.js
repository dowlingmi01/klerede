/*******************************************************************/
/************************* GLOBAL FUNCTIONS ************************/
/*******************************************************************/

var global = Function('return this')();

global.Promise = require("es6-promise").Promise;

global.$ = global.jQuery = require("jquery");

global.moment = require("moment");

global.du = require("./kutils/date-utils");

require('console-polyfill');
