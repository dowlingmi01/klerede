var core = require('./_core.js');

module.exports = {
    list: function(venueID, onSuccess) {
        var route = "/categories?venue_id="+venueID;
        core.getData(route, onSuccess);
    }
}