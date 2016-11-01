var moment = require("moment");
var _forceDigits = require("./number-utils.js").forceDigits;

var firstDayOfWeek = 1,
    getWeekDay = function (d) {
        
        //monday/sunday correction
        var date = new Date(d);
        var weekDay = date.getUTCDay() -  firstDayOfWeek;
        
        if (weekDay<0) weekDay += 7;
        
        return weekDay;
    },
    months = [
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
    weatherFormat = function(s, periodType) {
        // Friday, June 3, 2016
        if(periodType == "quarter") {
            var fromDate = new Date(getDateFromWeek(s));
            var toDate = new Date(addDays(fromDate,6));
            // Tue Aug 30 2016
            //Mar 27 - Apr 2, 2016
            var from = (fromDate.toDateString()).split(" ");
            var to = (toDate.toDateString()).split(" ");
            return from[1]+" "+from[2]+" - "+to[1]+" "+to[2]+", "+from[3];
        }
        
        var weekDays = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']; //TODO: take this to a global context
        
        var date = new Date(s);
        var d = weekDays[date.getUTCDay()];
        var m = months[date.getUTCMonth()];
        
        return d+", "+m+" "+date.getUTCDate()+", "+date.getUTCFullYear();
    },
    detailsFormat = function(date1, date2) {
        
        if(!date1 || !date2) return "";
        
        var fromDate = new Date(date1);
        var toDate = new Date(date2);
        
        var from = (fromDate.toDateString()).split(" ");
        var to = (toDate.toDateString()).split(" ");
        return from[1]+" "+from[2]+" - "+to[1]+" "+to[2]+", "+from[3];
    },
    barFormat = function(s, periodType) {
        if(periodType == "quarter") {
            s = getDateFromWeek(s);
        }
        
        var date = new Date(s);
        var d =_forceDigits(date.getUTCDate(),2);
        var m =_forceDigits(date.getUTCMonth()+1,2);

        if(periodType == "month") return d;

        return m+"."+d;
    },
    serverFormat = function (date, periodType) {
        var date = new Date(date);
        if (periodType == "week") {
            return serverFormatWeek(date);
        };
        var d = _forceDigits(date.getUTCDate(), 2);
        var m = _forceDigits(date.getUTCMonth()+1, 2);
        return date.getUTCFullYear()+"-"+m+"-"+d;
    },
    serverFormatWeek = function (date) {
        var m = moment(date, "MM/DD/YYYY");
        var w = m.isoWeekYear()+"-"+m.isoWeek();//format("YYYY-WW");
        return w;
    },
    localFormat = function (serverDate) { //yyyy-mm-dd -> mm/dd/yyy
        var date = new Date(serverDate);
        return formatFromDate(date);
    },
    formatFromDate = function (date) {
        var d =_forceDigits(date.getUTCDate(),2);
        var m =_forceDigits(date.getUTCMonth()+1,2);
        return m+"/"+d+"/"+date.getUTCFullYear();
    },
    addDays = function (date, days, dateObject) {
        var result = new Date(date);
        result.setDate(result.getDate() + days);
        if(dateObject)
            return result;
        else
            return formatFromDate(result);
    },
    addMonths = function (date, months) {
        var result = new Date(date);
        result.setMonth(result.getMonth() + months);
        return formatFromDate(result);
    },
    addYears = function (date, years) {
        var result = new Date(date);
        result.setUTCFullYear(result.getUTCFullYear() + years);
        return formatFromDate(result);
    },
    getQuarterNumber = function (d) {
        var date = new Date(d);
        var month = date.getUTCMonth();
        return Math.floor(month/3) + 1;
    },
    quarterToDates = function(q, y) {            //q,yyyy -> mm/dd/yyyy
        // console.log(q, y);
        
        if (q < 0 || q > 4 ) {
            throw "Quarter must be between 1 and 4";
        }
        if(q == 0) {
            q = 4;
            y = y-1;
        }
        
        var fromMonth = (q-1)*3 + 1;
        var toMonth = q*3 + 1;
        var from = new Date(fromMonth+"/01/"+y);
        if(toMonth <=12) {
            var to = new Date(toMonth+"/01/"+y);        //pass over 1 day to calculte mar31, jun30, sep30
            to.setUTCDate(0);
        } else {
            var to = new Date("12/31/"+y);
        }
        
        var dates = {from: formatFromDate(from), to: formatFromDate(to)};
        // console.log(q, y, dates);
        return dates;
    },
    weekToDates = function (w, y) { // w, y | YYYY-W -> mm/dd/yyyy

        if (y === undefined) {
            var s = w;
            var a = s.split("-");
            y = parseInt(a[0]);
            w = parseInt(a[1]);
        };

        var date = new Date("01/01/"+year.toString());
        return addDays(date, week*7);
    },
    dateToWeek = function (d) { // mm/dd/yyyy -> YYYY-W

        var w = moment(d).isoWeek();
        var y = (new Date(d)).getUTCFullYear();

        return y+"-"+_forceDigits(w, 2);
    },
    getDateFromWeek = function (s) { //YYYY-W -> mm/dd/yyyy (returns start week date)
        //week ISO 1988 from 1 to 53, 4 days rule
        var a = s.split("-");
        var year = parseInt(a[0]);
        var week = parseInt(a[1]);
        
        var m = moment().year(year).isoWeek(week).startOf("week");
        
        return  m.format("MM/DD/YYYY");
    };

    module.exports = {
        firstDayOfWeek:firstDayOfWeek,
        getWeekDay:getWeekDay,
        months:months,
        weatherFormat:weatherFormat,
        detailsFormat:detailsFormat,
        barFormat:barFormat,
        serverFormat:serverFormat,
        serverFormatWeek:serverFormatWeek,
        localFormat:localFormat,
        formatFromDate:formatFromDate,
        addDays:addDays,
        addMonths:addMonths,
        addYears:addYears,
        getQuarterNumber:getQuarterNumber,
        quarterToDates:quarterToDates,
        dateToWeek:dateToWeek,
        getDateFromWeek:getDateFromWeek
    }