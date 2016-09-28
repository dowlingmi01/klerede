exports.isValidPassword = function(p1, p2) {
	
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
	
}

exports.isEmail = function (email) {
  var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  return regex.test(email);
}


var _isEmpty = exports.isEmpty = function (field) {
	if(!field) return true;

	return (field.length==0);
}
