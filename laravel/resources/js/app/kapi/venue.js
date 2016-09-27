var getData = require("./_core.js").getData;

module.exports = function (venueID, onSuccess) {
	var route = "/venue/"+venueID;
	getData(route, onSuccess);
}