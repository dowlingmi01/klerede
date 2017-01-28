var core = require('./_core.js');

exports.sales = {
    get: function(venueID, year, onSuccess, actuals, limitDate) {
        var route = "/goals/sales/" + venueID + "/" + year;
        if (actuals===true) {
            route = route + "?actuals=true";
            if(limitDate) {
                route = route + "&limit_date="+limitDate;
            }
        }
        core.getData(route, onSuccess);
    },
    put: function(venueID, year, onSuccess, data, channel, type, subChannel) {

        subChannel = subChannel ? ("/" + subChannel) : "";

        var route = "/goals/sales/" + venueID + "/" + year + "/" + channel + "/" + type + subChannel;
        core.putData(route, onSuccess, data);
    }
}
