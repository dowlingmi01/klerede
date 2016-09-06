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

        for (v in optionList) {
            var option = <option key={v} value={v} >{optionList[v]}</option>;
            options.push(option);
        }
        
        return (
            <form className={this.props.className}>
                <select className="form-control" onChange={this.props.onChange} value={this.props.selected} >
                    {options}
                </select>
            </form>
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
        // console.log(this.props);
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
                <div key={i} className="gbar-section multicolorbg" style={{height:sectionH}} >
                </div>
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
        
        
        return(
            <div id={this.props.id} onMouseDown={this.props.onMouseDown} className="gbar" style={{width:width+"%", "marginRight":marginRight+"%", "marginLeft":marginLeft+"%"}}>
                <div ref="gbarSections" className="gbar-sections" style={{height:height+"px"}}>
                    <div ref="barTransition" className="bar-transition">
                        {sections}
                    </div>
                </div>
                <div className="glabel">
                    {KUtils.date.barFormat(this.props.date, this.props.periodType)}
                </div>
                <WeatherPopup id={"weather-popup-"+this.props.id} ref="popup" bottom={height+37} units={this.props.units} channels={channels} date={this.props.date} periodType={this.props.periodType} data={this.props.weather} />
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
        
        return(
            <div id={this.props.id} className="weather-popup" style={{bottom:this.props.bottom+"px"}}>
                <div id="weather" className="row">
                    <div id="popup-date">
                        {formattedDate}
                    </div>
                    <WeatherPopupView data={this.props.data} />
                </div>
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
        Date.firstDayOfWeek = 0;
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
            
            detailsHandler = <div id="filter-caret-wrapper" onClick={this.togleDetails}><CaretHandler className={this.state.detailsClass} /></div>;
            
        }
        
        return (
            <div className={this.props.className} >
                <div className="table-item-wrapper">
                    <div className="table-item">
                        <div className="col-xs-4 col-sm-12 col-md-4 title">
                            <div className="title-text">
                                {this.props.title}
                            </div>
                        </div>
                        <div className="col-xs-8 col-sm-12 col-md-8 title">
                            <div className="col-xs-4 col-sm-12 col-lg-4 left-line" >
                                <div className="text-center hidden-xs hidden-lg hidden-xl" style={changeStyle}>
                                    <ChangeArrow className={"change multicolorfl "+upDownClass} />
                                    <span className="multicolor" id="change">{change}</span>
                                </div>
                                <div className="hidden-sm hidden-md" style={changeStyle}>
                                    <ChangeArrow className={"change multicolorfl "+upDownClass} />
                                    <span className="multicolor" id="change">{change}</span>
                                </div>
                            </div>
                            <div className="col-xs-8 col-sm-12 col-lg-8 left-line">
                                <div className="text-center hidden-xs hidden-lg hidden-xl">
                                    <div id="from-val" style={fromStyle}>${formatAmount(from)}</div>
                                    <LongArrow className="long-arrow" width="21px" />
                                    <div className="multicolor" id="to-val" style={toStyle}>${formatAmount(to)}</div>
                                </div>
                                <div className="hidden-sm hidden-md">
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
        var weekDay = today.getUTCDay();
        var offset = (weekDay==6) ? 0 : weekDay+1;
        var periodTo = KUtils.date.addDays(today, -offset);
        var periodFrom = KUtils.date.addDays(periodTo, -6);
        
        return {
            channelNames:{gate:"Box Office", cafe: "Cafe", store: "Gift Store", membership: "Membership"},
            channelActive:{gate:"active", cafe: "active", store: "active", membership: "active"},
            channelEmpty:{gate:true, cafe: true, store: true, membership: true},
            periodType:"week",
            members:"totals",
            units:"dollars",
            comparePeriodType:"lastperiod_1",
            currentDate:periodFrom,     //mm/dd/yyyy
            periodFrom:periodFrom,      //mm/dd/yyyy
            periodTo:periodTo,          //mm/dd/yyyy
            lastFrom1:"",               //mm/dd/yyyy
            lastTo2:"",                 //mm/dd/yyyy
            lastFrom2:"",               //mm/dd/yyyy
            lastTo2:"",                 //mm/dd/yyyy
            dirty:false,
            detailsClass:"",
            detailsTitle:"Show Details",
            barEnter:null,
            ticketTypes:{ga:"General admision", group:"Groups", donation:"Donation", other:"Other"},
            barIntervals:{week:'date', month:'date', quarter:'week'},
            lastSaturday:periodTo
        };
    },
    updatePeriod:function (date, periodType) {
        var addMonths = KUtils.date.addMonths;
        var addDays = KUtils.date.addDays;
        var getWeekNumber = KUtils.date.getWeekNumber;
        var getQuarterNumber = KUtils.date.getQuarterNumber;
        var quarterToDates = KUtils.date.quarterToDates;
        var forceDigits = KUtils.number.forceDigits;
        
        switch (periodType) {
        case "quarter":
            
            var quarter = getQuarterNumber(date);
            var year = (new Date(date)).getUTCFullYear();
            var period = quarterToDates(quarter, year);
            
            var periodFrom = period.from;
            var periodTo = period.to;
            
            var last1 = quarterToDates(quarter-1, year);
            var lastFrom1 = last1.from;
            var lastTo1 = last1.to;
            
            var last2 = quarterToDates(quarter, year-1);
            var lastFrom2 = last2.from;
            var lastTo2 = last2.to;
            
            break;
        case "month":
            var monthDay = (new Date(date)).getUTCDate();
            var periodFrom = addDays(date, -monthDay+1); //first day of month
            var nextMonthDate = addMonths(periodFrom, 1);
            var periodTo = addDays(nextMonthDate, -1); //last day of month

            var lastFrom1 = addMonths(periodFrom, -1);
            var lastTo1 = addDays(periodFrom, -1);
            var lastFrom2 = addMonths(periodFrom, -12);
            var lastTo2 = addMonths(periodTo, -12);

            break;
        case "week":
        default:
            var periodFrom = date;
            var periodTo = addDays(periodFrom, +6);

            var lastFrom1 = addDays(periodFrom, -7);
            var lastTo1 = addDays(periodFrom, -1);
            var lastFrom2 = addDays(periodFrom, -(13*7));
            var lastTo2 = addDays(periodFrom, -7);
        }
        
        //date should not be greater than wnt.today;
        if (new Date(periodTo) > new Date(wnt.today)) {

            var dayLimit = wnt.today;
            
            if(periodType == "quarter") {
                dayLimit = this.state.lastSaturday;
            }
            
            var offset = new Date(periodTo) - new Date(dayLimit);
            periodTo = KUtils.date.localFormat(dayLimit);
            
            lastTo1 = KUtils.date.formatFromDate( 
                        new Date( 
                            (new Date(lastTo1)) - offset
                        ) 
                    );
            if (periodType != "week") {
                lastTo2 = KUtils.date.formatFromDate( 
                            new Date(
                                (new Date(lastTo2)) - offset 
                            )
                        );
            }
            
        }
        
        var state = this.state;
        state.currentDate = date;
        state.periodFrom = periodFrom;
        state.periodTo = periodTo;
        state.periodType = periodType;

        state.lastFrom1 = lastFrom1;
        state.lastTo1 = lastTo1;
        state.lastFrom2 = lastFrom2;
        state.lastTo2 = lastTo2;
        
        state.barEnter = null; //clears selected bar every time date changes
        
        state.dirty = true;
        console.log(state);
        this.setState(state);
    },
    onBarMouseDown:function (n) {
        
        if (this.state.periodType == "week" && this.state.comparePeriodType == "lastperiod_2")
            return;
        
        if(this.state.detailsClass == "active")
            this.setState({barEnter:n});
        
    },
    onBarLeave:function () {
        this.setState({barEnter:null})
    },
    onPeriodTypeChange:function (event) {
        this.updatePeriod(this.state.currentDate, event.target.value);
    },
    onDateSelect:function (event) {
        if (this.state.periodFrom === event.target.value) {
            return;
        }
        this.updatePeriod(event.target.value, this.state.periodType);
    },
    onMembersChange:function (event) {
        this.setState({members:event.target.value, dirty:true});
    },
    onUnitsChange:function (units) {
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
        // for (var k in state.channelActive) {
        //     var bars = state.result[k+"_bars"];
        //     if (Object.prototype.toString.call( bars ) === "[object Object]") {
        //         state.result[k+"_bars"] = [bars];
        //     };
        // }
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
        state.result = result;
        return state;
    },
    updateData:function (state) {
        
        var membership;
        switch (state.members) {
        case "members":
            membership = true;
            break;
        case "nonmembers":
            membership = false;
            break;
        default:
            break;
        }
        
        var barInterval = this.state.barIntervals[this.state.periodType];
        
        //GET KAPI stats functions
        var getQuery = KAPI.stats.getQuery; // getQuery(from, to, members, channel, type, operation, periodType)
        
        //GET KUtils date functions
        var serverFormat = KUtils.date.serverFormat;
        var addDays = KUtils.date.addDays;
        var addMonths = KUtils.date.addMonths;
        var addYears = KUtils.date.addYears;
        // var serverFormatWeek = KUtils.date.serverFormatWeek;
        
        
        //GENERAL QUERIES -> CURRENT PERIOD
        var periodFrom = serverFormat(state.periodFrom);
        var periodTo = serverFormat(state.periodTo);

        var queries = {};
        
        queries.total_bars = getQuery(periodFrom, periodTo, membership, 'ALL', 'sales', 'detail', barInterval);
        
        queries.visitors = getQuery(periodFrom, periodTo, membership, 'ALL', 'visits', 'detail', barInterval);
        
        queries.visitors_totals = getQuery(periodFrom, periodTo, membership, 'ALL', 'visits', 'sum', 'date');
        

        //GENERAL QUERIES -> PAST PERIODS
        var from1 =  serverFormat(state.lastFrom1);
        var to1 = serverFormat(state.lastTo1);
        var from2 = serverFormat(state.lastFrom2);
        var to2 = serverFormat(state.lastTo2);
        // var from2WeekFormat = serverFormatWeek(state.lastFrom2);
        // var to2WeekFormat = serverFormatWeek(state.lastTo2);

        queries.visitors_lastperiod_1 = getQuery(from1, to1, membership, 'ALL', 'visits', 'detail', barInterval);
        queries.visitors_lastperiod_1_totals = getQuery(from1, to1, membership, 'ALL', 'visits', 'sum', 'date');


        if(state.periodType == "week") {
            
            var visitors_lastperiod_2 = {}; //TODO: How to ask server for day by day last 13 week average visits or sales?

            queries.visitors_lastperiod_2_totals = getQuery(from2, to2, membership, 'ALL', 'visits', 'average', 'week');
            // console.log(from2, to2)
            
        } else { 
            //month and quarter
            queries.visitors_lastperiod_2_totals = getQuery(from2, to2, membership, 'ALL', 'visits', 'sum', 'date');

            queries.visitors_lastperiod_2 = getQuery(from2, to2, membership, 'ALL', 'visits', 'detail', 'date');
            
        }
        
        
        //PER CHANNEL QUERIES
        
        for (var channel in state.channelActive) {
            
            //CURRENT PERIOD
            var query = getQuery(periodFrom, periodTo, membership, channel, 'sales', 'detail', barInterval);
            
            var totals = getQuery(periodFrom, periodTo, membership, channel, 'sales', 'sum', 'date');
            

            //LAST PERIOD
            var lastPeriod1 = getQuery(from1, to1, membership, channel, 'sales', 'detail', barInterval);
            
            if (state.periodType == "week"){
                
                var lastPeriod2 = {};
                
            } else {
                
                var lastPeriod2 = getQuery(from2, to2, membership, channel, 'sales', 'detail', barInterval);
                
            }
            

            //LAST PERIOD TOTALS
            var lastPeriod1_totals = getQuery(from1, to1, membership, channel, 'sales', 'sum');

            if (state.periodType == "week") {
                
                var lastPeriod2_totals = getQuery(from2, to2, membership, channel, 'sales', 'average', 'week');
                
            } else {
                
                var lastPeriod2_totals = getQuery(from2, to2, membership, channel, 'sales', 'sum', 'date');
                
            }
            
            
            //WRITE VARS
            queries[channel+"_bars"] = query;
            queries[channel+"_bars_totals"] = totals;
            queries[channel+"_bars_lastperiod_1"] = lastPeriod1;
            queries[channel+"_bars_lastperiod_2"] = lastPeriod2;
            queries[channel+"_bars_lastperiod_1_totals"] = lastPeriod1_totals;
            queries[channel+"_bars_lastperiod_2_totals"] = lastPeriod2_totals;
        }
        
        // WARNING!!! ->>> Ticket Type should be called Product Type (tickets are only for General Admision)
        //TICKET TYPE QUERIES 
        var ticketTypes = this.state.ticketTypes;
        for (var ttype in ticketTypes) {
            
            //current period
            queries["gate_bars_by_"+ttype] = getQuery(
                    periodFrom, periodTo, membership, 'gate', {type:"sales", kinds:[ttype]}, 'detail', 'date'
            );
            // console.log([periodFrom, periodTo, membership, 'gate', {type:"sales", kinds:[ttype]}, 'detail', 'date'],queries["gate_bars_by_"+ttype]);
            queries["gate_bars_by_"+ttype+"_totals"] = getQuery(
                    periodFrom, periodTo, membership, 'gate', {type:"sales", kinds:[ttype]}, 'sum', 'date'
            );
            
            //Last period I
            queries["gate_bars_by_"+ttype+"_lastperiod_1"] = getQuery(
                    from1, to1, membership, 'gate', {type:"sales", kinds:[ttype]}, 'detail', 'date'
            );
            queries["gate_bars_by_"+ttype+"_lastperiod_1_totals"] = getQuery(
                    from1, to1, membership, 'gate', {type:"sales", kinds:[ttype]}, 'sum', 'date'
            );
            
            //Last period II
            if (state.periodType == "week") {
                queries["gate_bars_by_"+ttype+"_lastperiod_2_totals"] = getQuery(
                        from2, to2, membership, 'gate', {type:"sales", kinds:[ttype]}, 'average', 'week'
                );
                
            } else {
                queries["gate_bars_by_"+ttype+"_lastperiod_2"] = getQuery(
                        from2, to2, membership, 'gate', {type:"sales", kinds:[ttype]}, 'detail', 'date'
                );
                queries["gate_bars_by_"+ttype+"_lastperiod_2_totals"] = getQuery(
                        from2, to2, membership, 'gate', {type:"sales", kinds:[ttype]}, 'sum', 'date'
                );
            }
        }
        
        
        
        console.log(queries);
        KAPI.stats.query(wnt.venueID, queries, this.onDataUpdate);
    },
    onDataUpdate:function (result) {

        console.log(result);
        
        var state = this.state;
        
        state.result = result;
        this.singleResultsToArray(state);
        this.updateEmptyChannels(state);
        this.updateSums(state);
        state.dirty = false;
        this.setState(state);
    },
    updateWeather: function(state) {
        console.log("UpdateWeather");
        if (state.periodType == "quarter") {
            return;
        }
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
        console.log(wResult);
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
        this.updatePeriod(this.state.currentDate, this.state.periodType);
    },
    shouldComponentUpdate:function (nextProps, nextState) {
        // console.log(nextState.dirty);
        if (nextState.dirty) {
            this.updateWeather(nextState);
            this.updateData(nextState);
        };
        return !nextState.dirty;
    },
    render:function () {
        
        // console.log(this.state);
        
        var channelTypes = this.state.channelNames;
        var channelActive = this.state.channelActive;
        var channelControls = [];

        for (k in channelTypes) {
            
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
                var partial_sum = result.partial_sum;
                var partial_sum_percap = result.partial_sum_percap;
                var barWidth = 100/total_bars.length;
                
                for (var i in total_bars) {
                    
                    //Collect Bar Data by Channel
                    var channels = [];
                    try {
                        for(var k in channelActive) {
                            if (channelActive[k] == "active") {
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
                        if (this.state.periodType != "quarter" && wResult && wResult.length > i) {
                            weather = wResult[i];
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
                                total={total_bars[i].amount}
                                partial={partial_sum[i]}
                                partialPercap={partial_sum_percap[i]}
                                date={total_bars[i].period}
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
            
                for(var k in channelActive) {

                    var detailsRows = (count%2 == 0)? detailsRowsLeft : detailsRowsRight;

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
                        } catch (e) {
                            console.log("Create Detail Rows Error -> "+e, this.state);
                        }
                    } else {
                        detailsRows.push(<div key={k} ></div>);
                    }
                };
            } catch(e) {
                console.log("Build Detail Rows Error -> "+e);
            }
        }
        
        if(!result) { console.log("Revenue 2 -> No Result Yet.")};
        
        // Build HTML
        try {
            return (
                <div className="row">
                    <div className="col-xs-12 col-sm-12">
                        <div className="widget" id="revenue2">
                            <h2>
                                Earned Revenue
                            </h2>
                            <div className="row filters">
                                <div className="col-xs-8 col-lg-6" id="period-type">
                                    <Dropdown
                                        className="inline-block"
                                        ref="periodType"
                                        optionList={{week:"Week containing", month:"Month containing", quarter:"Quarter containing"}}
                                        selected={this.state.periodType}
                                        onChange={this.onPeriodTypeChange}
                                    />
                                    <DatePickerReact defaultDate={this.state.periodFrom} onSelect={this.onDateSelect} id="datepicker-2"/>
                                </div>
                                <div className="col-xs-4 col-lg-6 text-right" id="members">
                                    <Dropdown 
                                        className="inline-block"
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
                                        <h4>Date Range</h4>
                                    </div>
                                    <div className="col-xs-6 col-sm-6" id="compared-to">
                                        <h4>Compared To</h4>
                                    </div>
                                </div>
                                <div className="col-xs-12 col-sm-12">
                                    <div className="col-xs-6 col-sm-6" id="header">
                                    
                                        {lastPeriodFormattedDate}{showPeriodFormattedDate}
                                    
                                    </div>
                                    <div className="col-xs-6 col-sm-6 text-right">
                                        <Dropdown
                                            className="inline-block"
                                            ref="comparePeriodType"
                                            optionList={
                                                (this.state.periodType == "week") ?
                                                    {lastperiod_1:"Last Week", lastperiod_2:"13 Week Average"}
                                                :
                                                    (this.state.periodType == "month") ?
                                                    {lastperiod_1:"Last Month", lastperiod_2:"Same Month Last Year"}
                                                    : {lastperiod_1:"Last Quarter", lastperiod_2:"Same Quarter Last Year"}
                                            }
                                            selected={this.state.comparePeriodType}
                                            onChange={this.onComparePeriodTypeChange}
                                        />
                                    </div>
                                </div>
                                <div className="col-xs-12 col-sm-12 details-header">
                                    <div className="col-xs-12 col-sm-6" id="table">
                                        <DetailsHeader />
                                    </div>
                                    <div className="col-xs-12 col-sm-6 hidden-xs" id="table">
                                        <DetailsHeader />
                                    </div>
                                </div>
                                <div className="col-xs-12 col-sm-12">
                                        <div className="col-xs-12 col-sm-6" id="table">
                                            {detailsRowsLeft}
                                        </div>
                                        <div className="col-xs-12 col-sm-6" id="table">
                                            {detailsRowsRight}
                                        </div>
                                </div>
                            </div>
                            <div className={"text-center "+this.state.detailsClass} id="details-handle" onClick={this.onDetailsClick} >
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
