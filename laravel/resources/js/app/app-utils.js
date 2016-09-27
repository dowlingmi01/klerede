/**********************************/
/******** GOOGLE ANALYTICS ********/
/**********************************/
var analytics = require("./analytics.js");
analytics.create(global_ga_id);
 
 





/********************************/
/******** GLOBAL HELPERS ********/
/********************************/
var $ = require('jquery');

var wnt = require("./wnt.js");


/**********************************/
/******** GLOBAL VARIABLES ********/
/**********************************/
wnt.apiMain = '/api/v1/stats/query';
wnt.apiWeather = '/api/v1/weather/query';
wnt.apiGoals = '/api/v1/goals/sales';
/************************************************************************************************************/
wnt.venueID = '1518';   // TEMPORARY OVERRIDE   ...   1588 Living Planet  ...   1518 National Aquarium   ...   wnt.venue.id
wnt.venueZip = '84020,us';   // TEMPORARY OVERRIDE
/************************************************************************************************************/
//wnt.gettingData;

var getLoggedUser = require("./kapi/auth.js").getLoggedUser;
var venue = require("./kapi/venue.js");

var global = Function('return this')();

global.loadUser = function() {
	getLoggedUser(onUserGet, onUserError);
}

function onUserGet (user) {
	// console.log(user);
	wnt.venueID  = user.venue_id+"";
	venue(
		wnt.venueID,
		onVenueDataGet
	);
    

    analytics.addView(user.venue_id, user.id);
 
    
};

function onUserError(error) {
	// console.log(window.location);
	window.location = 'login';
}

function onVenueDataGet(data) {
    console.log('1) Venue data loaded...', data);
    wnt.venue = data;
    wnt.venue.stats_last_date = wnt.dateArray(wnt.venue.stats_last_date);
    wnt.today = new Date(wnt.venue.stats_last_date[0], wnt.venue.stats_last_date[1], wnt.venue.stats_last_date[2]);
    // ********
    // All date manipulation after pulling date from API for venue
    // ********
    wnt.thisYear = wnt.today.getFullYear();
    wnt.thisMonthNum = wnt.today.getMonth();   // Get month and keep as 0-11 to use in quarter calculations
    wnt.thisMonthText = wnt.months[wnt.thisMonthNum];   // Set month to string
    wnt.thisDate = wnt.today.getDate();
    if(wnt.thisMonthNum < 3){
        wnt.thisQuarterNum = [0,3];
        wnt.thisQuarterText = 'Q1';
        wnt.thisQuarterStart = '01';
        wnt.thisQuarterMonths = [1,2,3];   // For goals
    } else if(wnt.thisMonthNum < 6){
        wnt.thisQuarterNum = [3,6];
        wnt.thisQuarterText = 'Q2';
        wnt.thisQuarterStart = '04';
        wnt.thisQuarterMonths = [4,5,6];   // For goals
    } else if(wnt.thisMonthNum < 9){
        wnt.thisQuarterNum = [6,9];
        wnt.thisQuarterText = 'Q3';
        wnt.thisQuarterStart = '07';
        wnt.thisQuarterMonths = [7,8,9];   // For goals
    } else {
        wnt.thisQuarterNum = [9,12];
        wnt.thisQuarterText = 'Q4';
        wnt.thisQuarterStart = '10';
        wnt.thisQuarterMonths = [10,11,12];   // For goals
    }
    wnt.yesterday = new Date(wnt.today);
    wnt.yesterday.setDate(wnt.today.getDate() - 1);
    wnt.yesterdaylastyear = new Date(wnt.today);
    wnt.yesterdaylastyear.setDate(wnt.today.getDate() - 366);
    wnt.daybeforeyesterday = new Date(wnt.today);
    wnt.daybeforeyesterday.setDate(wnt.today.getDate() - 2);
    wnt.today = wnt.formatDate(wnt.today, 'double');
    wnt.yesterday = wnt.formatDate(wnt.yesterday, 'double');
    wnt.daybeforeyesterday = wnt.formatDate(wnt.daybeforeyesterday, 'double');
    wnt.yesterdaylastyear = wnt.formatDate(wnt.yesterdaylastyear, 'double');
    wnt.yearStart = wnt.thisYear+'-1-1';
    wnt.quarterStart = wnt.thisYear+'-'+wnt.thisQuarterStart+'-1';
    wnt.monthStart = wnt.thisYear+'-'+(wnt.thisMonthNum+1)+'-1';   // e.g. 2015-12-1
    wnt.monthEnd = wnt.thisYear+'-'+(wnt.thisMonthNum+1)+'-'+wnt.daysInMonth(wnt.thisMonthNum+1,wnt.thisYear);
    wnt.filter.bgDates = wnt.doubleDigits(wnt.thisMonthNum+1)+'/01/'+wnt.thisYear;
    wnt.weekago = new Date(wnt.yesterday);
    wnt.weekago.setDate(wnt.weekago.getDate() - 6);
    wnt.weekago = wnt.formatDate(wnt.weekago, 'double');
    wnt.selectedMonthDays = wnt.daysInMonth(wnt.thisMonthNum+1, wnt.thisYear);
    wnt.barDates = wnt.getMonth(wnt.today);
	
	// Resolve deffered object.
    console.log('Resolve deferred wnt.gettingVenueData');
	wnt.gettingVenueData.resolve(data);
}






/*********************************************/
/******** GLOBAL DOM-READY PROCESSING ********/
/*********************************************/

$(function(){
    $.when(wnt.gettingVenueData).done(function(data) {
        $('#copyright-year').text(wnt.thisYear);
    });

    $('.accordion-sub-item').on('click', function(){
        $(this).toggleClass('open').find('ul').toggle();
    });
});

console.log('App utilities loaded...');


