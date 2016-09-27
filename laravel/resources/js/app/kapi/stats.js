var postData = require("./_core.js").postData;
var serverFormatWeek = require("../kutils/date-utils").serverFormatWeek;
var serverFormat = require("../kutils/date-utils").serverFormat;

module.exports = {
    query: function(venueID, queries, onSuccess, onError) {
        var route = "/stats/query";
        var options = {};
        if (onError !== undefined) {
            options.error = onError;
        }
        postData(route, onSuccess, {
            venue_id: venueID,
            queries: queries
        }, options);
    },
    getQuery: function(from, to, members, channel, type, operation, periodType) { //yyyy-mm-dd, yyyy-mm-dd, null for membres+nonmembers, null for all channels, 'sales', 'detail', 'date'

        if (periodType == 'week') {
            from = serverFormatWeek(from);
            to = serverFormatWeek(to);
        } else {
            from = serverFormat(from);
            to = serverFormat(to);
        }

        var query = {
            periods: {
                type: periodType,
                from: from,
                to: to,
                kind: operation
            },
            specs: {
                type: type,
                channel: channel,
                members: members
            }
        };


        //Don't send defaults to server
        if (!channel || channel == 'ALL')
            delete query.specs.channel;

        if (!operation || operation == 'detail')
            delete query.periods.kind;

        if (!type)
            query.specs.type = 'sales';

        if (!periodType || periodType == 'date')
            delete query.periods.type;

        //Members work different if visits or sales
        if (members === null || members === undefined || type === 'visits')
            delete query.specs.members;

        if (type === 'visits') {
            if (members === true)
                query.specs.kinds = ["membership"];
            else if (members === false)
                query.specs.kinds = ["ga", "group"];
        }

        //Kinds for ticket type
        if (typeof type === "object") {
            query.specs.type = type.type;
            query.specs.kinds = type.kinds;
        }

        return query;

    }
}
