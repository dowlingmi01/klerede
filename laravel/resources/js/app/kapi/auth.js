var core = require("./_core.js");

module.exports = {
	recovery:function (email, onSuccess, onError) {

		var route="/auth/recovery";
		var data = {email:email};

		core.postData(route, onSuccess, data, {error:onError});
	},
	reset:function (token, email, password, onSuccess, onError) {
		var route="/auth/reset";
		var data = {email:email, token:token, password:password};

		core.postData(route, onSuccess, data, {error:onError});
	},
	login:function (email, password, onSuccess, onError) {
		var route="/auth/login";
		var data = {email:email, password:password};
		
		//call onError only with json message
		var onErrorMessageJSON = function(request, status, error) {
			onError(request.responseJSON);
		}
		
		//save token on success
		var saveTokenOnSuccess = function(data) {
			// console.log(data);
			core.saveToken(data.token);
			onSuccess(true);
		}
		
		core.postData(route, saveTokenOnSuccess, data, {error:onErrorMessageJSON});
	},
	logout:function (onSuccess, onError) {
		var route = "/auth/logout";
		
		//save token on success
		var clearTokenOnSuccess = function(data) {
			core.clearToken();
			onSuccess(true);
		}
		
		core.postData(route, clearTokenOnSuccess, undefined, {error:onError});
	},
	getLoggedUser:function(onGetLoggedUser, onError) {
		
		var saveUserOnSucces = function(data) {
			core.user = data.user;
			onGetLoggedUser(data.user);
		};
		
		var route = "/auth/logged";
		core.getData(route, saveUserOnSucces, undefined, {error:onError});
		
	},
	getUser:function () {
		if(!core.user) {
			throw new Error("Please call first KAPI.auth.getLoggedUser() function.");
		}
		
		return core.user;
	},
    getUserPermissions:function() {
		if(!core.user) {
			throw new Error("Please call first KAPI.auth.getLoggedUser() function.");
		};
        var permissions = {};
        for ( var i=0; i< core.user.permissions.length; i++ ) {

            var permission = core.user.permissions[i];

            if(permission && permission.length)
                permissions[permission] = true;

        }
        
        return permissions;
    }
}