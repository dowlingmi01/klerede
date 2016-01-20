/********************************/
/******** GLOBAL HELPERS ********/
/********************************/

var wnt = {
    // NOTE: To just change dates with slashes to dates with dashes (or vice versa) use   ...   str.replace(/\//g,'-')
    formatDate: function(dateObj, digits) {   // Pass in 'double' as second paramter for yyyy-mm-dd, default is yyyy-m-d
        var mm = dateObj.getMonth()+1;
        var dd = dateObj.getDate();
        var formattedDate = (digits === 'double') ? dateObj.getFullYear()+'-'+wnt.doubleDigits(mm)+'-'+wnt.doubleDigits(dd) : dateObj.getFullYear()+'-'+mm+'-'+dd;
        return formattedDate;
    },
    shortDate: function(dateStr){   // Pass in yyyy-mm-dd
        dateStr = dateStr.split('-');
        return dateStr[1]+'.'+dateStr[2];
    },
    longDate: function(dateStr){   // Pass in yyyy-mm-dd
        dateStr = dateStr.split('-');
        return dateStr[1]+'.'+dateStr[2]+'.'+dateStr[0].substring(2);
    },
    getWeek: function(dateStr) {
        // NOT USED
        // NUMBER: [1, 2], Format: ..., Used By: ..., When: ...
        /*
        console.log('DATE STRING FORMAT 1 (and 2) = ' + dateStr);
        var dateObj = new Date(dateStr);   // Need to pass one day before ?? (e.g. 8/14 becomes 8/13)
        var week = [];
        for(i=0; i<7; i++){
            dateObj = new Date(dateStr);
            dateObj.setDate(dateObj.getDate() - i);
            week.push(wnt.doubleDigits(dateObj.getMonth()+1) + '.' + wnt.doubleDigits(dateObj.getDate()));
        }
        return week.reverse();
        */
    },
    dateArray: function(dateStr) {
        var dateArray = [];
        if(dateStr.indexOf('-') !== -1){
            dateStr = dateStr.split('-');
            dateArray.push(parseInt(dateStr[0]));
            dateArray.push(parseInt(dateStr[1]-1));
            dateArray.push(parseInt(dateStr[2]));
        };
        if(dateStr.indexOf('/') !== -1){
            dateStr = dateStr.split('/');
            dateArray.push(parseInt(dateStr[2]));
            dateArray.push(parseInt(dateStr[0]-1));
            dateArray.push(parseInt(dateStr[1]));
        };
        return dateArray;
    },
    getMonth: function(dateStr) {
        var dateArray = wnt.dateArray(dateStr);
        // NUMBER: 3, Format: 2015-9-1, Used By: Revenue, When: [load, week change]
        // Have to use values in array individually and not as an array or else the month is wrong
        var dateObj = new Date(dateArray[0], dateArray[1], dateArray[2]);
        var thisYear = dateObj.getFullYear();
        var thisMonth = dateObj.getMonth()+1;
        var days = wnt.daysInMonth(thisMonth, dateObj.getFullYear());
        thisMonth = wnt.doubleDigits(thisMonth);
        var month = [];
        for(i=0; i<days; i++){
            month.push(thisYear + '/' + thisMonth + '/' + wnt.doubleDigits(i+1));
        }
        return month;
    },
    getDateRange: function(dateStr, period) {
        var dateArray = wnt.dateArray(dateStr);
        // NUMBER: [4,5], Format: [09/01/2015, 2015-9-1], Used By: Revenue, When: [load, update, week change]
        // period = last week, this week
        // Returns array with two values, one for the start date and one for the end date ... ['yyyy-mm-dd','yyyy-mm-dd']
        var dateRange = [];
        var startDate = new Date(dateArray[0], dateArray[1], dateArray[2]);
        var endDate = new Date(dateArray[0], dateArray[1], dateArray[2]);
        if(period === 'last week'){
            startDate.setDate(startDate.getDate() - 7);
            dateRange.push(wnt.formatDate(startDate));
            endDate.setDate(endDate.getDate() - 1);
            dateRange.push(wnt.formatDate(endDate));
            return dateRange;
        } else if(period === 'this week'){
            dateRange.push(wnt.formatDate(startDate));
            endDate.setDate(endDate.getDate() + 6);
            dateRange.push(wnt.formatDate(endDate));
            return dateRange;
        };
    },
    doubleDigits: function(num) {
        num = num < 10 ? '0'+num : num;
        return num;
    },
    months: [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
    ],
    daysInMonth: function(month, year){
        // NUMBER: [6], Format: ..., Used By: Revenue, When: [load, update, week change]
        return new Date(year, month, 0).getDate();
    },
    period: function(monthStart, monthStop, abbr){   // EXAMPLE: wnt.period(0,3,true) returns ['Jan','Feb','Mar']
        var selectedMonths;
        if(monthStart === monthStop){
            selectedMonths = ['1st', '8th', '15th', '22nd'];
            var lastDay = wnt.daysInMonth(wnt.thisMonthNum, wnt.thisYear);
            lastDay = lastDay < 31 ? lastDay+'th' : lastDay+'st';   // 28th, 29th, 30th, 31ST
            // selectedMonths.push(lastDay);   // TEMP REMOVAL: Need to figure out spacing
        } else {
            selectedMonths = wnt.months.slice(monthStart, monthStop);
            if(abbr === true){
                $.each(selectedMonths, function(index,value){
                    selectedMonths[index] = value.substring(0,3);
                });
            }
        }
        return selectedMonths;
    },
    getData: function(query, type, channel, from, to){
        $.post(
            wnt.apiMain,
            {
                venue_id: wnt.venueID,
                queries: {
                    query: { 
                        specs: { 
                            type: type, 
                            channel: channel 
                        }, 
                        periods: { 
                            from: from, 
                            to: to
                        } 
                    }
                }
            }
        )
        .done(function(result) {
            console.log(query + ' data loaded...');
            wnt[query] = result.query;
            wnt.gettingData.resolve(result.query);
        }.bind(this))   // .bind() gives context to 'this'
        .fail(function(result) {
            console.log(query + ' DATA ERROR! ... ' + result.statusText);
            console.log(result);
        });
    },
    getWeather: function(dateFrom, dateTo){
        var query = {};
        if(!dateTo){
            query = $.extend({}, {
                venue_id: wnt.venueID,
                date: dateFrom
            });
        } else {
            query = $.extend({}, {
                venue_id: wnt.venueID,
                from: dateFrom,
                to: dateTo
            });
        }
        $.get(wnt.apiWeather, query)
        .done(function(result){
            wnt.weatherPeriod = result;
            wnt.gettingWeatherData.resolve(result);
            console.log('Weather data loaded...');
        })
        .fail(function(result){
            var noData = {
                icon_1: 'blank',
                temp_1: '...',
                summary_1: '...'
            };
            wnt.weatherPeriod = noData;
            wnt.gettingWeatherData.resolve(noData);
            console.log('WEATHER BARS DATA ERROR! ... ' + result.statusText);
        });
    },
    getGoals: function(year, deferredObj){        
        $.get(wnt.apiGoals+'/'+wnt.venueID+'/'+year)
        .done(function(result){
            // If there's a deferred set for the data call, resolve it
            if(deferredObj !== undefined){
                deferredObj.resolve(result);
            }
            console.log('Goals data loaded...');
        })
        .fail(function(result){
            console.log('GOALS DATA ERROR! ... ' + result.statusText);
            console.log(result);
            // If there's a deferred set for the data call, resolve it
            if(deferredObj !== undefined){
                deferredObj.resolve(result);
            }
        });
    },
    setGoals: function(data, year, channel, type, subchannel){
        // PUT api/v1/goals/sales     /{venue_id}/{year}/{channel}/{type}[/{sub_channel}]
        // e.g. 2015/cafe/amount ... or ... 2015/membership/units/family
        // request body = { "months": { 1: XXX, 2: XXX, 3: XXX, ... } }
        // NOTE: All 12 months must be present in the request
        // NOTE: sub_channel must be specified only for the membership channel
        var url = wnt.apiGoals+'/'+wnt.venueID+'/'+year+'/'+channel+'/'+type;
        url = !subchannel ? url : url+'/'+subchannel;
        $.ajax({
            url: url,
            type: 'PUT',
            dataType: 'json',
            data: data,
            success: function(result) {
                console.log('Goals have been updated on the server.');
            },
            error: function(result) {
                console.log('ERROR');
            }
        });
    },
    print: function(link){
        var widget = $(link).closest('.widget');
        $('*').addClass('unprintable');
        $(widget).toggleClass('unprintable printable').find('*').toggleClass('unprintable printable');
        $(widget).parents().toggleClass('unprintable printable');
        $('.popover').hide();
        window.print();
    }
};

