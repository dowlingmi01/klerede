var core = require('./_core.js');

module.exports = {
    boxes: function(venueID, onSuccess) {
        var route = "/dashboard/boxes?venue_id="+venueID;
        core.getData(route, onSuccess);
    }
}