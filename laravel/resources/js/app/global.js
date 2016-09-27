/*******************************************************************/
/************************* GLOBAL FUNCTIONS ************************/
/*******************************************************************/


var saveAs = require("file-saver").saveAs;

var global = Function('return this')();

global.Promise = require("es6-promise").Promise;
