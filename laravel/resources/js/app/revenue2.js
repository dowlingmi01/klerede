
var React = require('react');

var $ = require('jquery');
require('../libs/jquery.datePicker.js');
var wnt = require ('./wnt.js');

var KAPI = {};
KAPI.stats = require("./kapi/stats.js");
KAPI.weather = require("./kapi/weather.js");

var KUtils = {};
KUtils.date = require("./kutils/date-utils.js");
KUtils.number = require("./kutils/number-utils.js");

var Caret = require('./svg-icons').Caret;
var LongArrow = require('./svg-icons').LongArrow;
var ChangeArrow = require('./svg-icons').ChangeArrow;
var analytics = require("./analytics.js");

var ActionMenu = require('./reusable-parts').ActionMenu;
var printDiv = require ('./kutils/print-div.js');
var saveImage = require ('./kutils/save-image.js');


var CaretHandler = React.createClass({
    render:function () {
        return(
            <svg xmlns="http://www.w3.org/2000/svg" width="30px" height="7px" viewBox="0 0 21.294 15.555" preserveAspectRatio="xMidYMid meet" className={"filter-caret "+this.props.className}><path d="M21.854 0.439l-7.366 7.365L12.523 9.77L10.56 7.804L3.196 0.441C2.425-0.185 1.293-0.147 0.6 0.6 c-0.768 0.768-0.768 2 0 2.778l9.983 9.983l1.964 1.966l1.965-1.966l9.984-9.983c0.383-0.383 0.575-0.886 0.575-1.389 c0-0.502-0.192-1.006-0.575-1.389C23.755-0.146 22.626-0.185 21.9 0.4"/></svg>
        );
    }
});
var Dropdown = React.createClass({
    render:function () {

        var optionList = this.props.optionList;
        var options = [];

        for (var v in optionList) {
            var option = <option key={v} value={v} >{optionList[v]}</option>;
            options.push(option);
        }
        
        return (
            <div className={this.props.className}>
                <Caret className="filter-caret" />
                <form >
                    <select className="form-control" onChange={this.props.onChange} value={this.props.selected} >
                        {options}
                    </select>
                </form>
            </div>
        );
    }
});

var Channel = React.createClass({
    render:function () {
        return(
            <div className={"channel multicolor-wrapper "+this.props.empty}>
                <div className={"circle-checkbox multicolorbg "+this.props.active} onClick={this.props.onClick}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="21.294px" height="15.555px" viewBox="0 0 21.294 15.555" preserveAspectRatio="xMidYMid meet" className="legend-check" >
                        <path d="M20.641 0.653c-0.871-0.871-2.283-0.871-3.154 0.001l-9.489 9.528L3.793 5.98c-0.868-0.868-2.275-0.868-3.143 0 c-0.867 0.868-0.867 2.3 0 3.142l5.905 5.904c0.873 0.7 2.2 0.7 2.999-0.118L20.641 3.8 C21.512 2.9 21.5 1.5 20.6 0.7"/>
                    </svg>
                </div> &nbsp;
                <span>{this.props.name}</span>
                &nbsp;
            </div>
        );
    }
});

var GBar = React.createClass({
    componentDidUpdate:function () {
        // $(this.refs.barTransition.getDOMNode()).addClass("activate");
    },
    componentDidMount:function () {
        if (!this.refs.popup)  return;
        
        var popup = this.refs.popup.getDOMNode();
        
        $(this.refs.gbarSections.getDOMNode()).on("mouseover", function(event){
            $(popup).fadeIn(300);
        });
        $(this.refs.gbarSections.getDOMNode()).on("mouseleave", function(event){
            $(popup).finish();
            $(popup).fadeOut(150);
        });
    },
    render:function () {
        var isEmpty = (this.props.total<=0);
        var channels = this.props.channels;
        var sections = [];
        for (var i in channels) {
            var channel = channels[i];
            
            if (!channel.data) {
                sections.push(<div key={i}></div>);
                continue;
            }
            var sectionH = (100*channel.data.amount/this.props.partial) + "%";
            if (this.props.units == "percap") {
                sectionH = (100*channel.data.percap/this.props.partialPercap) + "%";
            }
            sections.push(
                <div key={i} className="gbar-section multicolorbg" style={{height:sectionH}} ></div>
            );
        }
        
        var totalWidth = this.props.width;
        var width = totalWidth/2;
        var marginRight = totalWidth/4;
        var marginLeft = totalWidth/4;
        
        var height = Math.round(300*this.props.partial/this.props.max);

        if (this.props.units == "percap") {
            height = Math.round(300*this.props.partialPercap/this.props.maxPercap);
        }
        
        var onMouseDown = isEmpty ? "" : this.props.onMouseDown;
        
        
        var weatherDiv = isEmpty? <div></div> : <WeatherPopup id={"weather-popup-"+this.props.id} ref="popup" bottom={height+37} units={this.props.units} channels={channels} date={this.props.date} periodType={this.props.periodType} data={this.props.weather} attendance={this.props.attendance} />;
        
        return(
            <div id={this.props.id} onMouseDown={onMouseDown} className="gbar" style={{width:width+"%", "marginRight":marginRight+"%", "marginLeft":marginLeft+"%", cursor: isEmpty?'initial':'pointer'}}>
                <div ref="gbarSections" className="gbar-sections" style={{height:height+"px"}}>
                        {sections}
                </div>
                <div className="glabel">
                    {KUtils.date.barFormat(this.props.date, this.props.periodType)}
                </div>
                {weatherDiv}
            </div>
        );
    }
});
var ChannelPopup = React.createClass({
    render:function () {
        var formatAmount = KUtils.number.formatAmount;
        var key = this.props.units;
        if (this.props.units == "dollars") {
            key = "amount";
        }
        return(
            <div id="gift" className="details-row multicolor-wrapper">
                <div className="col-xs-1">
                    <div className="circle multicolorbg"></div>
                </div>
                <div id="channel" className="col-xs-6">
                    {this.props.name}
                </div>
                <div id="quantity" className="col-xs-5">
                    ${formatAmount(this.props.data[key])}
                </div>
            </div>
        );
    }
});
var WeatherPopupView = React.createClass({
    render:function () {
        
        if (!this.props.data) {
            return (<div id="weather-data"></div>);
        };

        return (
            <div id="weather-data">
               <div className="col-xs-6 col-sm-6">
                   <div id="icon" className="inline-block">
                       <img src={"/img/"+this.props.data["icon_1"]+".svg"} className="popover-weather-icon" />
                   </div>
                   <div id="description" className="inline-block">
                       <div id="time">
                           10 A.M.
                       </div>
                       <div id="text">
                           {this.props.data["summary_1"]}
                       </div>
                       <div className="temp">
                           {Math.round(this.props.data["temp_1"])+"° F"}
                       </div>
                   </div>
               </div>
               <div className="col-xs-6 col-sm-6">
                   <div id="icon" className="inline-block">
                       <img src={"/img/"+this.props.data["icon_2"]+".svg"} className="popover-weather-icon" />
                   </div>
                   <div id="description" className="inline-block">
                       <div id="time">
                           4 P.M.
                       </div>
                       <div id="text">
                           {this.props.data["summary_2"]}
                       </div>
                       <div className="temp">
                           {Math.round(this.props.data["temp_2"])+"° F"}
                       </div>
                   </div>
               </div>
           </div>
        );
    }
});

