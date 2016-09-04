/*******************************************************************/
/************************* GLOBAL FUNCTIONS ************************/
/*******************************************************************/


var global = Function('return this')();


(function(scope){
	if(!scope._l) {

		var _lang = {};
		_lang['user_not_found'] = "Error: user not found.";
		_lang['invalid_credentials'] = "Invalid credentials.";
		_lang['could_not_reset_password'] = "Could not reset your password.";
		_lang['could_not_reset_password'] = "Could not reset your password.";
		
		scope._l = function(key){
			if (_lang[key]) {
				return _lang[key]
			}
			return key;
		};
		
	}
})(global);


//Kutils functions
(function(scope) {
	if (!scope.KUtils) {
		var _temp = {};
        function _forceDigits(n, d) { //n:number, d:number -> string
            var s = n.toString();
            while (s.length < d) {
                s = "0"+s;
            }
            return s;
        };
		scope.KUtils = {
			isValidPassword:function(p1, p2) {
				
				if (_isEmpty(p1)) {
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
			},
            date: {
                weatherFormat:function(s, periodType) {
                    // Friday, June 3, 2016
                    if(periodType == "quarter") {
                        var fromDate = new Date(_date.getDateFromWeek(s));
                        var toDate = new Date(_date.addDays(fromDate,6));
                        // Tue Aug 30 2016
                        //Mar 27 - Apr 2, 2016
                        var from = (fromDate.toDateString()).split(" ");
                        var to = (toDate.toDateString()).split(" ");
                        return from[1]+" "+from[2]+" - "+to[1]+" "+to[2]+", "+from[3];
                    }
                    
                    var weekDays = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']; //TODO: take this to a global context
                    
                    var date = new Date(s);
                    var d = weekDays[date.getUTCDay()];
                    var m = wnt.months[date.getUTCMonth()];
                    
                    return d+", "+m+" "+date.getUTCDate()+", "+date.getUTCFullYear();
                },
                detailsFormat:function(date1, date2) {
                    
                    if(!date1 || !date2) return "";
                    
                    var fromDate = new Date(date1);
                    var toDate = new Date(date2);
                    
                    var from = (fromDate.toDateString()).split(" ");
                    var to = (toDate.toDateString()).split(" ");
                    return from[1]+" "+from[2]+" - "+to[1]+" "+to[2]+", "+from[3];
                },
                barFormat:function(s, periodType) {
                    if(periodType == "quarter") {
                        s = _date.getDateFromWeek(s);
                    }
                    
                    var date = new Date(s);
                    var d =_forceDigits(date.getUTCDate(),2);
                    var m =_forceDigits(date.getUTCMonth()+1,2);

                    if(periodType == "month") return d;

                    return m+"."+d;
                },
                serverFormat:function (date, periodType) {
                    var date = new Date(date);
                    if (periodType == "week") {
                        return _date.serverFormatWeek(date);
                    };
                    var d =date.getUTCDate();
                    var m =date.getUTCMonth()+1;
                    return date.getUTCFullYear()+"-"+m+"-"+d;
                },
                serverFormatWeek:function (date) {
                    var date = new Date(date);
                    var w = _date.getWeekNumber(date);
                    return date.getUTCFullYear()+"-"+w;
                },
                localFormat:function (serverDate) { //yyyy-mm-dd -> mm/dd/yyy
                    var date = new Date(serverDate);
                    return _date.formatFromDate(date);
                },
                formatFromDate:function (date) {
                    var d =_forceDigits(date.getUTCDate(),2);
                    var m =_forceDigits(date.getUTCMonth()+1,2);
                    return m+"/"+d+"/"+date.getUTCFullYear();
                },
                addDays:function (date, days) {
                    var result = new Date(date);
                    result.setDate(result.getDate() + days);
                    return _date.formatFromDate(result);
                },
                addMonths:function (date, months) {
                    var result = new Date(date);
                    result.setMonth(result.getMonth() + months);
                    return _date.formatFromDate(result);
                },
                addYears:function (date, years) {
                    var result = new Date(date);
                    result.setUTCFullYear(result.getUTCFullYear() + years);
                    return _date.formatFromDate(result);
                },
                getWeekNumber:function (d) {
                    var date = new Date(d);
                    var jan1 = new Date("01/01/"+date.getUTCFullYear());
                    var msec = date.getTime() - jan1.getTime(); //diff in milliseconds
                    var weeks = Math.floor(msec/(1000*60*60*24*7)); //millisecondsasecond*secondsaminute*minutesanhour*hoursaday*weekdays
                    return weeks;
                },
                getQuarterNumber:function (d) {
                    var date = new Date(d);
                    var month = date.getUTCMonth();
                    return Math.floor(month/4) + 1;
                },
                quarterToDates:function(q, y) {            //q,yyyy -> mm/dd/yyyy
                    
                    // console.log(q, y);
                    
                    if (q == 0) {
                        y -= 1;
                        q = 4;
                    }
                    
                    var fromMonth = (q-1)*3 + 1;
                    var toMonth = (q==4) ? 1 : q*3 + 1;
                    var from = new Date(fromMonth+"/01/"+y);
                    var to = new Date(toMonth+"/01/"+y);
                    to.setUTCDate(0);
                    var dates = {from: _date.formatFromDate(from), to: _date.formatFromDate(to)};
                    // console.log(q, y, dates);
                    return dates;
                },
                getDateFromWeek:function (s) { //YYYY-W -> mm/dd/yyyy
                    var a = s.split("-");
                    var year = parseInt(a[0]);
                    var week = parseInt(a[1]);
                    var date = new Date("01/01/"+year.toString());
                    return _date.addDays(date, week*7);
                }
            },
            number:{
                forceDigits:function (n, d) {
                    return _forceDigits(n,d);
                },
                formatAmount:function(n) {
                    // return n;
                    if(n===null || n===undefined || isNaN(n) || n===0) return "0";
                    
                    if (Math.abs(n) >= 1000) {
                        //comma values, no decimals
                        var s = n.toFixed(0);
                        var r = "";
                        for (var i = s.length - 1; i >= 0; i--) {
                            r = s.charAt(i) + r;
                            
                            if ((s.length-i) % 3 === 0 && i>0 ) {
                                r = ","+r;
                            }
                        };
                        return r;
                    } else if (Math.abs(n) > 100) {
                        //one decimal
                        return n.toFixed(1);
                    } else {
                        //2 decimals
                        return n.toFixed(2);
                    }
                }
            }
		};
		
        var _date = scope.KUtils.date;
        var _isValidPassword = scope.KUtils.isValidPassword;
        var _isEmail = scope.KUtils.isEmail;
        var _isEmpty = scope.KUtils.isEmpty;
        var _storeLocal = scope.KUtils.storeLocal;
        var _clearLocal = scope.KUtils.clearLocal;
        var _date = scope.KUtils.date;
        var _number = scope.KUtils.number;
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

		//Public
		scope.KAPI = {
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
				},
                getSimpleQuery:function (period, members, channel, type, operation, periodType) { //yyyy-mm-dd, yyyy-mm-dd, null for membres+nonmembers, null for all channels, 'sales', 'detail', 'date'
                    var query = _stats.getQuery(period, period, members, channel, type, operation, periodType);                    
                    query.periods = period;
                    return query;
                    
                },
                getQuery:function (from, to, members, channel, type, operation, periodType) { //yyyy-mm-dd, yyyy-mm-dd, null for membres+nonmembers, null for all channels, 'sales', 'detail', 'date'
                    
                    var query = {
                        periods: {
                            type: periodType,
                            from: from,
                            to: to,
                            kind:operation
                        },
                        specs: {
                            type: type,
                            channel:channel,
                            members:members
                        }
                    };
                    
                    if (!channel || channel=='ALL')
                        delete query.specs.channel;
                    
                    if (!operation || operation == 'detail')
                        delete query.periods.kind;
                    
                    if (!type)
                        query.specs.type = 'sales';

                    if (!periodType || periodType=='date')
                        delete query.periods.type;

                    if (members === null || members===undefined || type === 'visits')
                        delete query.specs.members;
                    
                    if (type === 'visits') {
                        if (members===true) 
                            query.specs.kinds = ["membership"];
                        else if (members===false)
                            query.specs.kinds = ["ga", "group"];
                    }
                    
                    if (typeof type === "object") {
                        query.specs.type = type.type;
                        query.specs.kinds = type.kinds;
                    }
                    
                    
                    return query;                    
                },
                getQueryDays:function (from, to, members, channel, type) { //yyyy-mm-dd, yyyy-mm-dd, null for all, null for all, 'sales'
                    return _stats.getQuery(from, to, members, channel, type);
                },
                getQueryWeeks:function(from, to, members, channel, type) {
                    return _stats.getQuery(from, to, members, channel, type, 'detail', 'week');
                },
                getQueryDaysSum:function (from, to, members, channel, type) { //yyyy-mm-dd, yyyy-mm-dd, null for all, null for all, 'sales'
                    return _stats.getQuery(from, to, members, channel, type, 'sum');
                },
                getQueryWeeksSum:function (from, to, members, channel, type) { //yyyy-mm-dd, yyyy-mm-dd, null for all, null for all, 'sales'
                    return _stats.getQuery(from, to, members, channel, type, 'sum', 'week');
                },
                getQueryDaysAverage:function (from, to, members, channel, type) { //yyyy-mm-dd, yyyy-mm-dd, null for all, null for all, 'sales'
                    return _stats.getQuery(from, to, members, channel, type, 'average');
                },
                getQueryWeeksAverage:function (from, to, members, channel, type) { //yyyy-mm-dd, yyyy-mm-dd, null for all, null for all, 'sales'
                    return _stats.getQuery(from, to, members, channel, type, 'average', 'week');
                },
                getQueryDailyWeeksAverage:function (f, t,  members, channel, type, operation, periodType) { //yyyy-mm-dd, yyyy-mm-dd, null for all, null for all, 'sales'
                    //returns {d0w0:{query},d1w1:{query}.. etc}
                    var queries = {};
                    var w = 0;
                    while(1) {
                        for (var d = 0; d<7; d++) {
                            var formated = f.getUTCFullYear()+"-"+ (f.getUTCMonth()+1) +"-"+f.getUTCDate();
                            queries["d"+d+"w"+w] = _stats.getSimpleQuery(formated, members, channel, type, operation, periodType);
                            f.setUTCDate(f.getDate()+1);
                        }
                        if (f.getTime() > t.getTime()) {
                            break;
                        } else if( w++ > 1024) {                                        //1024 limit to avoid inf loops
                            throw new Error("getQueryDailyWeeksAverage: query is getting too big -> "+w);
                        }
                    }
                    return queries;
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

				},
				pass:function (userID, oldPassword, password, onSuccess, onError) {
					//POST users/{user_id}/pass
					//Params {oldPassword, password}
					//Verify and change password of {user_id}
					var route = "/users/"+userID+"/pass";
					var data = {oldPassword:oldPassword, password:password};
					_postData(route, onSuccess, data, {error:onError});
				},
				new:function (first_name, last_name, email, role_id, venue_id, onSuccess, onError) {
					// POST api/v1/users
					// Params: {name, email, password, role_id, venue_id}
					// Create new user
					var route = "/users";
					var data = {first_name:first_name, last_name:last_name, email:email, role_id:role_id, venue_id:venue_id};
					_postData(route, onSuccess, data, {error:onError});
				},
				delete:function (userID, onSuccess, onError) {
					// DELETE users/{user_id}
					//
					// Physically delete user, can't be unerased.
					var route = "/users/"+userID;
					
					_deleteData(route, onSuccess, {}, {error:onError});
					
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
        var _goals = scope.KAPI.goals;
        var _stats = scope.KAPI.stats;
        var _weather = scope.KAPI.weather;
        var _venue = scope.KAPI.venue;
        var _users = scope.KAPI.users;
        var _auth = scope.KAPI.auth;
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


