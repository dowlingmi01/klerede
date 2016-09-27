var storage = require('../kutils/local-storage.js');

var _prefix = "/api/v1";

var _token = storage.getLocal('_token');

var _user;

var _serverFormatWeek = require('../kutils/date-utils').serverFormatWeek;
var _serverFormat = require('../kutils/date-utils').serverFormat;

function _saveToken(token) {
	_token = token;
	storage.storeLocal('_token', token);
}
function _clearToken() {
	storage.clearLocal('_token');
	_token = false;
}
function _srdata(method, route, onSuccess, data, options) {
	// console.log([route, data]);
	// return;
	var token = "?token="+_token;
	if (route.indexOf("?")>0) {
		token = "&token="+_token;
	}
	
	var arg = {
		type: method,
		url: _prefix+route+token,
		async: true,
		cache: true,
		// success: onSuccess,
		success:function (data) {
			// console.log(data);
			onSuccess(data);
		},
		error:function(request, status, error) {
			console.log(request);
			throw new Error(route+" -> "+request.status+": "+request.statusText);
		}
	};
	
	if (data) {
		arg.data = data;
	}
	
	if (options) {
		for (var k in options) {
			arg[k] = options[k];
		}
	}
	// console.log(arg);
	ajax(arg);
}
function _postData(route, onSuccess, data, options) {
	_srdata("POST", route, onSuccess, data, options);
}
function _getData(route, onSuccess, data, options) {
	_srdata("GET", route, onSuccess, data, options);
}
function _putData(route, onSuccess, data, options) {
	_srdata("PUT", route, onSuccess, data, options);
}
function _patchData(route, onSuccess, data, options) {
	console.log("My name is _patchData but I use PUT");
	_srdata("PUT", route, onSuccess, data, options);
}
function _deleteData(route, onSuccess, data, options) {
	_srdata("DELETE", route, onSuccess, data, options);
}