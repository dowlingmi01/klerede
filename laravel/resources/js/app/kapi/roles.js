var getData = require("./_core.js").getData;

module.exports = function (onSuccess) {
	var route = "/roles";
	getData(route, onSuccess);
}