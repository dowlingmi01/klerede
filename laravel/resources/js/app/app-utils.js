/********************************/
/******** GLOBAL HELPERS ********/
/********************************/

var wnt = {
    formatDate: function(dateObj) {
        var mm = dateObj.getMonth()+1,
            dd = dateObj.getDate(),
            formattedDate = dateObj.getFullYear()+'-'+wnt.doubleDigits(mm)+'-'+wnt.doubleDigits(dd);
        return formattedDate;
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
    }
};

/********************************************/
/******** GLOBAL API-FORMATTED DATES ********/
/********************************************/

wnt.today = new Date();
wnt.thisYear = wnt.today.getFullYear();
wnt.thisMonthNum = wnt.today.getMonth();   // Get month and keep as 0-11 to use in quarter calculations
wnt.thisMonthText = wnt.months[wnt.thisMonthNum];   // Set month to string
if(wnt.thisMonthNum < 3){
    wnt.thisQuarterNum = [0,3];
    wnt.thisQuarterText = 'Q1';
} else if(wnt.thisMonthNum < 6){
    wnt.thisQuarterNum = [3,6];
    wnt.thisQuarterText = 'Q2';
} else if(wnt.thisMonthNum < 9){
    wnt.thisQuarterNum = [6,9];
    wnt.thisQuarterText = 'Q3';
} else {
    wnt.thisQuarterNum = [9,12];
    wnt.thisQuarterText = 'Q4';
}
wnt.yesterday = new Date(wnt.today);
wnt.yesterday.setDate(wnt.today.getDate() - 1);
wnt.yesterdaylastyear = new Date(wnt.today);
wnt.yesterdaylastyear.setDate(wnt.today.getDate() - 366);
wnt.daybeforeyesterday = new Date(wnt.today);
wnt.daybeforeyesterday.setDate(wnt.today.getDate() - 2);
wnt.today = wnt.formatDate(wnt.today);
wnt.yesterday = wnt.formatDate(wnt.yesterday);
wnt.daybeforeyesterday = wnt.formatDate(wnt.daybeforeyesterday);
wnt.yesterdaylastyear = wnt.formatDate(wnt.yesterdaylastyear);

// TEMPORARY OVERRIDE OF QUARTER AND MONTH
wnt.thisQuarterNum = [3,6];
wnt.thisQuarterText = 'Q2';
wnt.thisMonthNum = 4;
wnt.thisMonthText = 'May';

/*********************************************/
/******** GLOBAL DOM-READY PROCESSING ********/
/*********************************************/

$(function(){
    $('.plus-sign-menu').popover();
});

console.log('App utilities loaded...');










/***********************************************************************************/
/***********************************************************************************/
/***********************************************************************************/
$(function(){
    /***************************/
    /******** TEST DIAL ********/
    /***************************/

    start();

    function start() {

        var rp1 = radialProgress(document.getElementById('div1'))
                .label('')
                .diameter(145)
                .value(78)
                .render();

        var rp2 = radialProgress(document.getElementById('div2'))
                .label('')
                .diameter(145)
                .value(95)
                .render();

        var rp3 = radialProgress(document.getElementById('div3'))
                .label('')
                .diameter(145)
                .minValue(100)
                .maxValue(200)
                .value(150)
                .render();

        var rp4 = radialProgress(document.getElementById('div4'))
                .label('')
                .diameter(145)
                .minValue(100)
                .maxValue(200)
                .value(187)
                .render();

        var rp5 = radialProgress(document.getElementById('div5'))
                .label('')
                .diameter(145)
                .value(53)
                .render();

        var rp6 = radialProgress(document.getElementById('div6'))
                .label('')
                .diameter(145)
                .value(100)
                .render();

        var rp7 = radialProgress(document.getElementById('div7'))
                .label('')
                .diameter(145)
                .value(110)
                .render();
    }







    /*************************************/
    /******** TEST BAR GRAPH WAVE ********/
    /*************************************/
    var barGraphWidth = $('#bar-graph').width();
    //The data for our line
    var lineData = [
      { "x": 0,   "y": 200},
      { "x": 1,   "y": 5},
      { "x": 20,  "y": 20},
      { "x": 40,  "y": 10},
      { "x": 60,  "y": 40},
      { "x": 80,  "y": 5},
      { "x": 150, "y": 60},
      { "x": 200, "y": 35},
      { "x": 300, "y": 80},
      { "x": 350, "y": 15},
      { "x": 400, "y": 55},
      {"x": barGraphWidth, "y": 40},
      {"x": barGraphWidth, "y": 200}
    ];

    //This is the accessor function we talked about above
    var lineFunction = d3.svg.line()
          .x(function(d) { return d.x; })
          .y(function(d) { return d.y; })
          .interpolate("monotone");

    //The SVG Container
    var svgContainer = d3.select("#bar-graph").append("svg")
          .attr("width", "100%")
          .attr("height", 200);

    //The line SVG Path we draw
    var lineGraph = svgContainer.append("path")
          .attr("d", lineFunction(lineData))
          .attr("fill", "rgba(236,234,231,1)");
    /******************************************/
    /******** TEST BAR GRAPH ANIMATION ********/
    /******************************************/
    $('.bar-section').css('height','0')
        .animate({
            height: '60px',
        },
        2000,
        'easeOutElastic'
    );
    /********************************/
    /******** TEST ACCORDION ********/
    /********************************/
    $('#revenue-accordion li').click(function(){
        // Activate target accordion
        $(this).toggleClass('open');
        $(this).find('ul').toggle();
    });
});



