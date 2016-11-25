var wnt = require ('./wnt.js');

module.exports = function(goals) {
    for (var k in goals) {
        var months = goals[k].months;
        if (!months) {
            for (var l in goals[k].sub_channels) {
                var months = goals[k].sub_channels[l].months;
                goals[k].sub_channels[l].months = reorder(months);
            }
        } else {
            goals[k].months = reorder(months);
        }
    }
}

var reorder = function(months) {
    var start_month = wnt.venue.fiscal_year_start_month;
    var newM = {};
    for (var i=1; i<=12; i++) {
        var index = i+start_month - 1;
        if (index>12) index -= 12;
        newM[i] = months[index];
    }
    return newM;
}
