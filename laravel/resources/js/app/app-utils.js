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
    period: function(monthStart, monthStop, abbr){   // EXAMPLE: wnt.period(0,3,true) returns ['Jan','Feb','Mar']
        var selectedMonths = wnt.months.slice(monthStart, monthStop);
        if(abbr === true){
            $.each(selectedMonths, function(index,value){
                selectedMonths[index] = value.substring(0,3);
            });
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
    var div1=d3.select(document.getElementById('div1'));
    var div2=d3.select(document.getElementById('div2'));
    var div3=d3.select(document.getElementById('div3'));
    var div4=d3.select(document.getElementById('div4'));

    start();

    function onClick1() {
        deselect();
        div1.attr("class","selectedRadial");
    }

    function onClick2() {
        deselect();
        div2.attr("class","selectedRadial");
    }

    function onClick3() {
        deselect();
        div3.attr("class","selectedRadial");
    }

    function onClick4() {
        deselect();
        div4.attr("class","selectedRadial");
    }

    function onClick5() {
        deselect();
        div5.attr("class","selectedRadial");
    }

    function onClick6() {
        deselect();
        div6.attr("class","selectedRadial");
    }

    function onClick7() {
        deselect();
        div7.attr("class","selectedRadial");
    }

    function labelFunction(val,min,max) {

    }

    function deselect() {
        div1.attr("class","radial");
        div2.attr("class","radial");
        div3.attr("class","radial");
        div4.attr("class","radial");
        div5.attr("class","radial");
        div6.attr("class","radial");
        div7.attr("class","radial");
    }

    function start() {

        var rp1 = radialProgress(document.getElementById('div1'))
                .label('')
                .onClick(onClick1)
                .diameter(145)
                .value(78)
                .render();

        var rp2 = radialProgress(document.getElementById('div2'))
                .label('')
                .onClick(onClick2)
                .diameter(145)
                .value(95)
                .render();

        var rp3 = radialProgress(document.getElementById('div3'))
                .label('')
                .onClick(onClick3)
                .diameter(145)
                .minValue(100)
                .maxValue(200)
                .value(150)
                .render();

        var rp4 = radialProgress(document.getElementById('div4'))
                .label('')
                .onClick(onClick4)
                .diameter(145)
                .minValue(100)
                .maxValue(200)
                .value(187)
                .render();

        var rp5 = radialProgress(document.getElementById('div5'))
                .label('')
                .onClick(onClick5)
                .diameter(145)
                .value(53)
                .render();

        var rp6 = radialProgress(document.getElementById('div6'))
                .label('')
                .onClick(onClick6)
                .diameter(145)
                .value(67)
                .render();

        var rp7 = radialProgress(document.getElementById('div7'))
                .label('')
                .onClick(onClick7)
                .diameter(145)
                .value(80)
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
    $('#revenue-accordion').click(function(event){
        var targetSection = $(event.target).parent();
        // Reset defaults
        $('.accordion-caret').attr('style','transform: rotate(270deg)');
        $('.accordion').hide();
        // Activate target accordion
        $(targetSection).find('ul').show();
        $(targetSection).find('svg').attr('style','transform: rotate(0deg)');
    });
});



