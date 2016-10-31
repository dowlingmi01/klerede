var core = require('./_core.js');

module.exports = {
    list: function(venueID, onSuccess) {
        var route = "/tags?venue_id="+venueID;
        core.getData(route, onSuccess);
    },
    get: function(id, venueID, onSuccess) {
        var route = "/notes/"+id+"?venue_id="+venueID;
        core.getData(route, onSuccess);
    },
    post: function(venueID, description, onSuccess) {
        
        var data = {
            description:description,
            venue_id:venueID
        };
		var route = "/tag";
		core.postData(route, onSuccess, data);
    },
    delete:function(id, venueID, onSuccess, onError, mergeID) {
        var route = "/tags/"+id+"?venue_id="+venueID + (mergeID ? "&merge_to="+mergeID : "");
        core.deleteData(route, onSuccess, {error:onError});
    }
}