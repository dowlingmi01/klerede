var core = require('./_core.js');

module.exports = {
	get:function (venueID, onSuccess) {
		var route = "/users?venue_id="+venueID;
		core.getData(route, onSuccess);
	},
	patch:function (userID, firstName, lastName, email, roleID, venueID, onSuccess, onError) {
		var route = "/users/"+userID;
		var data = $.param({first_name:firstName, last_name:lastName, email:email, role_id:roleID, venue_id:venueID});

		core.patchData(route, onSuccess, data, {error:onError});

	},
	pass:function (userID, oldPassword, password, onSuccess, onError) {
		//POST users/{user_id}/pass
		//Params {oldPassword, password}
		//Verify and change password of {user_id}
		var route = "/users/"+userID+"/pass";
		var data = {oldPassword:oldPassword, password:password};
		core.postData(route, onSuccess, data, {error:onError});
	},
	new:function (first_name, last_name, email, role_id, venue_id, onSuccess, onError) {
		// POST api/v1/users
		// Params: {name, email, password, role_id, venue_id}
		// Create new user
		var route = "/users";
		var data = {first_name:first_name, last_name:last_name, email:email, role_id:role_id, venue_id:venue_id};
		core.postData(route, onSuccess, data, {error:onError});
	},
	delete:function (userID, onSuccess, onError) {
		// DELETE users/{user_id}
		//
		// Physically delete user, can't be unerased.
		var route = "/users/"+userID;
		
		core.deleteData(route, onSuccess, {}, {error:onError});
		
	}
}