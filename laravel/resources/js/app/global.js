/*******************************************************************/
/************************* GLOBAL FUNCTIONS ************************/
/*******************************************************************/

var global = Function('return this')();

global.Promise = require("es6-promise").Promise;


/**********************************/
/******** GOOGLE ANALYTICS ********/
/**********************************/

var analytics = require("./analytics.js");
analytics.create(global_ga_id);


/**********************************/
/******** GLOBAL LOAD USER ********/
/**********************************/

var getLoggedUser = require("./kapi/auth.js").getLoggedUser;
var venue = require("./kapi/venue.js");
var wnt = require("./wnt.js");

function loadUser() {
	getLoggedUser(onUserGet, onUserError);
}

function onUserGet (user) {
	wnt.venueID  = user.venue_id+"";
	venue(
		wnt.venueID,
		wnt.onVenueDataGet
	);
    analytics.addView(user.venue_id, user.id);
};

function onUserError(error) {
	window.location = 'login';
}

global.loadUser = loadUser;
