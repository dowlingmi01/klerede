var $ = require('jquery');
var wnt = require ('./kcomponents/wnt.js');

if(document.getElementById('hide-preloader-js')){
    $.when(wnt.gettingVenueData).done(function(data) {
        $("#bar-container").hide();
        $("#preloader").fadeOut(1000);
    });
}