/********************************************/
/******** GLOBAL API-FORMATTED DATES ********/
/********************************************/

/************************************************************************************************************/
wnt.today = new Date(2015,11,8);   // 12/8/2015 ... TEMPORARY OVERRIDE ... REMOVE STRING TO GET CURRENT DAY FOR ALL CALCULATIONS
/************************************************************************************************************/
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
wnt.monthStart = wnt.thisYear+'-'+(wnt.thisMonthNum+1)+'-1';
wnt.datePickerStart = wnt.doubleDigits(wnt.thisMonthNum+1)+'/01/'+wnt.thisYear;
wnt.weekago = new Date(wnt.yesterday);
wnt.weekago.setDate(wnt.weekago.getDate() - 6);
wnt.weekago = wnt.formatDate(wnt.weekago, 'double');
wnt.selectedMonthDays = wnt.daysInMonth(wnt.thisMonthNum+1, wnt.thisYear);

/**********************************/
/******** GLOBAL VARIABLES ********/
/**********************************/
wnt.apiMain = '/api/v1/stats/query';
wnt.apiWeather = '/api/v1/weather/query';
wnt.apiGoals = '/api/v1/goals/sales';
/************************************************************************************************************/
wnt.venueID = '1588';   // TEMPORARY OVERRIDE
wnt.venueZip = '84020,us';   // TEMPORARY OVERRIDE
/************************************************************************************************************/
wnt.gettingData;

/*********************************************/
/******** GLOBAL DOM-READY PROCESSING ********/
/*********************************************/

$(function(){
    $('.plus-sign-menu').popover();
    $('circle').popover();
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
    
    /********************************/
    /******** TEST ACCORDION ********/
    /********************************/
    $('#revenue-accordion li').click(function(){
        // Activate target accordion
        $(this).toggleClass('open');
        $(this).find('ul').toggle();
    });

    /*********************************/
    /******** TEST DATEPICKER ********/
    /*********************************/
    Date.firstDayOfWeek = 0;
    Date.format = 'mm/dd/yyyy';
    $('#datepicker').datePicker({
        selectWeek: true,
        closeOnSelect: true,
        startDate: '01/01/1996',
        endDate: wnt.doubleDigits(wnt.thisMonthNum+1)+'/'+wnt.doubleDigits(wnt.thisDate)+'/'+wnt.thisYear
    });
    //$('.date-pick').datePicker({selectWeek:true,closeOnSelect:false});

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



