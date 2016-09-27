exports.storeLocal = function (key, data) {
	localStorage.setItem(key, JSON.stringify(data));
}

exports.clearLocal = function (key) {
	localStorage.removeItem(key);
}

exports.getLocal = function (key) {
	var local = localStorage[key];
	if (!local) return false;
	try {
	 	var data = JSON.parse(localStorage[key]);
		return data;
	} catch (e) {
		console.error('local-storage:getLocal() error', e);
		return false;
	}
}
