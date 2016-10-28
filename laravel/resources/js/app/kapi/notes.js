var core = require('./_core.js');

module.exports = {
    list: function(venueID, start_date, end_date, onSuccess) {
        var route = "/notes?venue_id="+venueID+"&start="+start_date+"&end="+end_date;
        core.getData(route, onSuccess);
    },
    get: function(id, venueID, onSuccess) {
        var route = "/notes/"+id+"?venue_id="+venueID;
        core.getData(route, onSuccess);
    },
    post: function(venueID, header, description, time_start, time_end, channels, tags, onSuccess, all_day, new_tags) {
        if (!new_tags) new_tags = [];
        if (all_day == null || all_day == undefined) all_day = false;
        var data = {
            header: header,
            description: description,
            all_day: all_day,
            time_start: time_start,
            time_end: time_end,
            channels: channels,
            tags: tags,
            new_tags: new_tags,
            venue_id: venueID
        };
		var route = "/notes";
		core.postData(route, onSuccess, data);
    },
    put: function(id, header, description, time_start, time_end, channels, tags, onSuccess, all_day, new_tags) {
        if (!new_tags) new_tags = [];
        if (all_day == null || all_day == undefined) all_day = false;
        var data = {
            header: header,
            description: description,
            all_day: all_day,
            time_start: time_start,
            time_end: time_end,
            channels: channels,
            tags: tags,
            new_tags: new_tags
        };
		var route = "/notes/"+id+"/";
        core.putData(route, onSuccess, data);
    },
    delete:function(id,venueID, onSuccess) {
        var route = "/notes/"+id+"?venue_id="+venueID;
        core.deleteData(route, onSuccess);
    }
    
}