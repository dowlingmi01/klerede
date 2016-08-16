/*******************************************************************/
/************************* GLOBAL FUNCTIONS ************************/
/*******************************************************************/


var global = Function('return this')();

//Kutils functions
(function(scope) {
	if (!scope.KUtils) {
		scope.KUtils = {
			isValidPassword:function(p1, p2) {
				
				if (scope.KUtils.isEmpty(p1)) {
					return "Please enter a valid password."
				};
				
				if (typeof p1 === "string") {
					if (p1.length < 8) {
						return "Password is too short."
					}
					if (p1.length > 16) {
						return "Password is too long."
					}
				} else {
					return "Password is not valid."
				}
				
				if (p1 !== p2) {
					return "Passwords don't match."
				};
				
				return true;
				
			},
			isEmail: function (email) {
			  var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
			  return regex.test(email);
			},
			isEmpty: function (field) {
				if(!field) return true;
	
				return (field.length==0);
			},
			storeLocal: function (key, data) {
				localStorage.setItem(key, JSON.stringify(data));
			},
			clearLocal: function (key) {
				localStorage.removeItem(key);
			},
			getLocal: function (key) {
				var local = localStorage[key];
				if (!local) return false;
				try {
				 	var data = JSON.parse(localStorage[key]);
					return data;
				} catch (e) {
					console.log(e);
					return false;
				}
			}
		};
		
	}
})(global);

//KAPI functions
(function (ajax, scope) {
	//verify if KAPI already exists
	if(!scope.KAPI) {
		
		//Private
		
		var KUtils = scope.KUtils;
		
		var _prefix = "/api/v1";
		
		var _token = KUtils.getLocal('_token');
		
		function _saveToken(token) {
			_token = token;
			KUtils.storeLocal('_token', token);
		}
		function _clearToken() {
			KUtils.clearLocal('_token');
			_token = false;
		}
		function _srdata(method, route, onSuccess, data, options) {
			// console.log([route, data]);
			// return;
			var arg = {
				type: method,
				url: _prefix+route+"?token="+_token,
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

		//Public
		scope.KAPI = {
			// custom:function (method, route, onSuccess, data, options) {
			// 	_srdata(method, route, onSuccess, data, options);
			// },
			goals:{
				sales: function (venueID, year, onSuccess) {
					var route = "/goals/sales/"+venueID+"/"+year;
					_getData(route, onSuccess);
				}
			},
			stats:{
				query:function(venueID, queries, onSuccess, onError) {
					var route = "/stats/query";
					var options = {};
					if(onError !== undefined) {
						options.error = onError;
					}
					_postData(route, onSuccess, {venue_id:venueID, queries:queries}, options);
				}
			},
			weather:{
				query:function(venueID, date, onSuccess, hourly){
					var route = "/weather/query/",
						data = {
							venue_id:venueID
						}
					;
					
					if (typeof date == "object") {
						data.from = date.from;
						data.to = date.to;
					}
					
					if (hourly === undefined) {
						hourly = false;
					}
					data.hourly = hourly;
					
					_getData(route, onSuccess, data);
				}
			},
			venue:function (venueID, onSuccess) {
				var route = "/venue/"+venueID;
				_getData(route, onSuccess);
			},
			auth:{
				login:function (email, password, onSuccess, onError) {
					var route="/auth/login";
					var data = {email:email, password:password};
					
					//call onError only with json message
					var onErrorMessageJSON = function(request, status, error) {
						onError(request.responseJSON);
					}
					
					//save token on success
					var saveTokenOnSuccess = function(data) {
						console.log(data);
						_saveToken(data.token);
						onSuccess(true);
					}
					
					_postData(route, saveTokenOnSuccess, data, {error:onErrorMessageJSON});
				},
				logout:function (onSuccess, onError) {
					var route = "/auth/logout";
					
					//save token on success
					var clearTokenOnSuccess = function(data) {
						_clearToken();
						onSuccess(true);
					}
					
					_postData(route, clearTokenOnSuccess, undefined, {error:onError});
				},
				getLoggedUser:function(onGetLoggedUser, onError) {

					var route = "/auth/logged";
					_getData(route, function(data){onGetLoggedUser(data.user)}, undefined, {error:onError});
					
				}
			}
		};
	}
})(jQuery.ajax, global);



function isEmail(email) {
	throw new Error("Must use KUtils.<your-function>");
}
function isEmpty(field) {
	throw new Error("Must use KUtils.<your-function>");
}
function storeLocal(key, data) {
	throw new Error("Must use KUtils.<your-function>");
}
function clearLocal(key) {
	throw new Error("Must use KUtils.<your-function>");
}
function getLocal(key) {
	throw new Error("Must use KUtils.<your-function>");
}


