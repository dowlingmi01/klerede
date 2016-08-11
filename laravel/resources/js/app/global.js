/*******************************************************************/
/************************* GLOBAL FUNCTIONS ************************/
/*******************************************************************/


var global = Function('return this')();

(function (ajax) {
	//verify if KAPI already exists
	if(!global.KAPI) {
		
		//Private
		
		var _prefix = "/api/v1";
		
		function _srdata(method, route, onSuccess, data, options) {
			// console.log([route, data]);
			// return;
			var arg = {
				type: method,
				url: _prefix+route,
				async: true,
				cache: true,
				// success: onSuccess,
				success:function (data) {
					// console.log(data);
					onSuccess(data);
				},
				error:function(request, status, error) {
					console.log(request.responseText);
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
		global.KAPI = {
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
				query:function(venueID, queries, onSuccess) {
					var route = "/stats/query";
					_postData(route, onSuccess, {venue_id:venueID, queries:queries});
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
			}
		};
	}
})(jQuery.ajax);


function isEmail(email) {
  var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  return regex.test(email);
}
function isEmpty(field) {
	if(!field) return true;
	
	return (field.length==0);
}


function storeLocal(key, data) {
	localStorage.setItem(key, JSON.stringify(data));
}
function clearLocal(key) {
	localStorage.removeItem(key);
}
function getLocal(key) {
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


