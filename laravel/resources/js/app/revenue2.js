var React = require('react');
var ReactDOM = require('react-dom');
var getDOMNode = require('./kutils/getDOMNode.js');
var $ = require('jquery');

var analytics = require("./analytics.js");

var KAPI = {};
KAPI.stats = require("./kapi/stats.js");
KAPI.weather = require("./kapi/weather.js");

var KUtils = {};
KUtils.date = require("./kutils/date-utils.js");
KUtils.number = require("./kutils/number-utils.js");

var printDiv = require ('./kutils/print-div.js');
var saveImage = require ('./kutils/save-image.js');

var wnt = require ('./kcomponents/wnt.js');
var categories = require ('./kcomponents/categories.js');
var Channel = require('./kcomponents/channel.js');
var ChannelNames = require('./kcomponents/channel-names');
var Notes = require('./kcomponents/notes.js');

var CalendarIcon = require('./svg-icons').CalendarIcon;
var Caret = require('./svg-icons').Caret;
var ChangeArrow = require('./svg-icons').ChangeArrow;
var CloseIcon = require('./svg-icons').CloseIcon;
var CheckMark = require('./svg-icons').CheckMark;
var LongArrow = require('./svg-icons').LongArrow;
var SlimPlusSign = require('./svg-icons').SlimPlusSign;
var SlimMinusSign = require('./svg-icons').SlimMinusSign;

var ActionMenu = require('./reusable-parts').ActionMenu;

require('../libs/jquery.datePicker.js');
require('../libs/jquery.simulate.js');
require('bootstrap');

var CaretHandler = React.createClass({
    render:function () {
        return(
            <svg xmlns="http://www.w3.org/2000/svg" width="30px" height="7px" viewBox="0 0 21.294 15.555" preserveAspectRatio="xMidYMid meet" className={"filter-caret "+this.props.className}><path d="M21.854 0.439l-7.366 7.365L12.523 9.77L10.56 7.804L3.196 0.441C2.425-0.185 1.293-0.147 0.6 0.6 c-0.768 0.768-0.768 2 0 2.778l9.983 9.983l1.964 1.966l1.965-1.966l9.984-9.983c0.383-0.383 0.575-0.886 0.575-1.389 c0-0.502-0.192-1.006-0.575-1.389C23.755-0.146 22.626-0.185 21.9 0.4"/></svg>
        );
    }
});

