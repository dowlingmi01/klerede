/*********************************************/
/*************** FOOTER COPYRIGHT ************/
/*********************************************/

var $ = require('jquery');
var wnt = require("./kcomponents/wnt.js");

$(function(){
    $.when(wnt.gettingVenueData).done(function(data) {
        $('#copyright-year').text(wnt.thisYear);
    });
});