var WeatherPopup = React.createClass({
    render:function () {
        
        var formatAmount = KUtils.number.formatAmount;
        
        var popupChannels = [];
        var channels = this.props.channels;
        for (var i in channels) {
            var channel = channels[i];
            if (!channel.data) {
                popupChannels.push(<div key={i}></div>);
                continue;
            }
            popupChannels.push(<ChannelPopup key={i} name={channels[i].name}  data={channels[i].data} units={this.props.units} />);
        }
        
        var formattedDate = KUtils.date.weatherFormat(this.props.date, this.props.periodType);

        var attendance = formatAmount(this.props.attendance);

        return(
            <div id={this.props.id} className="weather-popup" style={{bottom:this.props.bottom+"px"}}>
                <div id="weather" className="row">
                    <div id="popup-date">
                        {formattedDate}
                    </div>
                    <WeatherPopupView data={this.props.data} />
                </div>
                <div className="attendance row" >Attendance: {attendance}</div>
                <div id="details" className="row">
                    {popupChannels}
                </div>
                <div id="arrow">
        
                </div>
            </div>            
        );
    }
});

var DatePickerReact = React.createClass({
    componentDidMount: function() {
        Date.firstDayOfWeek = KUtils.date.firstDayOfWeek;
        Date.format = 'mm/dd/yyyy';
        // var dp = $('#'+this.props.id).datePicker({
        var dp = $('#'+this.props.id).datePicker({
            selectWeek: true,
            closeOnSelect: true,
            startDate: '01/01/1996',
            endDate: wnt.doubleDigits(wnt.thisMonthNum+1)+'/'+wnt.doubleDigits(wnt.thisDate)+'/'+wnt.thisYear,
            defaultDate:this.props.defaultDate
        });
        $("input#datepicker-2").bind("change", this.props.onSelect);
    },
    render:function () {
        return(
            <form className="datepicker-form">
                <input className="form-control" ref="datepickerInput" id={this.props.id} type="text" defaultValue={this.props.defaultDate}></input>
            </form>
        );
    }
});

