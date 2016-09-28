/*********************************************/
/*************** FOOTER COPYRIGHT ************/
/*********************************************/

var $ = require('jquery');
var wnt = require("./wnt.js");

$(function(){
    $.when(wnt.gettingVenueData).done(function(data) {
        $('#copyright-year').text(wnt.thisYear);
    });
});

