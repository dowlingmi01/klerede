var $ = require('jquery');
var moment = require('moment');

var wnt = {
    gettingVenueData:$.Deferred(),
    onVenueDataGet: function(data) {
        console.log('1) Venue data loaded...', data);
        wnt.venue = data;
        wnt.venue.stats_last_date = wnt.dateArray(wnt.venue.stats_last_date);
        wnt.today = new Date(wnt.venue.stats_last_date[0], wnt.venue.stats_last_date[1], wnt.venue.stats_last_date[2]);
        // ********
        // All date manipulation after pulling date from API for venue
        // ********
        wnt.thisYear = wnt.today.getFullYear();
        
        /********************************************/
        /*********Fiscal Dates Calculation***********/
        /********************************************/
        
        wnt.fiscalDate = moment(wnt.today).add( wnt.venue.fiscal_year_start_month - 1, "M");
        wnt.thisFiscalYear = wnt.fiscalDate.year();
        wnt.thisFiscalQuarter = wnt.fiscalDate.format("Q");
        
        var thisFiscalYearStart = moment(wnt.today).startOf('year').add( wnt.venue.fiscal_year_start_month - 1, "M");

        if(thisFiscalYearStart.isAfter(wnt.today)) {
            thisFiscalYearStart.add(-1, "y")
        }
        wnt.thisFiscalYearStart = thisFiscalYearStart.format("YYYY-MM-DD")
        
        /********************************************/

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
    },
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
        for(var i=0; i<days; i++){
            month.push(thisYear + '/' + thisMonth + '/' + wnt.doubleDigits(i+1));
        }
        return month;
    },
    getDateRange: function(dateStr, period) {
        /*
            period = [
                    'this week', 'this month', 'this quarter',
                    'last week', 'last month', 'last quarter',
                    'lastyear month', 'lastyear quarter'

                    NEW ... lastyear-day, average13-day    // LEFT OFF HERE: Need to handle new DAY filters
                    ALREADY HAVE ... last-week, last-month, lastyear-month, last-quarter, lastyear-quarter ... average13-week
                ]
        */
        // Returns array with two values, one for the start date and one for the end date ... ['yyyy-mm-dd','yyyy-mm-dd']
        var dateArray = wnt.dateArray(dateStr);   // Break dateStr into correct array of integers
        var dateRange = [];
        var dateObj = new Date(dateArray[0], dateArray[1], dateArray[2]);
        period = period.split(' ');
        if(period[1] === 'week'){
            dateObj = dateObj.getDay() !== 0 ? dateObj.previous().sunday() : dateObj;
            if(period[0] === 'last'){
                dateObj = dateObj.previous().sunday();
            } else if(period[0] === 'average13'){
                dateObj = dateObj.addWeeks(-13);
            }
            dateRange.push(wnt.formatDate(dateObj));
            dateObj.next().saturday();
            //dateObj.next().saturday();   // Testing grabbing 2 weeks worth of data for slider
            dateRange.push(wnt.formatDate(dateObj));
            return dateRange;
        } else if(period[1] === 'month'){
            dateObj.moveToFirstDayOfMonth();
            if(period[0] === 'last'){
                dateObj.previous().month();
            } else if(period[0] === 'lastyear'){
                dateObj.previous().year();
            }
            dateRange.push(wnt.formatDate(dateObj));
            dateObj.moveToLastDayOfMonth();
            dateRange.push(wnt.formatDate(dateObj));
            return dateRange;
        } else if(period[1] === 'quarter'){
            wnt.testDate = dateObj;
            console.log('DATE OBJECT IS ...', dateObj, dateObj.getMonth());
            var year = dateObj.getFullYear();
            var q1 = [new Date(year, 0, 1), new Date(year, 2, 31)];
            var q2 = [new Date(year, 3, 1), new Date(year, 5, 30)];
            var q3 = [new Date(year, 6, 1), new Date(year, 8, 30)];
            var q4 = [new Date(year, 9, 1), new Date(year, 11, 31)];
            if(dateObj.between(q1[0], q1[1])){
                console.log('NaN bug should get here...', q1);
                // dateRange = period[0] === 'last' ? [wnt.formatDate(q4[0]), wnt.formatDate(q4[1])] : [wnt.formatDate(q1[0]), wnt.formatDate(q1[1])];
                if(period[0] === 'last'){
                    // NaN bug fix part 3 ... added .previous().year()
                    dateRange = [wnt.formatDate(q4[0].previous().year()), wnt.formatDate(q4[1].previous().year())];
                } else if(period[0] === 'lastyear'){
                    dateRange = [wnt.formatDate(q1[0].previous().year()), wnt.formatDate(q1[1].previous().year())];
                } else {
                    dateRange = [wnt.formatDate(q1[0]), wnt.formatDate(q1[1])];
                }
                return dateRange;
            } else if(dateObj.between(q2[0], q2[1])) {
                if(period[0] === 'last'){
                    dateRange = [wnt.formatDate(q1[0]), wnt.formatDate(q1[1])];
                } else if(period[0] === 'lastyear'){
                    dateRange = [wnt.formatDate(q2[0].previous().year()), wnt.formatDate(q2[1].previous().year())];
                } else {
                    dateRange = [wnt.formatDate(q2[0]), wnt.formatDate(q2[1])];
                }
                return dateRange;
            } else if(dateObj.between(q3[0], q3[1])) {
                if(period[0] === 'last'){
                    dateRange = [wnt.formatDate(q2[0]), wnt.formatDate(q2[1])];
                } else if(period[0] === 'lastyear'){
                    dateRange = [wnt.formatDate(q3[0].previous().year()), wnt.formatDate(q3[1].previous().year())];
                } else {
                    dateRange = [wnt.formatDate(q3[0]), wnt.formatDate(q3[1])];
                }
                return dateRange;
            } else {
                if(period[0] === 'last'){
                    dateRange = [wnt.formatDate(q3[0]), wnt.formatDate(q3[1])];
                } else if(period[0] === 'lastyear'){
                    dateRange = [wnt.formatDate(q4[0].previous().year()), wnt.formatDate(q4[1].previous().year())];
                } else {
                    dateRange = [wnt.formatDate(q4[0]), wnt.formatDate(q4[1])];
                }
                return dateRange;
            }
        };
    },
    getWeekNumber: function(dateStr, format){
        var dateArray = wnt.dateArray(dateStr);
        var dateObj = new Date(dateArray[0], dateArray[1], dateArray[2]);
        var firstDayOfYear = new Date(dateArray[0], 0, 1);
        var firstWeekLength = 7 - firstDayOfYear.getDay();
        var dayOfYear = dateObj.getDayOfYear() + 1;   // Day of year is zero-based, so add one
        var weekNum = Math.ceil((dayOfYear - firstWeekLength) / 7);
        if(format === 'format') {
            return dateArray[0] + '-' + wnt.doubleDigits(weekNum);
        }
        return weekNum;
    },
    getWeekNumberDates: function(weekNum){
        // Example: 2016-00
        weekNum = weekNum.split('-');
        var weeksYear = parseInt(weekNum[0]);
        var firstDayOfYear = new Date(weeksYear, 0, 1);
        var firstWeekLength = 7 - firstDayOfYear.getDay();
        weekNum = parseInt(weekNum[1]);
        var dayOfYear = (weekNum * 7) + firstWeekLength;
        var weekDateStart = new Date(weeksYear, 0);
        weekDateStart = new Date(weekDateStart.setDate(dayOfYear-6));
        var weekDateEnd = new Date(weeksYear, 0);
        weekDateEnd = new Date(weekDateEnd.setDate(dayOfYear));
        var weekDates = [];
        weekDates.push(weekDateStart);
        weekDates.push(weekDateEnd);
        return weekDates;
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
    print: function(link){
        var widget = $(link).closest('.widget');
        $('*').addClass('unprintable');
        $(widget).toggleClass('unprintable printable').find('*').toggleClass('unprintable printable');
        $(widget).parents().toggleClass('unprintable printable');
        $('.popover').hide();
        window.print();
    },
    export: function(link){
        // TO DO: abstract conditionals
        var widget = $(link).closest('.widget');
        if($(widget).attr('id') === 'total-sales-goals') {
            var data = [["Period", "Sales Goal", "Actual", "Status"], [
                $(widget).find('.form-control option:selected').text(),
                $(widget).find('.goalAmount').text().replace(/,/g, ''),
                $(widget).find('.bar-meter-marker').text().replace(/,/g, ''),
                $(widget).find('.goalStatusText').text()
            ]];
        } else if($(widget).attr('id') === 'total-membership-goals') {
            var data = [["Period", "Membership Goal", "Actual", "Status"], [
                $(widget).find('.form-control option:selected').text(),
                $(widget).find('.goalAmount').text().replace(/,/g, ''),
                $(widget).find('.bar-meter-marker').text().replace(/,/g, ''),
                $(widget).find('.goalStatusText').text()
            ]];
        } else if($(widget).attr('id') === 'earned-revenue-channels') {
            var data = [["Period", "Channel", "Goal", "Actual", "Status"]];
            $(widget).find('.dial').each(function(){
                var row = [
                    $('#total-sales-goals').find('.form-control option:selected').text(),
                    $(this).find('.channel-name').text(),
                    $(this).find('.channel-goal .amount').text().replace(/,/g, ''),
                    $(this).find('.channel-amount').text().replace(/,/g, ''),
                    $(this).find('.channel-status').text(),
                ];
                data.push(row);
            });
        } else if($(widget).attr('id') === 'membership') {
            var data = [["Period", "Channel", "Goal", "Actual", "Status"]];
            $(widget).find('.dial').each(function(){
                var row = [
                    $('#total-membership-goals').find('.form-control option:selected').text(),
                    $(this).find('.channel-name').text(),
                    $(this).find('.channel-goal .amount').text().replace(/,/g, ''),
                    $(this).find('.channel-amount').text().replace(/,/g, ''),
                    $(this).find('.channel-status').text(),
                ];
                data.push(row);
            });
        } else if($(widget).attr('id') === 'earned-revenue') {
            var data = [["Period", "Channel", "Previous Amount", "New Amount", "Percent Change", "Direction"]];
            $(widget).find('#revenue-accordion > li').each(function(){
                var row = [
                    $(widget).find('.weather-period-title').text(),
                    $(this).find('span').eq(0).text(),
                    $(this).find('.accordion-compared-to').eq(0).text().replace(/,/g, ''),
                    $(this).find('.accordion-stat').eq(0).text().replace(/,/g, ''),
                    $(this).find('.accordion-stat-change').eq(0).text(),
                    $(this).find('.change').eq(0).attr('class'),
                ];
                data.push(row);
            });
        }
        var csvContent = "data:text/csv;charset=utf-8,";
        data.forEach(function(infoArray, index){
           dataString = infoArray.join(",");
           csvContent += index < data.length ? dataString+ "\n" : dataString;
        });
        var encodedUri = encodeURI(csvContent);
        $('.popover').hide();
        window.open(encodedUri);
    },
    calcChange: function(newstat, oldstat) {
        var change = parseFloat(newstat) - parseFloat(oldstat);   // Calculate difference
        change = (change / newstat) * 100;   // Calculate percentage
        var direction = change < 0 ? "down" : "up";   // Test for negative or positive and set arrow direction
        change = Math.abs(change);   // Convert to positive number
        change = Math.round(100*change)/100;   // Round to hundredths
        change = [change, direction]
        return change;
    },
    filter: {},
    venue: {}
};

module.exports = wnt;