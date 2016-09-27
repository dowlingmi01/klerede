var getData = require("./_core.js").getData;

exports.query = function(venueID, date, onSuccess, hourly) {
    var route = "/weather/query/",
        data = {
            venue_id: venueID
        };

    if (typeof date == "object") {
        data.from = date.from;
        data.to = date.to;
    }

    if (hourly === undefined) {
        hourly = false;
    }
    data.hourly = hourly;

    getData(route, onSuccess, data);
}
