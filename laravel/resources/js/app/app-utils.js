/**********************************/
/******** GOOGLE ANALYTICS ********/
/**********************************/
var analytics = require("./analytics.js");
analytics.create(global_ga_id);
 
 





/********************************/
/******** GLOBAL HELPERS ********/
/********************************/
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

// Set global deffered object for components to use.
wnt.gettingVenueData = $.Deferred();

var global = Function('return this')();

global.loadUser = function() {
	KAPI.auth.getLoggedUser(onUserGet, onUserError);
}

function onUserGet (user) {
	// console.log(user);
	wnt.venueID  = user.venue_id+"";
	KAPI.venue(
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
    $('circle').popover();
    // $(event.target).closest('.accordion-sub-item').toggleClass('open').find('ul').eq(0).toggle();
    $('.accordion-sub-item').on('click', function(){
        $(this).toggleClass('open').find('ul').toggle();
    });
});

console.log('App utilities loaded...');






/***********************************************************************************/
/***********************************************************************************/
/***********************************************************************************/
$(function(){    
    /*************************************/
    /******** TEST BAR GRAPH WAVE ********/
    /*************************************/
    /* HOLD: PROJECTED AREA GRAPH
    var barGraphWidth = $('#bar-graph').width();
    var barSegmentArea = barGraphWidth / 7;
    //The data for our line
    var lineData = [
      { "x": 0,   "y": 250},
      { "x": 0,   "y": 0},
      { "x": barSegmentArea/2,   "y": 5},
      { "x": barSegmentArea*1.5, "y": 100},
      { "x": barSegmentArea*2.5, "y": 80},
      { "x": barSegmentArea*3.5, "y": 120},
      { "x": barSegmentArea*4.5, "y": 100},
      { "x": barSegmentArea*5.5, "y": 5},
      { "x": barGraphWidth,    "y": 60},
      { "x": barGraphWidth,    "y": 250}
    ];

    //This is the accessor function we talked about above
    var lineFunction = d3.svg.line()
          .x(function(d) { return d.x; })
          .y(function(d) { return d.y; })
          .interpolate("monotone");

    //The SVG Container
    var svgContainer = d3.select("#bar-graph").append("svg")
          .attr("width", "100%")
          .attr("height", 250);

    //The line SVG Path we draw
    var lineGraph = svgContainer.append("path")
          .attr("d", lineFunction(lineData))
          .attr("fill", "rgba(236,234,231,1)");
    */

    /*****************************/
    /******** TEST SLIDER ********/
    /*****************************/
    /*$( "#slider" ).slider({
        value: 100,
        min: 0,
        max: 500,
        step: 50,
        slide: function( event, ui ) {
            console.log( ui.value );
        }
    });*/

    //scrollpane parts
    var scrollPane = $('#bar-graph-scroll-pane'),
        scrollContent = $('#bar-graph');

    //build slider
    var scrollbar = $('#bar-graph-slider').slider({
        /*value: 0,
        min: 0,
        max: 31,
        step: 1,*/
        slide: function( event, ui ) {
            if ( scrollContent.width() > scrollPane.width() ) {
                scrollContent.css( "margin-left", Math.round(
                    ui.value / 100 * ( scrollPane.width() - scrollContent.width() )
                ) + "px" );
            } else {
                scrollContent.css( "margin-left", 0 );
            }
        },
        // Setting change method to handle programmatic changes to slider value
        change: function( event, ui ) {
            if ( scrollContent.width() > scrollPane.width() ) {
                scrollContent.css( "margin-left", Math.round(
                    ui.value / 100 * ( scrollPane.width() - scrollContent.width() )
                ) + "px" );
            } else {
                scrollContent.css( "margin-left", 0 );
            }
        }
    });

    //append icon to handle
    var handleHelper = scrollbar.find( ".ui-slider-handle" )
        .mousedown(function() {
            scrollbar.width( handleHelper.width() );
        })
        .mouseup(function() {
            scrollbar.width( "100%" );
        })
        .append( "<span class='ui-icon ui-icon-grip-dotted-vertical'></span>" )
        .wrap( "<div class='ui-handle-helper-parent'></div>" ).parent();

    //change overflow to hidden now that slider handles the scrolling
    scrollPane.css( "overflow", "hidden" );

    //size scrollbar and handle proportionally to scroll distance
    function sizeScrollbar() {
        var remainder = scrollContent.width() - scrollPane.width();
        var proportion = remainder / scrollContent.width();
        var handleSize = scrollPane.width() - ( proportion * scrollPane.width() );
        scrollbar.find( ".ui-slider-handle" ).css({
            width: handleSize,
            "margin-left": -handleSize / 2
        });
        handleHelper.width( "" ).width( scrollbar.width() - handleSize );
    }

    //reset slider value based on scroll content position
    function resetValue() {
        var remainder = scrollPane.width() - scrollContent.width();
        var leftVal = scrollContent.css( "margin-left" ) === "auto" ? 0 :
            parseInt( scrollContent.css( "margin-left" ) );
        var percentage = Math.round( leftVal / remainder * 100 );
        scrollbar.slider( "value", percentage );
    }

    //if the slider is 100% and window gets larger, reveal content
    function reflowContent() {
        var showing = scrollContent.width() + parseInt( scrollContent.css( "margin-left" ), 10 );
        var gap = scrollPane.width() - showing;
        if ( gap > 0 ) {
            scrollContent.css( "margin-left", parseInt( scrollContent.css( "margin-left" ), 10 ) + gap );
        }
    }

    //change handle position on window resize
    $( window ).resize(function() {
        resetValue();
        sizeScrollbar();
        reflowContent();
    });
    //init scrollbar size
    setTimeout( sizeScrollbar, 10 );//safari wants a timeout




});