var TabSelector = React.createClass({
    render:function () {
        var selected = (this.props.id == this.props.selected) ? " selected":"";
        return (
            <div className={"unit-filter"+selected} id={this.props.id} onClick={this.props.onClick}>
                {this.props.name}
                <div className="filter-highlight"></div>
            </div>
        );
    }
});
var DetailsRow = React.createClass({
    getInitialState:function () {
        return {
            detailsClass:""
        };
    },
    togleDetails:function (event) {
        if(this.state.detailsClass == "") {
            this.setState({detailsClass:"active"});
        } else {
            this.setState({detailsClass:""});
        }
    },
    getFontStyle:function (n) { //adjust % to show the whole number
        var style = {};
        if (n >= 1e6 ) {
            style.fontSize = "85%";
        } else if (n > 1e7) {
            style.fontSize = "70%";
        } else if (n > 1e8) {
            style.fontSize = "60%";
        }
        return style;
    },
    //props
    //from - to - title
    render:function () {
        var formatAmount = KUtils.number.formatAmount;

        var from = this.props.from;
        var to = this.props.to;
        
        var fromStyle = this.getFontStyle(from);
        var toStyle = this.getFontStyle(to);

        var upDownClass = to > from ? "up" : "down";
        
        if(from !== 0 ) {
            var percent = 100*((to/from) - 1);
        }
        if(isNaN(percent) || !isFinite(percent)) {
            var change = "n/d";
            var changeStyle = {opacity:0};
        } else {
            change = (percent.toFixed(2))+"%";
            changeStyle = {};
        }
        
        
        var details = this.props.details;
        var detailsRows = [];
        var detailsHandler = <div></div>;
        
        if (details.length) {
            
            for (var i in details) {
                var detail = details[i];
                detailsRows.push(
                    <DetailsRow 
                        className="child-details"
                        key={i} from={detail.from} to={detail.to} title={detail.title} 
                        details={detail.details}
                    />
                )
            }
            
            detailsHandler = <div id="filter-caret-wrapper" className="left-line" onClick={this.togleDetails}><CaretHandler className={this.state.detailsClass} /></div>;
            
        }
        
        return (
            <div className={this.props.className} >
                <div className="table-item-wrapper">
                    <div className="table-item">
                        <div className="col-xs-4 title">
                            <div className="title-text">
                                {this.props.title}
                            </div>
                        </div>
                        <div className="col-xs-8 title">
                            <div className="col-xs-4 left-line" >
                                <div className="" style={changeStyle}>
                                    <ChangeArrow className={"change multicolorfl "+upDownClass} />
                                    <span className="multicolor" id="change">{change}</span>
                                </div>
                            </div>
                            <div className="col-xs-8 left-line">
                                <div className="">
                                    <div id="from-val" style={fromStyle}>${formatAmount(from)}</div>
                                    <LongArrow className="long-arrow" width="21px" />
                                    <div className="multicolor" id="to-val"  style={toStyle}>${formatAmount(to)}</div>
                                </div>
                            </div>
                        </div>
                        {detailsHandler}
                    </div>
                </div>
                <div className={"child-details-wrapper col-xs-12 "+this.state.detailsClass}>
                    {detailsRows}
                </div>
            </div>
        )
    }
});
var DetailsHeader = React.createClass({
    render:function () {
        return(
            <div className="table-item-wrapper">
                <div className="table-item">
                    <div className="col-xs-4">
                        <h4>Location</h4>
                    </div>
                    <div className="col-xs-8">
                        <div className="col-xs-4" >
                            <h4>% Change</h4>
                        </div>
                        <div className="col-xs-8">
                            <div id="from-val"><h4>From</h4></div>
                            <LongArrow className="long-arrow" width="21px" />
                            <div id="to-val"><h4>to</h4></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});
var Revenue2 = React.createClass({
    getInitialState:function () {
        var today = new Date(KUtils.date.localFormat(wnt.today));
        var weekDay = KUtils.date.getWeekDay(wnt.today);
        var date = this.buildDateDetails(today);

        var actions = [];
        if(features.save) {
            actions.push({href:"#save", text:"Save", handler:this.onActionClick});
        }
        if (features.print) {
            actions.push({href:"#print", text:"Print", handler:this.onActionClick});
        }
        
        return {
            actions:actions,
            channelNames:{gate:"Box Office", cafe: "Cafe", store: "Gift Store", membership: "Membership"},
            channelActive:{gate:"active", cafe: "active", store: "active", membership: "active"},
            channelEmpty:{gate:true, cafe: true, store: true, membership: true},
            periodType:"week",
            members:"totals",
            units:"dollars",
            comparePeriodType:"lastperiod_1",
            date:date,
            periodFrom:date.thisWeekStart,      //mm/dd/yyyy
            periodTo:date.thisWeekLimit,          //mm/dd/yyyy
            dirty:false,
            detailsClass:"",
            detailsTitle:"Show Details",
            barEnter:null,
            compareLists:{
                week:{lastperiod_1:"Last Week", lastperiod_2:"13 Week Average"},
                weekBar:{lastperiod_1:"Same Day Previous Week", lastperiod_2:"Same Day Last Year", lastperiod_3:"13 Week Average (Day)"},
                month:{lastperiod_1:"Last Month", lastperiod_2:"Same Month Last Year"},
                monthBar:{lastperiod_1:"Same Day Last Year", lastperiod_2:"13 Week Average (Day)"},
                quarter:{lastperiod_1:"Last Quarter", lastperiod_2:"Same Quarter Last Year"},
                quarterBar:{lastperiod_1:"Last Week", lastperiod_2:"13 Week Average"}
            },
            ticketTypes:{ga:"General admission", group:"Groups", donation:"Donation", other:"Other"}
        };
    },
    onActionClick:function (event) {
        var eventAction = $(event.target).attr('href');
        switch(eventAction) {
        case "#save":
            saveImage("#revenue-row-widget2",{}, "earned-revenue");
            break;
        case "#print":
            printDiv("#revenue-row-widget2");
            break;
        default:
            return;
        }
        analytics.addEvent('Earned Revenue', 'Plus Button Clicked', eventAction);
        event.preventDefault();
    },
    buildDateDetails:function (d) {
        var du = KUtils.date; //date utilities
        
        var date = new Date(d);
        var dateLimit = new Date(wnt.today);
        var weekDay = du.getWeekDay(date);

        
        var monthDay = date.getUTCDate();
        var thisMonth = date.getUTCMonth();
        var thisYear = date.getUTCFullYear();
        var thisQuarter = du.getQuarterNumber(date);

        function applyLimit(d) {
            var date = new Date(d);
            if(date>dateLimit) {
                date = dateLimit;
            }
            return du.localFormat(date);
        }
        
        var p = {};
        
        p.currentDate = du.localFormat(d);
        //WEEK Calculations
        p.thisWeekStart = du.addDays(date, -weekDay);
        p.thisWeekEnd = du.addDays(date, 6 - weekDay);
        p.thisWeekLimit = applyLimit( p.thisWeekEnd );
        
        p.thisWeekStartMinusOneYear = du.addYears(p.thisWeekStart, -1);
        p.thisWeekLimitMinusOneYear = du.addYears(p.thisWeekLimit, -1);
        
        p.lastWeekLimit = du.addDays(p.thisWeekLimit, -7);
        p.lastWeekStart = du.addDays(p.thisWeekStart, -7);

        p.weekStart13weekAgo = du.addDays(p.thisWeekStart, -7*13);
        
        //MONTH Calculations
        p.thisMonthStart = du.addDays(date, -monthDay + 1);
        p.thisMonthEnd = du.addDays(du.addMonths(p.thisMonthStart,1), -1);
        p.thisMonthLimit = applyLimit( p.thisMonthEnd );

        p.lastMonthEnd = du.addDays(date, -monthDay);         //date 0 is last day of prev month
        p.lastMonthLimit = du.addMonths(p.thisMonthLimit, -1);
        p.lastMonthStart = du.addMonths(p.thisMonthStart, -1);

        p.lastYearSameMonthStart = du.addDays(p.thisMonthStart, -(7*52));
        p.lastYearSameMonthLimit = du.addDays(p.thisMonthLimit, -(7*52));
        
        //QUARTER Calculations
        var thisQuarterLimits = du.quarterToDates(thisQuarter, thisYear);
        p.thisQuarterStart = thisQuarterLimits.from;
        p.thisQuarterEnd = thisQuarterLimits.to;
        p.thisQuarterLimit = applyLimit( thisQuarterLimits.to );
        
        // var thisQuarterLength = new Date(p.thisQuarterLimit) - new Date(p.thisQuarterStart) ;

        var lastQuarterLimits = du.quarterToDates(thisQuarter-1, thisYear);
        p.lastQuarterStart = lastQuarterLimits.from;
        
        //if this quarter is not whole, so limit last quarter
        if (p.thisQuarterLimit != p.thisQuarterEnd) {
            var thisQuarterLength = new Date(p.thisQuarterLimit) - new Date(p.thisQuarterStart) ;
            p.lastQuarterLimit = du.localFormat(new Date( (new Date(p.lastQuarterStart)).getTime() + thisQuarterLength));
        } else {
            p.lastQuarterLimit = lastQuarterLimits.to;
        }
        

        p.lastYearSameQuarterStart = du.addYears(p.thisQuarterStart, -1);
        p.lastYearSameQuarterLimit = du.addYears(p.thisQuarterLimit, -1);
        
        //INDIVIDUAL DAYS Calculations
        // for week
        p.thisWeekStartMinusOneYear = du.addDays(p.thisWeekStart, -(52*7));
        p.thisWeekLimitMinusOneYear = du.addDays(p.thisWeekLimit, -(52*7));
        
        //for month 
        p.thisMonthLimitMinusOneWeek = du.addDays(p.thisMonthLimit, -7);
        p.thisMonthStart13WeekAgo = du.addDays(p.thisMonthStart, -7*13);
        
        //for quarter -> use real ends (lastQuarterLimits -> not limited: p.lastQuarterLimit)
        var lastQuartersLastWeekDay = du.getWeekDay(lastQuarterLimits.to);
        p.lastQuartersWholeWeekStart = du.addDays(lastQuarterLimits.to, - lastQuartersLastWeekDay - 7);
        
        var thisQuartersLastWeekDay = du.getWeekDay(p.thisQuarterLimit);
        p.thisQuartersWholeWeekEnd = du.addDays(p.thisQuarterLimit, - (thisQuartersLastWeekDay+1)%7 );
        
        return p;
        
    },
    onBarMouseDown:function (n) {
        if(this.state.detailsClass == "active")
            this.setState({barEnter:n});
    },
    onBarLeave:function () {
        this.setState({barEnter:null})
    },
    onPeriodTypeChange:function (event) {
        analytics.addEvent('Earned Revenue', 'Period Type Changed', event.target.value);
        this.setState({periodType:event.target.value, dirty:true});
    },
    onDateSelect:function (event) {
        if (this.state.periodFrom === event.target.value) {
            return;
        }
        var date = this.buildDateDetails(event.target.value);
        var formatedDate = wnt.formatDate(new Date(event.target.value));
        analytics.addEvent('Earned Revenue', 'Date Changed', formatedDate);
        this.setState({date:date, dirty:true});
    },
    getCompareList:function () {
        var barEnter = (this.state.barEnter !== null);
        var compareLists = this.state.compareLists;
        var periodType = this.state.periodType;
        if (barEnter) {
            return compareLists[periodType+"Bar"];
        }
        return compareLists[periodType];
    },
    onMembersChange:function (event) {
        analytics.addEvent('Earned Revenue', 'Member Changed', event.target.value);
        this.setState({members:event.target.value, dirty:true});
    },
    onUnitsChange:function (units) {
        analytics.addEvent('Earned Revenue', 'Units Changed', units);
        this.setState({units:units})
    },
    onChannelClick:function (channel) {
        var state = this.state;
        state.channelActive[channel] = (state.channelActive[channel] == "active") ? "" : "active" ;
        // state.dirty = true;
        this.updateSums(state);
        this.setState(state);
    },
    onComparePeriodTypeChange:function (event) {
        analytics.addEvent('Earned Revenue', 'Comparte To', event.target.value);
        this.setState({comparePeriodType:event.target.value});
    },
    onDetailsClick:function (event) {
        if (this.state.detailsClass == "") {
            this.setState({detailsClass:"active", detailsTitle:"Hide Details", barEnter:null});
        } else {
            this.setState({detailsClass:"", detailsTitle:"Show Details"});
        }
    },
    //receives state, so it can be called outside react lifecyle
    updateEmptyChannels:function (state) {
        var channelEmpty = state.channelEmpty;
        var result = state.result;
        
        for (var channel in channelEmpty) {
            if (!result[channel+"_bars"] || result[channel+"_bars"].length == 0) {
                channelEmpty[channel] = true;
            } else {
                channelEmpty[channel] = false;
            }
        }
        
        return state;
    },
    //receives state, so it can be called outside react lifecyle
    singleResultsToArray:function (state){
        for (var k in state.result) {
            if (k.indexOf("totals") < 0) {
                var r = state.result[k];
                if (Object.prototype.toString.call( r ) === "[object Object]") {
                    state.result[k] = [r];
                };
            }
        }
        return state;
    },
    updateQuarter13WeekAverage:function (state) {
        if (state.periodType != "quarter")
            return;
        
        var result = state.result;
        for (var query in result) {
            if ( (/lastperiod_2$/).test(query) ) {
                var r = result[query];
                var w13av = [];
                for (var i=0; i <= r.length-13; i++) {
                    var usum = 0;
                    var asum = 0;
                    for(var j=0; j<13; j++) {
                        usum += parseInt(r[i+j].units);
                        asum += r[i+j].amount;
                    }
                    w13av.push({units:usum/13, amount:asum/13});
                }
                result[query] = w13av;
            }
        }
        return state;
    },
    update13WeekDayAverage:function (state) {
        if (state.periodType == "quarter")
            return;

        var periodTypeReg = /lastperiod_3$/;
        
        var result = state.result;
        for (var query in result) {
            if ( (periodTypeReg).test(query) ) {
                var r = result[query];
                
                if (r.length==0) continue;

                //first fill with 0 if any date is missing
                var lastDate = new Date(r[0].period);
                for (var k=0; k<r.length; k++) {
                    var thisDate = new Date(r[k].period);
                    var diff = (thisDate - lastDate)/86400000;
                    while(diff >= 2) {
                        r.splice(k, 0, {period:"empty", units:"0", amount:0});
                        k++;
                        diff--;
                    }
                    lastDate = thisDate;
                }
                
                var w13av = [];
                for (var i=0; i < r.length - (12*7); i++) {
                    var from = r[i].period;
                    var usum = 0;
                    var asum = 0;
                    for (var j=0; j<13; j++) {
                        var sub = i+(j*7);
                         usum += parseInt(r[sub].units);
                        asum += r[sub].amount;
                    }
                    w13av.push({periodFrom:from, periodTo:r[sub].period , units:usum/13, amount:asum/13});
                }
                result[query] = w13av;
            }
        }
        return state;
    },
    updateSums:function (state) {
        var result = state.result;
        
        var total_bars = result.total_bars;
        var visitors = result.visitors;
        var partial_sum = [];
        var partial_sum_percap = [];
        var max = 0;
        var maxPercap = 0;
        for (var i in total_bars) {
            
            //Save sum, only active channels
            //And calculate percaps
            var barSum = 0;
            var percapSum = 0;
            for (var k in state.channelActive) {
                if(state.channelActive[k] == "active") {
                    if(result[k+"_bars"].length > i) {
                        
                        barSum += result[k+"_bars"][i].amount;

                        if (visitors[i]) {
                            var v = parseInt(visitors[i].units);
                            result[k+"_bars"][i].percap = result[k+"_bars"][i].amount/v;
                        } else {
                            result[k+"_bars"][i].percap = 0;
                        }
                        
                        percapSum += result[k+"_bars"][i].percap;
                    }
                }
            }
            
            partial_sum.push(barSum);
            partial_sum_percap.push(percapSum);

            //calculate max for the height of bars
            max = Math.max(barSum, max);
            maxPercap = Math.max(percapSum, maxPercap);
            
        }
        
        result.partial_sum = partial_sum;
        result.partial_sum_percap = partial_sum_percap;
        state.max = max;
        state.maxPercap = maxPercap;
        return state;
    },
    fillPartialPeriod:function(state) {
        var du = KUtils.date;
        
        var result = state.result;
        var total_bars = result.total_bars;
        
        switch (state.periodType) {
        case "quarter":
            var end = new Date(state.date.thisQuarterEnd);
            var lastDay = du.addDays(state.date.thisQuarterLimit, 1, true);
            
            if (end == lastDay) return;
            
            while(1) {
                lastDay = du.addDays(lastDay, 7, true);
                if (lastDay > end) break;
                total_bars.push({period:du.dateToWeek(lastDay), units:0, amount:0})
            }
            
            break;
        case "week":
            var end = new Date(state.date.thisWeekEnd);
            var lastDay = du.addDays(state.date.thisWeekLimit, 1, true);
            break;
        case "month":
            var end = new Date(state.date.thisMonthEnd);
            var lastDay = du.addDays(state.date.thisMonthLimit, 1, true);
            break;
        default:
            return;
        }
        
        if (end==lastDay) return;
        
        while(lastDay <= end) {
            total_bars.push({period:du.serverFormat(lastDay), units:0, amount:0})
            lastDay = du.addDays(lastDay, 1, true);
        }
        
    },
    updateData:function (state) {

        var membership = (state.members == "members") ? true : (state.members == "nonmembers") ? false : null ;
        
        var p = state.date;
        
        
        switch (state.periodType) {
        case "week":
            
            var barInterval = 'date';
            var from = p.thisWeekStart;
            var to = p.thisWeekLimit;
            var operation = 'detail';
            
            var lastFrom1 = p.lastWeekStart;
            var lastTo1 = p.lastWeekLimit;
            var lastOperation1 = 'sum';
            var lastInterval1 = 'date';

            var lastFrom2 = p.weekStart13weekAgo;
            var lastTo2 = p.lastWeekLimit;
            var lastOperation2 = 'average';
            var lastInterval2 = 'week';
            
            var lastBarFrom1 = p.lastWeekStart;
            var lastBarTo1 = p.lastWeekLimit;
            var lastBarOperation1 = 'detail';
            var lastBarInterval1 = 'date';

            var lastBarFrom2 = p.thisWeekStartMinusOneYear;
            var lastBarTo2 = p.thisWeekLimitMinusOneYear;
            var lastBarOperation2 = 'detail';
            var lastBarInterval2 = 'date';
            
            var lastBarFrom3 = p.weekStart13weekAgo;
            var lastBarTo3 = p.lastWeekLimit;
            var lastBarOperation3 = 'detail';
            var lastBarInterval3 = 'date';
            
            break;
        case "month":
            
            var barInterval = 'date';
            var from = p.thisMonthStart;
            var to = p.thisMonthLimit;
            var operation = 'detail';
            
            var lastFrom1 = p.lastMonthStart;
            var lastTo1 = p.lastMonthLimit;
            var lastOperation1 = 'sum';
            var lastInterval1 = 'date';

            var lastFrom2 = p.lastYearSameMonthStart;
            var lastTo2 = p.lastYearSameMonthLimit;
            var lastOperation2 = 'sum';
            var lastInterval2 = 'date';
            
            var lastBarFrom1 = p.lastYearSameMonthStart;
            var lastBarTo1 = p.lastYearSameMonthLimit;
            var lastBarOperation1 = 'detail';
            var lastBarInterval1 = 'date';
            
            var lastBarFrom2 = p.thisMonthStart13WeekAgo;
            var lastBarTo2 = p.thisMonthLimitMinusOneWeek;
            var lastBarOperation2 = 'detail';
            var lastBarInterval2 = 'date';
            
            break;
            
        case "quarter":
            
            var barInterval = 'week';
            var from = p.thisQuarterStart;
            var to = p.thisQuarterLimit;
            var operation = 'detail';
            
            var lastFrom1 = p.lastQuarterStart;
            var lastTo1 = p.lastQuarterLimit;
            var lastOperation1 = 'sum';
            var lastInterval1 = 'date';

            var lastFrom2 = p.lastYearSameQuarterStart;
            var lastTo2 = p.lastYearSameQuarterLimit;
            var lastOperation2 = 'sum';
            var lastInterval2 = 'date';
            
            var lastBarFrom1 = p.lastQuartersWholeWeekStart;
            var lastBarTo1 = p.thisQuartersWholeWeekEnd;
            var lastBarOperation1 = 'detail';
            var lastBarInterval1 = 'week';
            
            var lastBarFrom2 = p.lastQuarterStart;
            var lastBarTo2 = p.thisQuarterLimit;
            var lastBarOperation2 = 'detail';
            var lastBarInterval2 = 'week';
            
            break;
            
        default:
            
        }
        //for weather and other uses
        state.periodFrom = from;
        state.periodTo = to;
        state.barEnter = null;
        state.comparePeriodType = "lastperiod_1";
        
        //
        //barInterval
        
        
        var getQuery = KAPI.stats.getQuery;
        // getQuery(from, to, members, channel, type, operation, periodType)
        
        var queries = {};
        
        //GENERAL QUERIES -> CURRENT PERIOD
        
        queries.total_bars = getQuery(from, to, membership, 'ALL', 'sales', 'detail', barInterval);
        
        queries.visitors = getQuery(from, to, membership, 'ALL', 'visits', 'detail', barInterval);
        
        queries.visitors_totals = getQuery(from, to, membership, 'ALL', 'visits', 'sum', 'date');
        
        //GENERAL QUERIES -> PAST PERIODS

        queries.visitors_lastperiod_1 = getQuery(lastBarFrom1, lastBarTo1, membership, 'ALL', 'visits', 'detail', lastBarInterval1);
        
        queries.visitors_lastperiod_1_totals = getQuery(lastFrom1, lastTo1, membership, 'ALL', 'visits', 'sum', 'date');

        queries.visitors_lastperiod_2 = getQuery(lastBarFrom2, lastBarTo2, membership, 'ALL', 'visits', 'detail', lastBarInterval2);

        queries.visitors_lastperiod_2_totals = getQuery(lastFrom2, lastTo2, membership, 'ALL', 'visits', 'sum', 'date');
        
        if (lastBarFrom3) 
            queries.visitors_lastperiod_3 = getQuery(lastBarFrom3, lastBarTo3, membership, 'ALL', 'visits', 'detail', lastBarInterval3);
        //PER CHANNEL QUERIES
        
        for (var channel in state.channelActive) {
            
            //CURRENT PERIOD
            var query = getQuery(from, to, membership, channel, 'sales', 'detail', barInterval);
            
            var totals = getQuery(from, to, membership, channel, 'sales', 'sum', 'date');
            

            //LAST PERIOD
            //this results will be processed on client 13-Week-Average-(Day for week and month and Week for quarter)
        
            var lastBar1 = getQuery(lastBarFrom1, lastBarTo1, membership, channel, 'sales', lastBarOperation1, lastBarInterval1);
            
            var lastBar2 = getQuery(lastBarFrom2, lastBarTo2, membership, channel, 'sales', lastBarOperation2, lastBarInterval2);
            
            if(lastBarFrom3)
                var lastBar3 = getQuery(lastBarFrom3, lastBarTo3, membership, channel, 'sales', lastBarOperation3, lastBarInterval3);


            
            //LAST PERIOD TOTALS
            var lastPeriod1_totals = getQuery(lastFrom1, lastTo1, membership, channel, 'sales', lastOperation1, lastInterval1);

            var lastPeriod2_totals = getQuery(lastFrom2, lastTo2, membership, channel, 'sales', lastOperation2, lastInterval2);
            
            
            //WRITE VARS
            queries[channel+"_bars"] = query;
            queries[channel+"_bars_totals"] = totals;

            queries[channel+"_bars_lastperiod_1"] = lastBar1;
            queries[channel+"_bars_lastperiod_2"] = lastBar2;
            if(lastBarFrom3)
                queries[channel+"_bars_lastperiod_3"] = lastBar3;

            queries[channel+"_bars_lastperiod_1_totals"] = lastPeriod1_totals;
            queries[channel+"_bars_lastperiod_2_totals"] = lastPeriod2_totals;
            
                
        }
        
        // WARNING!!! ->>> Ticket Type should be called Product Type (tickets are only for General Admision)
        //TICKET TYPE QUERIES 
        var ticketTypes = this.state.ticketTypes;
        for (var ttype in ticketTypes) {
            
            //current period
            queries["gate_bars_by_"+ttype] = getQuery(
                    from, to, membership, 'gate', {type:"sales", kinds:[ttype]}, 'detail', barInterval
            );
            queries["gate_bars_by_"+ttype+"_totals"] = getQuery(
                    from, to, membership, 'gate', {type:"sales", kinds:[ttype]}, 'sum', 'date'
            );
            
            //Last period I
            queries["gate_bars_by_"+ttype+"_lastperiod_1"] = getQuery(
                    lastBarFrom1, lastBarTo1, membership, 'gate', {type:"sales", kinds:[ttype]}, lastBarOperation1, lastBarInterval1
            );
            queries["gate_bars_by_"+ttype+"_lastperiod_1_totals"] = getQuery(
                    lastFrom1, lastTo1, membership, 'gate', {type:"sales", kinds:[ttype]}, lastOperation1, lastInterval1
            );
            
            //Last period II
            queries["gate_bars_by_"+ttype+"_lastperiod_2"] = getQuery(
                    lastBarFrom2, lastBarTo2, membership, 'gate', {type:"sales", kinds:[ttype]}, lastBarOperation2, lastBarInterval2
            );
            queries["gate_bars_by_"+ttype+"_lastperiod_2_totals"] = getQuery(
                    lastFrom2, lastTo2, membership, 'gate', {type:"sales", kinds:[ttype]}, lastOperation2, lastInterval2
            );
            
            //Last period III (only for bars nowadays)
            queries["gate_bars_by_"+ttype+"_lastperiod_3"] = getQuery(
                    lastBarFrom3, lastBarTo3, membership, 'gate', {type:"sales", kinds:[ttype]}, lastBarOperation3, lastBarInterval3
            );
            
        }
        
        console.log("Revenue2 sending queries...", queries);
        KAPI.stats.query(wnt.venueID, queries, this.onDataUpdate);        
                
    },
    onDataUpdate:function (result) {

        var state = this.state;
        
        state.result = result;
        this.singleResultsToArray(state);
        this.updateEmptyChannels(state);
        this.updateSums(state);
        this.updateQuarter13WeekAverage(state);
        this.update13WeekDayAverage(state);
        this.fillPartialPeriod(state);
        state.dirty = false;
        
        this.setState(state);
        
        console.log("Revenue2 Data Updated", state);
        
    },
    updateWeather: function(state) {
        if (state.periodType == "quarter")
             return;

        var sf = KUtils.date.serverFormat;
        
		KAPI.weather.query(
			wnt.venueID, 
			{
                from:sf(state.periodFrom), 
                to:sf(state.periodTo)
			},
			this.onWeatherResult
		);
    },
    onWeatherResult:function (wResult) {
        var state = this.state;
        state.wResult = wResult;
        state.dirty = false;
        this.setState(state);
    },
    formatY:function (n) {
        var max = (this.state.units == "dollars") ? this.state.max : this.state.maxPercap;
        var q = n*max/4;
        if(isNaN(q)) return "";
        
        var r = "";
        if(q > 100000) {
            r = Math.round(q/1000) + "K";
        } else if(q > 10000) {
            r = Math.round(10*q/1000)/10 + "K";
        } else if(q > 1000) {
            r = Math.round(100*q/1000)/100 + "K";
        } else if(q > 100) {
            r = Math.round(q);
        } else if(q > 10) {
            r = Math.round(10*q)/10;
        } else {
            r = Math.round(100*q)/100;
        }
        return r;
    },
    componentDidMount:function () {
        this.setState({dirty:true});
    },
    shouldComponentUpdate:function (nextProps, nextState) {
        if (nextState.dirty) {
            this.updateData(nextState);
            this.updateWeather(nextState);
        };
        return !nextState.dirty;
    },
    render:function () {
        
        var channelTypes = this.state.channelNames;
        var channelActive = this.state.channelActive;
        var channelControls = [];

        for (var k in channelTypes) {
            
            var onClick;
            var empty;
            if(this.state.channelEmpty[k]) {
                empty = "empty";
                onClick = null;
            } else {
                onClick = this.onChannelClick.bind(this,k);
                empty = "";
            }
            
            channelControls.push(
                <Channel key={k} empty={empty} name={channelTypes[k]} active={channelActive[k]} onClick={onClick} />
            );
        }
        
        var bars = [];
        var result = this.state.result;
        var wResult = this.state.wResult;
        var max = this.state.max;
        if (result) {
            
            //Build BARS
            try {
                
                var total_bars = result.total_bars;
                var visitors = result.visitors;
                var partial_sum = result.partial_sum;
                var partial_sum_percap = result.partial_sum_percap;
                var barWidth = 100/total_bars.length;
                
                for (var i in total_bars) {
                    
                    var total_bar = total_bars[i];
                    var barIsEmpty = (total_bar.amount <= 0);
                    //Collect Bar Data by Channel
                    var channels = [];
                    try {
                        for(var k in channelActive) {
                            if (!barIsEmpty && channelActive[k] == "active" ) {
                                channels.push({
                                    name:channelTypes[k],
                                    data:result[k+"_bars"][i]
                                })
                            } else {
                                channels.push({});
                            }
                        };
                    } catch (e) {
                        console.log("Collect Bar Data by Channel Error -> "+e, this.state);
                    }
                    
                    //Collect Weather Data
                    try {
                        var weather;
                        if (!barIsEmpty &&  this.state.periodType != "quarter" && wResult && wResult.length > i) {
                            weather = wResult[i];
                        }
                    } catch (e) {
                        console.log("Collect Weather Data Error -> "+e, this.state);
                    }
                    
                    //Collect Attendance Data
                    try {
                        var attendance = 0;
                        if (!barIsEmpty && visitors[i]) {
                            attendance = visitors[i].units;
                        }
                    } catch (e) {
                        console.log("Collect Weather Data Error -> "+e, this.state);
                    }
                    
                    //Create GBars
                    try {
                    bars.push(<GBar
                                key={i}
                                id={"gbar-"+i}
                                units={this.state.units}
                                total={total_bar.amount}
                                attendance={attendance}
                                partial={partial_sum[i]}
                                partialPercap={partial_sum_percap[i]}
                                date={total_bar.period}
                                channels={channels}  
                                max={max}
                                maxPercap={this.state.maxPercap}
                                width={barWidth}
                                periodType={this.state.periodType}
                                weather={weather}
                                onMouseDown={this.onBarMouseDown.bind(this, i)}
                            />);
                    } catch(e) {
                        console.log("Create GBars Error -> "+e, this.state);
                    }
                }
            } catch(e) {
               console.log("Build Bars Error -> "+e, this.state);
            }
            
            //Collect General Data for Details
            try {
                
                var lastPeriodFormattedDate = KUtils.date.detailsFormat(this.state.periodFrom, this.state.periodTo);
                var showPeriodFormattedDate = "";
                var dataIndex = this.state.barEnter;
                
                if(dataIndex === null) {
                    var toSufix = "_bars_totals";
                    var fromSufix = "_bars_"+this.state.comparePeriodType+"_totals";
                    var visitors = parseInt(result.visitors_totals.units);
                    var lastVisitors = parseInt(result["visitors_"+this.state.comparePeriodType+"_totals"].units);
                    var ttTotals = "_totals";
                } else {
                    
                    toSufix = "_bars";
                    fromSufix = "_bars_"+this.state.comparePeriodType;
                
                    var visitorsDetail = this.state.result["total_bars"][dataIndex];
                    
                    if(this.state.periodType == "quarter") {
                        showPeriodFormattedDate = KUtils.date.weatherFormat (visitorsDetail.period, "quarter" );
                    } else {
                        showPeriodFormattedDate = KUtils.date.weatherFormat ( KUtils.date.localFormat(visitorsDetail.period) );
                    }
                    
                    lastPeriodFormattedDate = <span><a onClick={this.onBarLeave}>{lastPeriodFormattedDate}</a>&nbsp;&nbsp;|&nbsp;&nbsp;</span>;
                    
                    var visitors = parseInt(result.visitors[dataIndex].units);
                    var lastVisitors = parseInt(result["visitors_"+this.state.comparePeriodType][dataIndex].units);
                
                    ttTotals = "";
                };
            } catch(e) {
                console.log("Collect General Data for Details Error -> "+e, this.state);
            }
            
            
            //Build Detail Rows
            try {
                var count = 0;
                var detailsRowsLeft = [];
                var detailsRowsRight = [];
                var detailsLeftHeader = <div></div>;
                var detailsRightHeader = <div></div>;
            
                for(var k in channelActive) {

                    var detailsRows = (count%2 == 0)? detailsRowsLeft : detailsRowsRight;
                    var theOtherDetailsRows = (count%2 != 0)? detailsRowsLeft : detailsRowsRight;

                    if (channelActive[k] == "active" && !this.state.channelEmpty[k]) {
                    
                        count++; //count only displayed channels
                    
                        //Collect To data for Detail Rows
                        try {
                            var toData = result[k+toSufix];
                            
                            if (dataIndex !== null) {
                                var to = toData[dataIndex].amount;
                            } else {
                                to = toData.amount;
                            }
                            
                            if(this.state.units == "percap") {
                                to /= visitors;
                            }
                            
                        } catch (e) {
                            console.log("Collect To data for Detail Rows Error -> "+e, this.state);
                        }
                        //Collect From data for Detail Rows
                        try {
                            var fromData = result[k+fromSufix];
                            
                            if (dataIndex !== null) {
                                var from = fromData[dataIndex].amount;
                            } else {
                                from = fromData.amount;
                            }
                            
                            if(this.state.units == "percap") {
                                from /= lastVisitors;
                            }
                            
                        } catch (e) {
                            console.log("Collect From data for Detail Rows Error -> "+e, this.state);
                        }
                    
                        //Collect Ticket Type Data for Detail Rows
                        try {
                            var subDetails = [];
                            var ticketTypes = this.state.ticketTypes;
                            for (var tt in ticketTypes) {
                        
                                var ttSufix = k+"_bars_by_"+tt;
                        
                                var ttToData = this.state.result[ttSufix+ttTotals];
                                var ttFromData = this.state.result[ttSufix+"_"+this.state.comparePeriodType+ttTotals];

                                if (ttFromData && ttToData) {
                                    
                                    
                                    //Collect To/From by Ticket Type Detail Rows
                                    try {
                                        if (dataIndex !== null) {
                                            if(ttFromData[dataIndex]) {
                                                var ttFrom = ttFromData[dataIndex].amount;
                                            } else {
                                                ttFrom = 0;
                                            }
                                            
                                            if(ttFromData[dataIndex]) {
                                                var ttTo = ttToData[dataIndex].amount;
                                            } else {
                                                ttTo = 0;
                                            }
                                            
                                        } else {
                                            ttFrom = ttFromData.amount;
                                            ttTo = ttToData.amount;
                                        }
                                        
                                        if(this.state.units == "percap") {
                                            ttFrom /= lastVisitors;
                                            ttTo /= visitors;
                                        }
                                        
                                        var title = ticketTypes[tt];
                                        subDetails.push({
                                            title:title,
                                            from:ttFrom,
                                            to:ttTo,
                                            details:[]              //recursive DetailsRow requires details
                                        });
                                    } catch (e) {
                                        console.log("Collect To/From by Ticket Type Detail Rows Error -> "+e, this.state);
                                    }
                                }
                            }
                        } catch(e) {
                            console.log("Collect Ticket Type Data for Detail Rows Error -> "+e, this.state);
                        }
                        
                        //Create Detail Rows
                        try {
                            detailsRows.push(
                                <DetailsRow 
                                    key={k} from={from} to={to} title={this.state.channelNames[k]}
                                    className="parent-details multicolor-wrapper col-xs-12"
                                    details={subDetails}
                                />
                            );
                            theOtherDetailsRows.push(<div key={k} ></div>);
                        } catch (e) {
                            console.log("Create Detail Rows Error -> "+e, this.state);
                        }
                    } else {
                        detailsRows.push(<div key={k} ></div>);
                        theOtherDetailsRows.push(<div key={k} ></div>);
                    }
                };
                
                if (count>0) {
                    detailsLeftHeader = <DetailsHeader />;
                }
                if (count>1) {
                    detailsRightHeader = <DetailsHeader />;
                }
                
            } catch(e) {
                console.log("Build Detail Rows Error -> "+e);
            }
        }
        
        // Build HTML
        try {
            return (
                <div className="row">
                    <div className="position-relative"><ActionMenu className="widget-plus-menu" actions={this.state.actions}/></div>
                    <div className="col-xs-12 col-sm-12">
                        <div className="widget" id="revenue2">
                            <h2>
                                Earned Revenue
                            </h2>
                            <div className="row filters">
                                <div className="col-xs-8 col-lg-6" id="period-type">
                                    <Dropdown
                                        className="inline-block revenue-dropdown"
                                        ref="periodType"
                                        optionList={{week:"Week containing", month:"Month containing", quarter:"Quarter containing"}}
                                        selected={this.state.periodType}
                                        onChange={this.onPeriodTypeChange}
                                    />
                                    <DatePickerReact defaultDate={this.state.periodFrom} onSelect={this.onDateSelect} id="datepicker-2"/>
                                </div>
                                <div className="col-xs-4 col-lg-6 text-right" id="members">
                                    <Dropdown 
                                        className="inline-block revenue-dropdown"
                                        ref="members"
                                        optionList={{totals:"Totals", members:"Members", nonmembers:"Non-members"}}
                                        onChange={this.onMembersChange}
                                        selected={this.state.members}
                                    />
                                </div>
                            </div>
                            <div className="row filters">
                                <div id="channel-filters">
                                    <div className="col-xs-12 col-sm-6">
                                        <TabSelector 
                                            selected = {this.state.units}
                                            id="dollars"
                                            onClick={this.onUnitsChange.bind(this,"dollars")}
                                            name="Dollars"
                                        />
                                        <TabSelector 
                                            selected = {this.state.units}
                                            id="percap"
                                            onClick={this.onUnitsChange.bind(this,"percap")}
                                            name="Per Cap"
                                        />
                                    </div>
                                    <div className="col-xs-12 col-sm-6 text-right">
                                        {channelControls}
                                    </div>
                                </div>
                            </div>
                            <div className="row graphic">
                                <div id="y-axis" className="inline-block">
                                    <div className="grow">
                                        <div className="glabel">
                                            {this.formatY(4)}
                                        </div>
                                    </div><div className="grow">
                                        <div className="glabel">
                                            {this.formatY(3)}
                                        </div>
                                    </div><div className="grow">
                                        <div className="glabel">
                                            {this.formatY(2)}
                                        </div>
                                    </div><div className="grow">
                                        <div className="glabel">
                                            {this.formatY(1)}
                                        </div>
                                    </div><div className="grow">
                                        <div className="glabel">
                                            0
                                        </div>
                                    </div>
                                </div><div id="gbody"  className="inline-block">
                                    <div id="gbackground">
                                        <div className="grow">
                                        </div>
                                        <div className="grow">
                                        </div>
                                        <div className="grow">
                                        </div>
                                        <div className="grow">
                                        </div>
                                    </div>
                                    <div id="gbars">
                                        {bars}
                                    </div>
                                </div>
                            </div>
                            <div className={"row details "+this.state.detailsClass}>
                                <div className="col-xs-12 col-sm-12 descriptors">
                                    <div className="col-xs-6 col-sm-6" id="data-range">
                                        <h4 className="add-left-padding" >Date Range</h4>
                                    </div>
                                    <div className="col-xs-6 col-sm-6" id="compared-to">
                                        <h4>Compared To</h4>
                                    </div>
                                </div>
                                <div className="col-xs-12 col-sm-12">
                                    <div className="col-xs-6 col-sm-6" id="header">
                                        <div id="period" className="add-left-padding" >
                                            {lastPeriodFormattedDate}{showPeriodFormattedDate}
                                        </div>
                                        <div className="col-xs-12" id="attendance-detail">
                                            <h4>Attendance</h4>
                                            <div>{KUtils.number.formatAmount(visitors)}</div>
                                        </div>
                                    </div>
                                    <div className="col-xs-6 col-sm-6 text-right">
                                        <Dropdown
                                            className="inline-block revenue-dropdown"
                                            ref="comparePeriodType"
                                            optionList={
                                                this.getCompareList()
                                            }
                                            selected={this.state.comparePeriodType}
                                            onChange={this.onComparePeriodTypeChange}
                                        />
                                    </div>
                                </div>
                                <div className="col-xs-12 col-sm-12 details-header">
                                    <div className="col-xs-12 col-lg-6" id="table">
                                        {detailsLeftHeader}
                                    </div>
                                    <div className="col-xs-12 col-lg-6 hidden-xs hidden-sm hidden-md" id="table">
                                        {detailsRightHeader}
                                    </div>
                                </div>
                                <div className="col-xs-12 col-sm-12">
                                        <div className="col-xs-12 col-lg-6" id="table">
                                            {detailsRowsLeft}
                                        </div>
                                        <div className="col-xs-12 col-lg-6" id="table">
                                            {detailsRowsRight}
                                        </div>
                                </div>
                            </div>
                            <div className={"text-center unsavable "+this.state.detailsClass} id="details-handle" onClick={this.onDetailsClick} >
                                <CaretHandler />
                                {this.state.detailsTitle}
                            </div>
                        </div>
                    </div>
                    <div className="clearFix"></div>
                </div>
            );
        } catch(e) {
            console.log("Build HTML Error -> "+e, this.state);
            return (<div></div>);
        }
    }
});

if(document.getElementById('revenue-row-widget2')){
    $.when(wnt.gettingVenueData).done(function(data) {
        React.render(
            <Revenue2 />,
            document.getElementById('revenue-row-widget2')
        );
        console.log('0!) Revenue 2 row loaded...');
    });
}
