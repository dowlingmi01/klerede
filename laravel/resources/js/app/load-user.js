var getLoggedUser = require("./kapi/auth.js").getLoggedUser;
var venue = require("./kapi/venue.js");
var wnt = require("./kcomponents/wnt.js");

var analytics = require("./analytics.js");
analytics.create(global_ga_id);


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

if(document.getElementById('load-user-js')){
    loadUser();
}