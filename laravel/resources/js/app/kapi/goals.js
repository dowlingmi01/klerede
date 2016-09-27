var core = require('./_core.js');

exports.sales = {
    get: function(venueID, year, onSuccess) {
        var route = "/goals/sales/" + venueID + "/" + year;
        core.getData(route, onSuccess);
    },
    put: function(venueID, year, onSuccess, data, channel, type, subChannel) {

        subChannel = subChannel ? ("/" + subChannel) : "";

        var route = "/goals/sales/" + venueID + "/" + year + "/" + channel + "/" + type + subChannel;
        core.putData(route, onSuccess, data);
    }
}