var Dropdown = React.createClass({
	onCaretClick:function (e) {
		console.log(this.refs.selectElement);
		$(this.refs.selectElement).simulate('mousedown');
	},
    render:function () {

        var optionList = this.props.optionList;
        var options = [];
        
        if(this.props.placeholder) {
            options.push(<option disabled key={'placeholder'} value="placeholder">{this.props.placeholder}</option>)
        }
        
        
        for (var v in optionList) {
            var option = <option key={v} value={v}>{optionList[v]}</option>;
            options.push(option);
        }
        
        return (
            <div className={this.props.className}>
                <div className="inline-block" onClick={this.onCaretClick}><Caret className="filter-caret dropdown" /></div>
                <select ref="selectElement" className="form-control" value={this.props.selected} onChange={this.props.onChange} >
                    {options}
                </select>
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
        
        var popup = getDOMNode(this.refs.popup);
        
        $(getDOMNode(this.refs.gbarSections)).on("mouseover", function(event){
            // console.log($(popup));
            $(popup).fadeIn(300);
        });
        $(getDOMNode(this.refs.gbarSections)).on("mouseleave", function(event){
            $(popup).finish();
            $(popup).fadeOut(150);
        });
    },
    render:function () {

        var channelUnits = this.props.channelUnits;
        var isEmpty = (this.props.total<=0);
        var channels = this.props.channels;
        var sections = [];
        for (var i in channels) {
            var channel = channels[i];
            
            if (!channel.data) {
                sections.push(<div key={i}></div>);
                continue;
            }
            var sectionH = (100*channel.data[channelUnits]/this.props.partial) + "%";
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
        
        var weatherDiv =<WeatherPopup id={"weather-popup-"+this.props.id} ref="popup" bottom={height+37} units={this.props.units} channelUnits={channelUnits} channels={channels} date={this.props.date} periodType={this.props.periodType} data={this.props.weather} attendance={this.props.attendance} />;
        
        return(
            <div id={this.props.id} onMouseDown={onMouseDown} className="gbar" style={{width:width+"%", "marginRight":marginRight+"%", "marginLeft":marginLeft+"%", cursor: isEmpty?'initial':'pointer'}}>
                <div ref="gbarSections" className="gbar-sections" style={{height:height+"px"}}>
                        {sections}
                </div>
                <div className="glabel">
                    {KUtils.date.barFormat(this.props.date, this.props.periodType)}
                </div>
                <div style={isEmpty? {display:"none"} : {} }>
                    {weatherDiv}
                </div>
            </div>
        );
    }
});

var ChannelPopup = React.createClass({
    render:function () {
        var numFormat = KUtils.number.formatAmount;
        var key = this.props.channelUnits;
        var sign = "$";
        if (this.props.units == "percap") {
            key = "percap";
        }
        if (this.props.units == "attendance-tab") {
            // key = "amount";
            sign = "";
            numFormat = KUtils.number.formatInteger;
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
                    {sign}{numFormat(this.props.data[key])}
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
        
        var popupChannels = [];
        var channels = this.props.channels;
        for (var i in channels) {
            var channel = channels[i];
            if (!channel.data) {
                popupChannels.push(<div key={i}></div>);
                continue;
            }
            popupChannels.push(<ChannelPopup key={i} name={channels[i].name}  channelUnits={this.props.channelUnits} data={channels[i].data} units={this.props.units} />);
        }
        
        var formattedDate = KUtils.date.weatherFormat(this.props.date, this.props.periodType);

        var attendance = this.props.attendance;

        return(
            <div id={this.props.id} className="weather-popup" style={{bottom:this.props.bottom+"px"}}>
                <div id="weather" className="row">
                    <div id="popup-date">
                        {formattedDate}
                    </div>
                    <WeatherPopupView data={this.props.data} />
                </div>
                <div className="attendance row" >{attendance}</div>
                <div id="details" className="row">
                    {popupChannels}
                </div>
                <div id="arrow">
        
                </div>
            </div>            
        );
    }
});

var DatePickerJQuery = React.createClass({
    getInitialState:function () {
       return({
           endDate:new Date(wnt.doubleDigits(wnt.thisMonthNum+1)+'/'+wnt.doubleDigits(wnt.thisDate)+'/'+wnt.thisYear),
           displayedMonth:wnt.thisMonthNum+1, 
           displayedYear:wnt.thisYear
       }) 
    },
    updateWeek:function (e, div) {
        var calendar = $(div);
        var trList = calendar.find("tr");
        $.each(trList, function(i, tr) {
            if($(tr).find(".selected").length) {
                $(tr).find("td").addClass("selected");
            };
        });
        this.updateEmptyDays(this.state.displayedMonth, this.state.displayedYear);
    },
    onMonthChanged:function (event, m, y) {
        m += 1;
        this.setState({displayedMonth:m, displayedYear:y});
        this.updateEmptyDays(m, y);
    },
    updateEmptyDays:function (m, y) {
        
        var state = this.state;
        var calendar = $(".dp-calendar");
        var trList = calendar.find("tr");
        
        $.each(trList, function(i, tr) {
            var tdList = $(tr).find("td");
            $.each(tdList, function(i, td) {
                var d = parseInt($(td).text());
                var date = new Date(m+"/"+d+"/"+y);

                if (!$(td).hasClass("other-month")) {
                    if (date > state.endDate) {
                        $(td).addClass("no-data");
                    };
                }
            });
        });
    },
    componentDidMount: function() {
        Date.firstDayOfWeek = KUtils.date.firstDayOfWeek;
        Date.format = 'mm/dd/yyyy';
        // var dp = $('#'+this.props.id).datePicker({
        var dp = $('#'+this.props.id).datePicker({
            selectWeek: false,
            closeOnSelect: true,
            startDate: '01/01/1996',
            defaultDate:this.props.defaultDate
        });
        
        $("input#datepicker-2").bind("dateSelected", this.props.onSelect);
        $("input#datepicker-2").bind("dpDisplayed", this.updateWeek);
        $("input#datepicker-2").bind("dpMonthChanged", this.onMonthChanged);
        
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
        var formatNumber = this.props.formatNumber;

        var from = this.props.from;
        var to = this.props.to;
        
        // if((from==0 || from==undefined) && (to==0 || to == undefined) ) {
        //     return null;
        // }
        // if (this.props.title == "Studio") {
        //     // console.debug("Studio",from==undefined)
        // }
        
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
                        formatNumber={this.props.formatNumber}
                        sign={this.props.sign}
                        details={detail.details}
                        level={this.props.level + 1}
                    />
                )
            }
            
            detailsHandler = <div id="filter-caret-wrapper" className="left-line col-xs-1" onClick={this.togleDetails}><CaretHandler className={this.state.detailsClass} /></div>;
            
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
                        <div className="col-xs-7 title">
                            <div className="col-xs-4 left-line" >
                                <div className="" style={changeStyle}>
                                    <ChangeArrow className={"change multicolorfl "+upDownClass} />
                                    <span className="multicolor" id="change">{change}</span>
                                </div>
                            </div>
                            <div className="col-xs-8 left-line">
                                <div className="">
                                    <div id="from-val" style={fromStyle}>{this.props.sign}{formatNumber(from)}</div>
                                    <LongArrow className="long-arrow" width="21px" />
                                    <div className="multicolor" id="to-val"  style={toStyle}>{this.props.sign}{formatNumber(to)}</div>
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

var ActivatedChannels = function(filter) {
    var cList = categories();
    var channels = {};
    
    for (var i in cList) {
        var ch = cList[i];

        if (filter) {
            if (filter.indexOf(ch.key)<0) {
                continue;
            }
        }

        channels[ch.key] = 'active';
    }
    return channels;
}

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
        
        var regularUnitsData = {
            channelNames:ChannelNames(),
            channelActive:ActivatedChannels(),//{gate:"active", cafe: "active", store: "active", membership: "active"},
            attendanceDetailTitle:"Attendance"
        }

        var attendanceData = {
            channelNames:regularUnitsData.channelNames,
            channelActive:ActivatedChannels(["guest_services", "programming"]),
            attendanceDetailTitle:"Revenue"
        }
        return {
            actions:actions,
            channelEmpty:{},
            dollars:regularUnitsData,
            percap:regularUnitsData,
            'attendance-tab':attendanceData,
            resultPrefix:'sales',
            periodType:"week",
            members:"totals",
            units:"dollars",
            comparePeriodType:"lastperiod_1",
            date:date,
            periodFrom:date.thisWeekStart,      //mm/dd/yyyy
            periodTo:date.thisWeekLimit,          //mm/dd/yyyy
            lastDay:date.thisWeekLimit,
            dirty:-1,
            dirtyWeather:-1,
            detailsClass:"",
            detailsTitle:"Show Details",
            barEnter:null,
            compareLists:{
                week:{lastperiod_1:"Last Week", lastperiod_3:"Same Week Last Year", lastperiod_2:"13 Week Average", },
                weekBar:{lastperiod_1:"Same Day Previous Week", lastperiod_2:"Same Day Last Year", lastperiod_3:"13 Week Average (Day)"},
                month:{lastperiod_1:"Last Month", lastperiod_2:"Same Month Last Year"},
                monthBar:{lastperiod_1:"Same Day Last Year", lastperiod_2:"13 Week Average (Day)"},
                quarter:{lastperiod_1:"Last Quarter", lastperiod_2:"Same Quarter Last Year"},
                quarterBar:{lastperiod_1:"Last Week", lastperiod_2:"13 Week Average"}
            },
            resultLength:0
        };
    },
    onActionClick:function (event) {
        var eventAction = $(event.target).attr('href');
        switch(eventAction) {
        case "#save":
            saveImage("#revenue-row-widget2",{}, "Revenue Chart");
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
        
        p.thisWeekStartMinusOneYear = du.addDays(p.thisWeekStart, -364);
        p.thisWeekLimitMinusOneYear = du.addDays(p.thisWeekLimit, -364);
        
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
        // p.thisWeekStartMinusOneYear = du.addDays(p.thisWeekStart, -(52*7));
        // p.thisWeekLimitMinusOneYear = du.addDays(p.thisWeekLimit, -(52*7));
        
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
        if(this.state.detailsClass != "active")
            this.openDetails();
        this.setState({barEnter:n});
    },
    onBarLeave:function () {
        this.setState({barEnter:null})
    },
    onPeriodTypeChange:function (event) {
        analytics.addEvent('Earned Revenue', 'Period Type Changed', event.target.value);
        this.setState({periodType:event.target.value, dirty:1});
    },
    onDateSelect:function (event) {
        if (this.state.date.currentDate === event.target.value) {
            return;
        };
        this.dateUpdate(event.target.value);
    },
    dateUpdate:function(newDate) {
        var date = this.buildDateDetails(newDate);
        var formatedDate = wnt.formatDate(new Date(newDate));
        analytics.addEvent('Earned Revenue', 'Date Changed', formatedDate);
        this.setState({date:date, dirty:1, dirtyWeather:1, periodFrom:newDate});
    },
    quarterShowNotes:function (newDate) {
        this.setState({periodType:"week",showFirstNote:true});
        this.dateUpdate(newDate);
    },
    onShowFristNoteComplete:function () {
        this.setState({showFirstNote:false});
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
        this.setState({members:event.target.value, dirty:1});
    },
    onUnitsChange:function (units) {
        
        if (units == this.state.units) return;
            
        analytics.addEvent('Earned Revenue', 'Units Changed', units);
        
        var newState = this.state;
        newState.units = units;
        
        if (units == 'attendance-tab') {
            newState.members = "totals";
            newState.resultPrefix = "visitors_revenue";
            // this.updateSums(newState);
            // newState.dirty = 1;
        } else {
            newState.resultPrefix = "sales";
        }
        //  else if( this.state.units == 'attendance-tab' ) {
        //     // newState.dirty = 1;
        // }
        this.updateSums(newState);
        
        this.setState(newState);
        
    },
    onChannelClick:function (channel) {
        var state = this.state;
        var channelActive = state[state.units].channelActive
        channelActive[channel] = (channelActive[channel] == "active") ? "" : "active" ;
        this.updateSums(state);
        this.setState(state);
    },
    onComparePeriodTypeChange:function (event) {
        analytics.addEvent('Earned Revenue', 'Comparte To', event.target.value);
        this.setState({comparePeriodType:event.target.value});
    },
    openDetails:function () {
        this.setState({detailsClass:"active", detailsTitle:"Hide Details", barEnter:null});
    },
    onDetailsClick:function (event) {
        if (this.state.detailsClass == "") {
            this.openDetails();
        } else {
            this.setState({detailsClass:"", detailsTitle:"Show Details"});
        }
    },
    //receives state, so it can be called outside react lifecyle
    updateEmptyChannels:function (state) {
        var channels = state[state.units].channelActive;
        var channelEmpty = {};
        var result = state.result;
        var resultPrefix = state.resultPrefix;
        
        for (var channel in channels) {
            if (!result[resultPrefix+"_totals"] || !result[resultPrefix+"_totals"][channel]) {
                channelEmpty[channel] = true;
            } else {
                channelEmpty[channel] = false;
            }
        }
        state.channelEmpty = channelEmpty;
        return state;
    },
    //receives state, so it can be called outside react lifecyle
    // singleResultsToArray:function (state){
    //     for (var k in state.result) {
    //         if (k.indexOf("totals") < 0) {
    //             var r = state.result[k];
    //             if (Object.prototype.toString.call( r ) === "[object Object]") {
    //                 state.result[k] = [r];
    //             };
    //         }
    //     }
    //     return state;
    // },
    fillHoles:function (state){
        
        if (state.periodType == "quarter") {
            var quarter = true;
        }
        
        var du = KUtils.date;
        
        var result = state.result;
        var queries = state.lastQueries;

        for(var k in result) {
            if ( !(/total/).test(k) || k == "sales" ) {
                var r = result[k];
                
                if (!r || r.length == 0)  {
                    // console.debug("result is empty", k)
                    continue;
                }
                
                var q = queries[k];
                if (!q) {
                    var l = k.replace(prefix, "gate_bars");
                    q = queries[l];
                    if (!q) {
                        console.error("periods not found in "+k+" or "+l,queries[k], queries[l]);
                        continue;
                    }
                }
                
                if (quarter) {
                    var start = du.getDateFromWeek(q.periods.from, true);
                    var end = du.getDateFromWeek(q.periods.to, true);
                    for (var i=0 ; i<r.length; i++) {
                    
                        var current = du.getDateFromWeek(r[i].period, true);
                    
                        while (start < current) { //exit on start == current
                            var fill = {period:du.dateToWeek(start.toISOString()), units:0, amount:0};
                            r.splice(i, 0, fill);
                            start = du.addDays(start, 7, true);
                        }
                        start = du.addDays(start, 7, true)
                    }
                    
                } else {
                    var start = new Date(q.periods.from);
                    var end = new Date(q.periods.to);
                
                    for (var i=0 ; i<r.length; i++) {
                    
                        var current = new Date(r[i].period);
                    
                        while (start < current) { //exit on start == current
                            var fill = {period:du.serverFormat(start), units:0, amount:0};
                            // console.debug(k,fill);
                            r.splice(i, 0, fill);
                            start = du.addDays(start, 1, true);
                        }
                        start = du.addDays(start, 1, true)
                    }
                }
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
                        asum += parseFloat(r[i+j].amount);
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
        
            // 0           +1 +2 +3
            // 7           +1 +2 +3
            // 14          +1 +2 +3
            // ...         +1 +2 +3
            // 12x7        +1 +2 +3
            // -> 12x7+1   +1 +2 +3 hasta que sea nulo
            
        function addAvg(sum, channels) {
            for(var channel in channels) {
                if (!sum[channel]) {
                    sum[channel] = {amount:0, units:0, transactions:0, visits:0, visits_unique:0, sub_categories:{}};
                }
                sum[channel].amount += parseFloat(channels[channel].amount)/13;
                sum[channel].units += parseInt(channels[channel].units)/13;
                sum[channel].transactions += parseInt(channels[channel].transactions)/13;
                sum[channel].visits += parseInt(channels[channel].visits)/13;
                sum[channel].visits_unique += parseInt(channels[channel].visits_unique)/13;
                // console.debug(sum.sub_categories);
                addAvg(sum[channel].sub_categories, channels[channel].sub_categories);
            }
        }
        
        var sufix = state.periodType == "month" ? "_lastperiod_2" :  "_lastperiod_3" ;
        var result = state.result;
        var sales = result["sales"+sufix];
        var visitors_revenue = result["visitors_revenue"+sufix];
        var visitors = result["visitors"+sufix];
        var dates = Object.keys(sales);
        var w13avg = {};
        var revenueW13avg = {};
        var visitorsAvg = {};
        
        for (var i=0; 12*7+i < dates.length; i++) {
            var sum = {};
            var rSum = {};
            var vSum = {visits:0, visits_unique:0};
            for (var j=0; j<=12; j++) {
                var date = dates[j*7 + i];
                // console.debug(date, r[date].guest_services);
                addAvg(sum, sales[date]);
                addAvg(rSum, visitors_revenue[date]);
                
                vSum.visits += parseInt(visitors[date].visits)/13;
                vSum.visits_unique += parseInt(visitors[date].visits_unique)/13;
            }
            w13avg[ dates[12*7+i] ] = sum;
            revenueW13avg[ dates[12*7+i] ] = rSum;
            visitorsAvg[ dates[12*7+i] ] = vSum;
            
            // console.debug(12*7+i+1)
        }

        result["sales"+sufix] = w13avg;
        result["visitors_revenue"+sufix] = revenueW13avg;
        result["visitors"+sufix] = visitorsAvg;
        return state;
    },
    updateSums:function (state) {
        var result = state.result;
        
        var channelActive = state[state.units].channelActive;
        var barData = result[state.resultPrefix];
        var visitors = result.visitors;
        var partial_sum = {};
        var partial_sum_percap = {};
        var max = 0;
        var maxPercap = 0;
        var count = 0;

        var unitSufix = this.state.units == 'attendance-tab'?'visits_unique':'amount';

        for (var i in barData) {
            
            //Save sum, only active channels
            //And calculate percaps
            var barSum = 0;
            var percapSum = 0;
            for (var k in barData[i]) {
                
                var bar = barData[i][k];
                
                if(channelActive[k] == "active") {
                    barSum += parseInt( bar[unitSufix] );

                    if (visitors[i]) {
                        var v = parseInt(visitors[i].visits_unique);
                        bar.percap = bar[unitSufix]/v;
                    } else {
                        bar.percap = 0;
                    }
                    
                    percapSum += bar.percap;
                }
            }
            
            partial_sum[i] = barSum;
            partial_sum_percap[i] = percapSum;
            count++;

            //calculate max for the height of bars
            max = Math.max(barSum, max);
            maxPercap = Math.max(percapSum, maxPercap);
            
        }
        state.resultLength = count;
        result.partial_sum = partial_sum;
        result.partial_sum_percap = partial_sum_percap;
        state.max = max;
        state.maxPercap = maxPercap;
        return state;
    },
    fillPartialPeriod:function(state) {
        // if (state.periodType != "quarter") return;
        var du = KUtils.date;
        
        var result = state.result;
        var sales = result.sales;
        var visitors_revenue = result.visitors_revenue;
        
        switch (state.periodType) {
        case "quarter":
            var firstDay = new Date(state.date.thisQuarterStart);
            var end = new Date(state.date.thisQuarterEnd);
            var lastDay = du.addDays(state.date.thisQuarterLimit, 1, true);
            
            if (end == lastDay) return;
            if (firstDay > lastDay)
                lastDay = firstDay;
            
            while(1) {
                lastDay = du.addDays(lastDay, 7, true);
                if (lastDay > end) break;
                visitors_revenue[du.dateToWeek(lastDay)] =  {};
                sales[du.dateToWeek(lastDay)] =  {};
                state.resultLength++;
            }
            
            break;
        case "week":
            var firstDay = new Date(state.date.thisWeekStart);
            var end = new Date(state.date.thisWeekEnd);
            var lastDay = du.addDays(state.date.thisWeekLimit, 1, true);
            break;
        case "month":
            var firstDay = new Date(state.date.thisMonthStart);
            var end = new Date(state.date.thisMonthEnd);
            var lastDay = du.addDays(state.date.thisMonthLimit, 1, true);
            break;
        default:
            return;
        }
        
        if (end==lastDay) return;
        if (firstDay > lastDay)
            lastDay = firstDay;
                
        while(lastDay <= end) {
            visitors_revenue[du.serverFormat(lastDay)] =  {};
            sales[du.serverFormat(lastDay)] =  {};
            lastDay = du.addDays(lastDay, 1, true);
            state.resultLength++;
        }
        state.lastDay = lastDay;
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
            
            var lastFrom3 = p.thisWeekStartMinusOneYear;
            var lastTo3 = p.thisWeekLimitMinusOneYear;
            var lastOperation3 = 'sum';
            var lastInterval3 = 'date';
            
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
        
        queries.sales = getQuery(from, to, membership, 'ALL', 'sales', 'detail', barInterval, true);

        queries.sales_totals = getQuery(from, to, membership, 'ALL', 'sales', 'sum', barInterval, true);


        queries.revenue = getQuery(from, to, membership, 'ALL', 'sales', 'detail', barInterval);

        queries.revenue_totals = getQuery(from, to, membership, 'ALL', 'sales', 'sum', barInterval);

        
        queries.visitors_revenue = getQuery(from, to, membership, 'ALL', 'visits', 'detail', barInterval, true);

        queries.visitors_revenue_totals = getQuery(from, to, membership, 'ALL', 'visits', 'sum', barInterval, true);

        
        queries.visitors = getQuery(from, to, membership, 'ALL', 'visits', 'detail', barInterval);

        queries.visitors_totals = getQuery(from, to, membership, 'ALL', 'visits', 'sum', 'date');

        
        

        //GENERAL QUERIES -> PAST PERIODS

        queries.sales_lastperiod_1 = getQuery(lastBarFrom1, lastBarTo1, membership, 'ALL', 'sales', 'detail', lastBarInterval1, true);

        queries.sales_lastperiod_1_totals = getQuery(lastFrom1, lastTo1, membership, 'ALL', 'sales', lastOperation1, lastInterval1, true);
        

        queries.revenue_lastperiod_1 = getQuery(lastBarFrom1, lastBarTo1, membership, 'ALL', 'sales', 'detail', lastBarInterval1);

        queries.revenue_lastperiod_1_totals = getQuery(lastFrom1, lastTo1, membership, 'ALL', 'sales', lastOperation1, lastInterval1);
        

        queries.visitors_revenue_lastperiod_1 = getQuery(lastBarFrom1, lastBarTo1, membership, 'ALL', 'visits', 'detail', lastBarInterval1, true);

        queries.visitors_revenue_lastperiod_1_totals = getQuery(lastFrom1, lastTo1, membership, 'ALL', 'visits', lastOperation1, lastInterval1, true);


        queries.visitors_lastperiod_1 = getQuery(lastBarFrom1, lastBarTo1, membership, 'ALL', 'visits', 'detail', lastBarInterval1);
        
        queries.visitors_lastperiod_1_totals = getQuery(lastFrom1, lastTo1, membership, 'ALL', 'visits', 'sum', 'date');
        



        queries.sales_lastperiod_2 = getQuery(lastBarFrom2, lastBarTo2, membership, 'ALL', 'sales', 'detail', lastBarInterval2, true);

        queries.sales_lastperiod_2_totals = getQuery(lastFrom2, lastTo2, membership, 'ALL', 'sales', lastOperation2, lastInterval2, true);
        

        queries.revenue_lastperiod_2 = getQuery(lastBarFrom2, lastBarTo2, membership, 'ALL', 'sales', 'detail', lastBarInterval2);

        queries.revenue_lastperiod_2_totals = getQuery(lastFrom2, lastTo2, membership, 'ALL', 'sales', lastOperation2, lastInterval2);
        

        queries.visitors_revenue_lastperiod_2 = getQuery(lastBarFrom2, lastBarTo2, membership, 'ALL', 'visits', 'detail', lastBarInterval2, true);

        queries.visitors_revenue_lastperiod_2_totals = getQuery(lastFrom2, lastTo2, membership, 'ALL', 'visits', lastOperation2, lastInterval2, true);


        queries.visitors_lastperiod_2 = getQuery(lastBarFrom2, lastBarTo2, membership, 'ALL', 'visits', 'detail', lastBarInterval2);

        queries.visitors_lastperiod_2_totals = getQuery(lastFrom2, lastTo2, membership, 'ALL', 'visits', 'sum', 'date');
        


        if (lastBarFrom3) {

            queries.sales_lastperiod_3 = getQuery(lastBarFrom3, lastBarTo3, membership, 'ALL', 'sales', 'detail', lastBarInterval3, true);

            queries.revenue_lastperiod_3 = getQuery(lastBarFrom3, lastBarTo3, membership, 'ALL', 'sales', 'detail', lastBarInterval3);

            queries.visitors_revenue_lastperiod_3 = getQuery(lastBarFrom3, lastBarTo3, membership, 'ALL', 'visits', 'detail', lastBarInterval3, true);
        
            queries.visitors_lastperiod_3 = getQuery(lastBarFrom3, lastBarTo3, membership, 'ALL', 'visits', 'detail', lastBarInterval3);
            
        }

        if (lastFrom3) {
            
            queries.sales_lastperiod_3_totals = getQuery(lastFrom3, lastTo3, membership, 'ALL', 'sales', lastOperation3, lastInterval3, true);
            
            queries.revenue_lastperiod_3_totals = getQuery(lastFrom3, lastTo3, membership, 'ALL', 'sales', lastOperation3, lastInterval3);
            
            queries.visitors_revenue_lastperiod_3_totals = getQuery(lastFrom3, lastTo3, membership, 'ALL', 'visits', lastOperation3, lastInterval3, true);
            
            queries.visitors_lastperiod_3_totals = getQuery(lastFrom3, lastTo3, membership, 'ALL', 'visits', 'sum', 'date');
            
        }
        
        /*
        //PER CHANNEL QUERIES
        var channelActive = state[state.units].channelActive;
        for (var channel in channelActive) {
            
            //TODO: be more explicit defining the type of query
            var type = 'sales';
            if((/^visitors/i).test(channel))
                type = 'visits';
            
            //CURRENT PERIOD
            var query = getQuery(from, to, membership, channel, type, 'detail', barInterval);
            
            var totals = getQuery(from, to, membership, channel, type, 'sum', 'date');
            

            //LAST PERIOD
            //this results will be processed on client 13-Week-Average-(Day for week and month and Week for quarter)
        
            var lastBar1 = getQuery(lastBarFrom1, lastBarTo1, membership, channel, type, lastBarOperation1, lastBarInterval1);
            
            var lastBar2 = getQuery(lastBarFrom2, lastBarTo2, membership, channel, type, lastBarOperation2, lastBarInterval2);
            
            if(lastBarFrom3)
                var lastBar3 = getQuery(lastBarFrom3, lastBarTo3, membership, channel, type, lastBarOperation3, lastBarInterval3);


            
            //LAST PERIOD TOTALS
            var lastPeriod1_totals = getQuery(lastFrom1, lastTo1, membership, channel, type, lastOperation1, lastInterval1);

            var lastPeriod2_totals = getQuery(lastFrom2, lastTo2, membership, channel, type, lastOperation2, lastInterval2);
            
            if(lastFrom3) 
                var lastPeriod3_totals = getQuery(lastFrom3, lastTo3, membership, channel, type, lastOperation3, lastInterval3);
            
            
            //WRITE VARS
            queries[channel+"_bars"] = query;
            queries[channel+"_bars_totals"] = totals;

            queries[channel+"_bars_lastperiod_1"] = lastBar1;
            queries[channel+"_bars_lastperiod_2"] = lastBar2;
            if(lastBarFrom3)
                queries[channel+"_bars_lastperiod_3"] = lastBar3;

            queries[channel+"_bars_lastperiod_1_totals"] = lastPeriod1_totals;
            queries[channel+"_bars_lastperiod_2_totals"] = lastPeriod2_totals;
            if(lastFrom3)
                queries[channel+"_bars_lastperiod_3_totals"] = lastPeriod3_totals;
            
                
        }
        
        //PRODUCT TYPE QUERIES 
        var childCategories = state[state.units].childCategories;
        var qDetails = state[state.units].childCategoriesQdetails;
        var prefix = qDetails.prefix;
        var channel = qDetails.channel;
        var type = qDetails.type;
        
        for (var kind in childCategories) {
            //current period
            queries[prefix+kind] = getQuery(
                    from, to, membership, channel, {type:type, kinds:[kind]}, 'detail', barInterval
            );
            queries[prefix+kind+"_totals"] = getQuery(
                    from, to, membership, channel, {type:type, kinds:[kind]}, 'sum', 'date'
            );
            
            //Last period I
            queries[prefix+kind+"_lastperiod_1"] = getQuery(
                    lastBarFrom1, lastBarTo1, membership, channel, {type:type, kinds:[kind]}, lastBarOperation1, lastBarInterval1
            );
            queries[prefix+kind+"_lastperiod_1_totals"] = getQuery(
                    lastFrom1, lastTo1, membership, channel, {type:type, kinds:[kind]}, lastOperation1, lastInterval1
            );
            
            //Last period II
            queries[prefix+kind+"_lastperiod_2"] = getQuery(
                    lastBarFrom2, lastBarTo2, membership, channel, {type:type, kinds:[kind]}, lastBarOperation2, lastBarInterval2
            );
            queries[prefix+kind+"_lastperiod_2_totals"] = getQuery(
                    lastFrom2, lastTo2, membership, channel, {type:type, kinds:[kind]}, lastOperation2, lastInterval2
            );
            
            //Last period III
            queries[prefix+kind+"_lastperiod_3"] = getQuery(
                    lastBarFrom3, lastBarTo3, membership, channel, {type:type, kinds:[kind]}, lastBarOperation3, lastBarInterval3
            );
            if(lastFrom3)
                queries[prefix+kind+"_lastperiod_3_totals"] = getQuery(
                        lastFrom3, lastTo3, membership, channel, {type:type, kinds:[kind]}, lastOperation3, lastInterval3
                );
            
            
        }
        */
        
        console.log("Revenue2 sending queries...", queries);
        state.lastQueries = queries;
        KAPI.stats.query(wnt.venueID, queries, this.onDataUpdate);        
                
    },
    onDataUpdate:function (result) {

        var state = this.state;
        
        state.result = result;
        // this.singleResultsToArray(state);

        // this.fillHoles(state);
        this.updateEmptyChannels(state);
        
        this.updateSums(state);
        // this.updateQuarter13WeekAverage(state);
        this.update13WeekDayAverage(state);
        this.fillPartialPeriod(state);
        state.dirty = -1;
        
        this.setState(state);
        
        console.log("Revenue2 Data Updated", state);
        
    },
    updateWeather: function(state) {
        if (state.periodType == "quarter")
             return false;
        
        var sf = KUtils.date.serverFormat;
        
		KAPI.weather.query(
			wnt.venueID, 
			{
                from:sf(state.periodFrom), 
                to:sf(state.periodTo)
			},
			this.onWeatherResult
		);
        return true;
    },
    onWeatherResult:function (wResult) {
        var state = this.state;
        state.wResult = wResult;
        state.dirtyWeather = -1;
        this.setState(state);
    },
    formatY:function (n) {
        var max = (this.state.units == "percap") ? this.state.maxPercap : this.state.max;
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
        this.setState({dirty:1, dirtyWeather:1});
    },
    shouldComponentUpdate:function (nextProps, nextState) {
        if (nextState.dirtyWeather === 1) {
            nextState.dirtyWeather = 0;
            if (this.updateWeather(nextState) === false) {
                nextState.dirtyWeather = -1;
            };
        };
        if (nextState.dirty === 1) {
            nextState.dirty = 0;
            this.updateData(nextState);
        };
        var should = !(nextState.dirty >= 0 || nextState.dirtyWeather >=0);
        return should;
    },
    render:function () {
        var isNotAttendanceTab = this.state.units != 'attendance-tab';
        var isPercap = this.state.units == "percap";
        var unitsData = this.state[this.state.units];
        var channelNames = unitsData.channelNames;
        var channelActive = unitsData.channelActive;
        var channelControls = [];
        
        for (var k in channelActive) {
            
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
                <Channel key={k} empty={empty} name={channelNames[k]} active={channelActive[k]} onClick={onClick} />
            );
        }
        
        var bars = [];
        var result = this.state.result;
        var resultPrefix = this.state.resultPrefix;
        var wResult = this.state.wResult;
        var max = this.state.max;
        var rUnits = this.state.units != "attendance-tab" ? "amount" : "visits_unique";

        if (result) {
            
            //Build BARS
            try {
                var barData = result[resultPrefix];
                var visitors = result.visitors;
                var partial_sum = result.partial_sum;
                var partial_sum_percap = result.partial_sum_percap;
                var barWidth = 100/this.state.resultLength;
                
                for (var i in barData) {
                    
                    var total_bar = barData[i];
                    var barIsEmpty = (total_bar[rUnits] <= 0);
                    //Collect Bar Data by Channel
                    var channels = [];
                    try {
                        for(var k in channelActive) {
                            if (!barIsEmpty && channelActive[k] == "active" ) {
                                channels.push({
                                    name:channelNames[k],
                                    data:barData[i][k]
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
                        if (!barIsEmpty &&  this.state.periodType != "quarter" && wResult ) {
                            for (var wi=0; wi<wResult.length; wi++) {
                                if (wResult[wi].date == i) {
                                    weather = wResult[wi];
                                }
                            }
                        }
                    } catch (e) {
                        console.log("Collect Weather Data Error -> "+e, this.state);
                    }
                    
                    //Collect Attendance or Visitors Revenue Data
                    try {
                        var attendance = 0;
                        var formatAmount = KUtils.number.formatAmount;
                        if (!barIsEmpty) {
                            attendance = isNotAttendanceTab ? 
                                "Attendance: "+formatAmount(visitors[i].visits_unique, 0) 
                                    : 
                                "Revenue: $"+formatAmount(result.revenue[i].amount) ;
                        }
                    } catch (e) {
                        // console.log("Collect Weather Data Error -> "+e, this.state);
                    }
                    
                    //Create GBars
                    try {
                    bars.push(<GBar
                                key={i}
                                id={"gbar-"+i}
                                units={this.state.units}
                                channelUnits={rUnits}
                                total={total_bar[rUnits]}
                                attendance={attendance}
                                partial={partial_sum[i]}
                                partialPercap={partial_sum_percap[i]}
                                date={i}
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
                var dateSelected = this.state.barEnter;
                var lastDateSelected = null;
                
                if (dateSelected) {
                    var c = 0;
                    for (var d in barData) {
                        if(d==dateSelected) {
                            var lastSales = result[resultPrefix+"_"+this.state.comparePeriodType]; 
                            var c2 = 0;
                            for(var d2 in lastSales) {
                                if(c2==c) {
                                    lastDateSelected = d2;
                                    break;
                                };
                                c2++;
                            }
                            break;
                        };
                        c++;
                    }
                }
                
                if(dateSelected === null) {
                    var toSufix = resultPrefix+"_totals";
                    var fromSufix = resultPrefix+"_"+this.state.comparePeriodType+"_totals";
                    var visitors = parseInt(result.visitors_totals.visits_unique);
                    var revenue = parseInt(result.revenue_totals.amount);
                    var lastVisitors = parseInt(result["visitors_"+this.state.comparePeriodType+"_totals"].visits_unique);
                    var lastRevenue = parseInt(result["revenue_"+this.state.comparePeriodType+"_totals"].amount);
                    var ttTotals = "_totals";
                } else {
                    
                    toSufix = resultPrefix;
                    fromSufix = resultPrefix+"_"+this.state.comparePeriodType;
                
                    if(this.state.periodType == "quarter") {
                        showPeriodFormattedDate = KUtils.date.weatherFormat (dateSelected, "quarter" );
                    } else {
                        showPeriodFormattedDate = KUtils.date.weatherFormat ( KUtils.date.localFormat(dateSelected) );
                    }
                    
                    lastPeriodFormattedDate = <span><a onClick={this.onBarLeave}>{lastPeriodFormattedDate}</a>&nbsp;&nbsp;|&nbsp;&nbsp;</span>;
                    
                    var visitors = parseInt(result.visitors[dateSelected].visits_unique);
                    var lastVisitors = parseInt(result["visitors_"+this.state.comparePeriodType][lastDateSelected].visits_unique);

                    var revenue = parseInt(result.revenue[dateSelected].amount);
                    var lastRevenue = parseInt(result["revenue_"+this.state.comparePeriodType][lastDateSelected].amount);
                
                    ttTotals = "";
                };
            } catch(e) {
                console.log("Collect General Data for Details Error -> "+e, this.state);
            }
            
            //Data for attendance/revenue comparison
            if(isNotAttendanceTab) {
                var arCurrent = visitors;
                var arLast = lastVisitors;
                var arSign = "";
                var arCurrentFormatted = KUtils.number.formatInteger(arCurrent);
                var arLastFormatted = KUtils.number.formatInteger(arLast);
            } else {
                var arCurrent = revenue;
                var arLast = lastRevenue;
                var arSign = "$";
                var arCurrentFormatted = KUtils.number.formatAmount(arCurrent);
                var arLastFormatted = KUtils.number.formatAmount(arLast);
            }
            
            var percent = (100*((arCurrent/arLast) - 1)).toFixed(2);
            if (isNaN(percent)) {
                percent = "";
                var change = <span></span>;
            } else {
                var upDownClass = percent >= 0 ? "up"  : "down";
                var change = <span className={"change "+upDownClass}>(
                        <ChangeArrow className={upDownClass} />
                        <span className="" id="change">{percent}%</span>
                    )
                </span>;
            }
            var attendanceDetailData = <span>
                                            <small>{arSign}</small> {arCurrentFormatted}
                                            &nbsp;&nbsp;|&nbsp;&nbsp;
                                            <small>{arSign}</small> <span className="attendance-last">{arLastFormatted}</span>&nbsp;&nbsp;{change}
                                        </span>;            
            
            //Build Detail Rows
            try {
                var count = 0;
                var detailsRowsLeft = [];
                var detailsRowsRight = [];
                var detailsLeftHeader = <div></div>;
                var detailsRightHeader = <div></div>;
                var sign = isNotAttendanceTab ? "$" : "";
                var detailsFormatNumber = isNotAttendanceTab ?  KUtils.number.formatAmount: KUtils.number.formatInteger;
            
                for(var k in channelActive) {

                    var detailsRows = (count%2 == 0)? detailsRowsLeft : detailsRowsRight;
                    var theOtherDetailsRows = (count%2 != 0)? detailsRowsLeft : detailsRowsRight;

                    if (channelActive[k] == "active" && !this.state.channelEmpty[k]) {
                    
                        count++; //count only displayed channels
                        
                        //Collect From/To data for Detail Rows
                        try {
                            if (dateSelected !== null) {
                                var toData = result[toSufix][dateSelected][k];
                                var fromData = result[fromSufix][lastDateSelected][k];
                            } else {
                                toData = result[toSufix][k];
                                fromData = result[fromSufix][k];
                            }

                            var to = toData[rUnits];
                            var from = fromData[rUnits];
                            
                            if(isPercap) {
                                to /= visitors;
                                from /= lastVisitors;
                            }
                            
                        } catch (e) {
                            console.log("Collect From/To data for Detail Rows Error -> "+e, this.state);
                        }
                        
                        function getSubDetails(ttFromData, ttToData) {
                            
                            var subDetails = [];
                            var fromSubcats = ttFromData ? ttFromData.sub_categories || {} : {};
                            var toSubcats = ttToData ? ttToData.sub_categories || {} : {};
                            
                            for (var subCat in toSubcats) {
                                try {
                                    var fromSubcat = fromSubcats[subCat] || {};
                                    var toSubcat = toSubcats[subCat] || {};
                                    var title = channelNames[subCat];//childCategories[tt];
                                } catch(e) {
                                    console.log("getSubDetails() for error -> "+e, ttFromData, fromSubcats);
                                }
                                var fromNumber = fromSubcat[rUnits];
                                var toNumber = toSubcat[rUnits];
                                
                                if((fromNumber==0 || fromNumber==undefined) && (toNumber==0 || toNumber == undefined) ) {
                                    continue;
                                }
                                if(isPercap) {
                                    fromNumber /= lastVisitors;
                                    toNumber /= visitors;
                                }
                                
                                subDetails.push({
                                    title:title,
                                    from:fromNumber,
                                    to:toNumber,
                                    details:getSubDetails(fromSubcat, toSubcat)
                                });
                            }
                            
                            return subDetails;
                            
                        }

                        try {
                            var subDetails = getSubDetails(fromData, toData);
                        } catch (e) {
                            console.log("getSubDetails() Error -> "+e,toData, fromData, subDetails);
                        }

                        //Create Detail Rows
                        try {
                            detailsRows.push(
                                <DetailsRow 
                                    key={k} from={from} to={to} title={unitsData.channelNames[k]}
                                    className="parent-details multicolor-wrapper col-xs-12"
                                    formatNumber = {detailsFormatNumber}
                                    details={subDetails}
                                    sign={sign}
                                    level={0}
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
        
        //Membership option
        
        var membersDropDown = isNotAttendanceTab ? 
                <Dropdown 
                    className="inline-block revenue-dropdown"
                    ref="members"
                    optionList={{totals:"Totals", members:"Members", nonmembers:"Non-members"}}
                    onChange={this.onMembersChange}
                    selected={this.state.members}
                />
                :<div></div>    ;
        
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
                                    <DatePickerJQuery defaultDate={this.state.date.currentDate} onSelect={this.onDateSelect} id="datepicker-2"/>
                                </div>
                                <div className="col-xs-4 col-lg-6 text-right" id="members">
                                    {membersDropDown}
                                </div>
                            </div>
                            <div className="row filters">
                                <div id="channel-filters">
                                    <div className="col-xs-12 col-sm-4">
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
                                        <TabSelector 
                                            selected = {this.state.units}
                                            id="attendance-tab"
                                            onClick={this.onUnitsChange.bind(this,"attendance-tab")}
                                            name="Attendance"
                                        />
                                    </div>
                                    <div className="col-xs-12 col-sm-8 text-right">
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
                            { (features.notes) ?
                                <div className="row notes-container">
                                    <Notes 
                                        startDate={KUtils.date.serverFormat(this.state.periodFrom)} 
                                        endDate={KUtils.date.serverFormat(this.state.lastDay)}
                                        date={this.state.date}
                                        onShowNotes = {this.quarterShowNotes}
                                        showFirstNote = {this.state.showFirstNote}
                                        onShowFristNoteComplete = {this.onShowFristNoteComplete}
                                        isQuarter = {this.state.periodType == "quarter" }
                                        barCount={Object.keys(result[resultPrefix]).length}
                                        periodType = {this.state.periodType}
                                    />
                                </div>
                            :
                                <div></div>
                            }
                            <div className={"row details "+(this.state.resultLength ? this.state.detailsClass : "")}>
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
                                            <h4>{this.state[this.state.units].attendanceDetailTitle}</h4>
                                            <div>{attendanceDetailData}</div>
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
                            {this.state.resultLength ? 
                                <div className={"text-center unsavable "+this.state.detailsClass} id="details-handle" onClick={this.onDetailsClick} >
                                    <CaretHandler /><div id="details-title">{this.state.detailsTitle}</div>
                                    
                                </div>
                            :
                                <div></div>
                            }
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
        ReactDOM.render(
            <Revenue2 />,
            document.getElementById('revenue-row-widget2')
        );
        console.log('0!) Revenue 2 row loaded...');
    });
}
