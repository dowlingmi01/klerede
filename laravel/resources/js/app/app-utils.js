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
    getWeek: function(dateStr) {
        var dateObj = new Date(dateStr);   // Need to pass one day before (e.g. 8/14 becomes 8/13)
        var week = [];
        for(i=0; i<7; i++){
            dateObj = new Date(dateStr);
            dateObj.setDate(dateObj.getDate() - i);
            week.push(wnt.doubleDigits(dateObj.getMonth()+1) + '.' + wnt.doubleDigits(dateObj.getDate()));
        }
        return week.reverse();
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

wnt.today = new Date('2015-8-15');   // TEMPORARY OVERRIDE ... REMOVE STRING TO GET CURRENT DAY FOR ALL CALCULATIONS
wnt.thisYear = wnt.today.getFullYear();
wnt.thisMonthNum = wnt.today.getMonth();   // Get month and keep as 0-11 to use in quarter calculations
wnt.thisMonthText = wnt.months[wnt.thisMonthNum];   // Set month to string
if(wnt.thisMonthNum < 3){
    wnt.thisQuarterNum = [0,3];
    wnt.thisQuarterText = 'Q1';
    wnt.thisQuarterStart = '01';
} else if(wnt.thisMonthNum < 6){
    wnt.thisQuarterNum = [3,6];
    wnt.thisQuarterText = 'Q2';
    wnt.thisQuarterStart = '04';
} else if(wnt.thisMonthNum < 9){
    wnt.thisQuarterNum = [6,9];
    wnt.thisQuarterText = 'Q3';
    wnt.thisQuarterStart = '07';
} else {
    wnt.thisQuarterNum = [9,12];
    wnt.thisQuarterText = 'Q4';
    wnt.thisQuarterStart = '10';
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
wnt.yearStart = wnt.thisYear+'-01-01';
wnt.quarterStart = wnt.thisYear+'-'+wnt.thisQuarterStart+'-01';
wnt.monthStart = wnt.thisYear+'-'+wnt.doubleDigits(wnt.thisMonthNum+1)+'-01';
wnt.weekago = new Date(wnt.yesterday);
wnt.weekago.setDate(wnt.weekago.getDate() - 6);
wnt.weekago = wnt.formatDate(wnt.weekago);

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

        // STARTING MARKERS

        var startMark1 = d3.select('#div1').selectAll('svg').append("line")
                .attr("x1", 58)
                .attr("y1", -2)
                .attr("x2", 58)
                .attr("y2", 11)
                .attr("stroke-width", "3");

        var startMark2 = d3.select('#div2').selectAll('svg').append("line")
                .attr("x1", 58)
                .attr("y1", -2)
                .attr("x2", 58)
                .attr("y2", 11)
                .attr("stroke-width", "3");

        var startMark3 = d3.select('#div3').selectAll('svg').append("line")
                .attr("x1", 58)
                .attr("y1", -2)
                .attr("x2", 58)
                .attr("y2", 11)
                .attr("stroke-width", "3");

        var startMark4 = d3.select('#div4').selectAll('svg').append("line")
                .attr("x1", 58)
                .attr("y1", -2)
                .attr("x2", 58)
                .attr("y2", 11)
                .attr("stroke-width", "3");

        var startMark5 = d3.select('#div5').selectAll('svg').append("line")
                .attr("x1", 58)
                .attr("y1", -2)
                .attr("x2", 58)
                .attr("y2", 11)
                .attr("stroke-width", "3");

        var startMark6 = d3.select('#div6').selectAll('svg').append("line")
                .attr("x1", 58)
                .attr("y1", -2)
                .attr("x2", 58)
                .attr("y2", 11)
                .attr("stroke-width", "3");

        var startMark7 = d3.select('#div7').selectAll('svg').append("line")
                .attr("x1", 58)
                .attr("y1", -2)
                .attr("x2", 58)
                .attr("y2", 11)
                .attr("stroke-width", "3");

        // GOAL MARKER DOTS

        var goalDot1 = d3.select('#div1').selectAll('svg').append("circle")
                .attr("r", 8)
                .attr("cx", 20)
                .attr("cy", 20)
                .attr("fill", "rgba(66,66,66,1)");

        var goalDot2 = d3.select('#div2').selectAll('svg').append("circle")
                .attr("r", 8)
                .attr("cx", 20)
                .attr("cy", 20)
                .attr("fill", "rgba(66,66,66,1)");

        var goalDot3 = d3.select('#div3').selectAll('svg').append("circle")
                .attr("r", 8)
                .attr("cx", 20)
                .attr("cy", 20)
                .attr("fill", "rgba(66,66,66,1)");

        var goalDot4 = d3.select('#div4').selectAll('svg').append("circle")
                .attr("r", 8)
                .attr("cx", 20)
                .attr("cy", 20)
                .attr("fill", "rgba(66,66,66,1)");

        var goalDot5 = d3.select('#div5').selectAll('svg').append("circle")
                .attr("r", 8)
                .attr("cx", 20)
                .attr("cy", 20)
                .attr("fill", "rgba(66,66,66,1)");

        var goalDot6 = d3.select('#div6').selectAll('svg').append("circle")
                .attr("r", 8)
                .attr("cx", 20)
                .attr("cy", 20)
                .attr("fill", "rgba(66,66,66,1)");

        var goalDot7 = d3.select('#div7').selectAll('svg').append("circle")
                .attr("r", 8)
                .attr("cx", 20)
                .attr("cy", 20)
                .attr("fill", "rgba(66,66,66,1)");
                
    }







    /*************************************/
    /******** TEST BAR GRAPH WAVE ********/
    /*************************************/
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
    
    /********************************/
    /******** TEST ACCORDION ********/
    /********************************/
    $('#revenue-accordion li').click(function(){
        // Activate target accordion
        $(this).toggleClass('open');
        $(this).find('ul').toggle();
    });
});



