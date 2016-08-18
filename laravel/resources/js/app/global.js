/*******************************************************************/
/************************* GLOBAL FUNCTIONS ************************/
/*******************************************************************/


var global = Function('return this')();

//Kutils functions
(function(scope) {
	if (!scope.KUtils) {
		var _temp = {};
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
		
		var _user;
		
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
			console.log(arg);
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

		//Public
		scope.KAPI = {
			// custom:function (method, route, onSuccess, data, options) {
			// 	_srdata(method, route, onSuccess, data, options);
			// },
			goals:{
				sales: {
					get:function (venueID, year, onSuccess) {
						var route = "/goals/sales/"+venueID+"/"+year;
						_getData(route, onSuccess);
					},
					put:function (venueID, year, onSuccess, data, channel, type, subChannel) {
						
						subChannel = subChannel ? ("/"+subChannel) : "";
						
						var route = "/goals/sales/"+venueID+"/"+year+"/"+channel+"/"+type+subChannel;
						_putData(route, onSuccess, data);
					}
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
			roles:function (onSuccess) {
				var route = "/roles";
				_getData(route, onSuccess);
			},
			users:{
				get:function (venueID, onSuccess) {
					var route = "/users?venue_id="+venueID;
					_getData(route, onSuccess);
				},
				patch:function (userID, firstName, lastName, email, roleID, venueID, onSuccess, onError) {
					var route = "/users/"+userID;
					var data = $.param({first_name:firstName, last_name:lastName, email:email, role_id:roleID, venue_id:venueID});

					_patchData(route, onSuccess, data, {error:onError});

				}
			},
			auth:{
				recovery:function (email, onSuccess, onError) {

					var route="/auth/recovery";
					var data = {email:email};

					_postData(route, onSuccess, data, {error:onError});
				},
				reset:function (token, email, password, onSuccess, onError) {
					var route="/auth/reset";
					var data = {email:email, token:token, password:password};

					_postData(route, onSuccess, data, {error:onError});
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
					
					var saveUserOnSucces = function(data) {
						_user = data.user;
						onGetLoggedUser(data.user);
					};
					
					var route = "/auth/logged";
					_getData(route, saveUserOnSucces, undefined, {error:onError});
					
				},
				getUser:function () {
					if(!_user) {
						throw new Error("Please call first KAPI.auth.getLoggedUser() function.");
					}
					
					return _user;
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


