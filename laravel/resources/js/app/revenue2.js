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
            <div id={this.props.id} className="gbar" style={{width:width+"%", "marginRight":marginRight+"%", "marginLeft":marginLeft+"%"}}>
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
    //props
    //from - to - title
    render:function () {
        var formatAmount = KUtils.number.formatAmount;

        var from = this.props.from;
        var to = this.props.to;

        var upDownClass = to > from ? "up" : "down";

        var change = 100*((to/from) - 1);
        change = Math.abs(Math.round(100*change)/100);
        
        
        var details = this.props.details;
        var detailsRows = [];
        var detailsHandler = <div></div>;
        
        if (details.length) {
            
            detailsHandler = <div id="filter-caret-wrapper" onClick={this.togleDetails}><CaretHandler className={this.state.detailsClass} /></div>;
            
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
        }
        
        return (
            <div className={this.props.className} >
                <div className="table-item-wrapper">
                    <div className="table-item">
                        <div className="col-md-4 title">
                            <div className="title-text">
                                {this.props.title}
                            </div>
                        </div>
                        <div className="col-md-8">
                            <div className="col-md-12 col-lg-4 left-line">
                                <div className="text-center hidden-lg hidden-xl">
                                    <ChangeArrow className={"change multicolorfl "+upDownClass} />
                                    <span className="multicolor" id="change">{change}%</span>
                                </div>
                                <div className=" hidden-xs hidden-sm hidden-md">
                                    <ChangeArrow className={"change multicolorfl "+upDownClass} />
                                    <span className="multicolor" id="change">{change}%</span>
                                </div>
                            </div>
                            <div className="col-md-12 col-lg-8 left-line">
                                <div className="text-center hidden-lg hidden-xl">
                                    <div id="from-val">${formatAmount(from)}</div>&nbsp;&nbsp;
                                    <LongArrow className="long-arrow" width="21px" />
                                    &nbsp;&nbsp;<div className="multicolor" id="to-val" >${formatAmount(to)}</div>
                                </div>
                                <div className=" hidden-xs hidden-sm hidden-md">
                                    <div id="from-val">${formatAmount(from)}</div>&nbsp;&nbsp;
                                    <LongArrow className="long-arrow" width="21px" />
                                    &nbsp;&nbsp;<div className="multicolor" id="to-val" >${formatAmount(to)}</div>
                                </div>
                            </div>
                        </div>
                        {detailsHandler}
                    </div>
                </div>
                <div className={"child-details-wrapper "+this.state.detailsClass}>
                    {detailsRows}
                </div>
            </div>
        )
    }
});
var Revenue2 = React.createClass({
    getInitialState:function () {

        var today = new Date(KUtils.date.format(wnt.today));
        var weekDay = today.getUTCDay();
        var offset = (weekDay==6) ? 0 : weekDay-1;
        var periodTo = KUtils.date.addDays(today, offset);
        var periodFrom = KUtils.date.addDays(periodTo, -6);
        
        return {
            channelNames:{gate:"Box Office", cafe: "Cafe", store: "Gift Store", membership: "Membership"},
            channelActive:{gate:"active", cafe: "active", store: "active", membership: "active"},
            channelEmpty:{gate:true, cafe: true, store: true, membership: true},
            periodType:"week",
            periodTypeForServer:"date",
            members:"totals",
            units:"dollars",
            comparePeriodType:"lastperiod_1",
            currentDate:periodFrom,
            periodFrom:periodFrom,
            periodTo:periodTo,
            dirty:false,
            detailsClass:"",
            detailsTitle:"Show Details"
        };
    },
    updatePeriod:function (date, periodType) {
        var addMonths = KUtils.date.addMonths;
        var addDays = KUtils.date.addDays;
        var getWeekNumber = KUtils.date.getWeekNumber;
        var getQuarterNumber = KUtils.date.getQuarterNumber;
        var getDateFromWeek = KUtils.date.getDateFromWeek;
        var forceDigits = KUtils.number.forceDigits;
        var periodTypeForServer = "date";
        
        var sf = KUtils.date.serverFormat;
        
        switch (periodType) {
        case "quarter":
            var quarter = getQuarterNumber(date); //Math.ceil(week/13);
            var year = (new Date(date)).getUTCFullYear();
            
            var periodFrom = getDateFromWeek(year+"-"+(quarter-1)*13);//->tengo la semana
            var periodTo = getDateFromWeek(year+"-"+(quarter*13-1));//->tengo la semana
            periodTypeForServer = "week";
            
            var lastFrom1 = addDays(periodFrom, -(13*7));
            var lastTo1 = addDays(periodFrom, -1);
            var lastFrom2 = (sf(periodFrom, periodTypeForServer)).split("-");  //yyyy-w
            var lastTo2 = (sf(periodTo, periodTypeForServer)).split("-");    //yyyy-w
            lastFrom2 = (parseInt(lastFrom2[0])-1)+"-"+lastFrom2[1];
            lastTo2 = (parseInt(lastTo2[0])-1)+"-"+lastTo2[1];
            
            
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
        
        var state = this.state;
        state.currentDate = date;
        state.periodFrom = periodFrom;
        state.periodTo = periodTo;
        state.periodType = periodType;
        state.periodTypeForServer = periodTypeForServer;

        state.lastFrom1 = lastFrom1;
        state.lastTo1 = lastTo1;
        state.lastFrom2 = lastFrom2;
        state.lastTo2 = lastTo2;

        state.dirty = true;
        this.setState(state);
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
            this.setState({detailsClass:"active", detailsTitle:"Hide Details"});
        } else {
            this.setState({detailsClass:"", detailsTitle:"Show Details"});
        }
    },
    //receives state, so it can be called outside react lyfecyle
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
    //receives state, so it can be called outside react lyfecyle
    singleResultsToArray:function (state){
        for (var k in state.channelActive) {
            var bars = state.result[k+"_bars"];
            if (Object.prototype.toString.call( bars ) === "[object Object]") {
                state.result[k+"_bars"] = [bars];
            };
        }
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
        
        
        var sf = KUtils.date.serverFormat;
        var addDays = KUtils.date.addDays;
        var addMonths = KUtils.date.addMonths;
        var addYears = KUtils.date.addYears;
        var serverFormatWeek = KUtils.date.serverFormatWeek;

        var queries = {};
        queries.total_bars = {
            periods:{
                type:state.periodTypeForServer, 
                from:sf(state.periodFrom, state.periodTypeForServer), 
                to:sf(state.periodTo, state.periodTypeForServer)},
            specs: {type:"sales", members:membership}
        };
        queries.visitors = {
            periods:{
                type:state.periodTypeForServer, 
                from:sf(state.periodFrom, state.periodTypeForServer), 
                to:sf(state.periodTo, state.periodTypeForServer)},
            specs: {type:"visits"}
        };
        queries.visitors_total = {
            periods:{
                type:state.periodTypeForServer, 
                from:sf(state.periodFrom, state.periodTypeForServer), 
                to:sf(state.periodTo, state.periodTypeForServer),
                kind:"sum"
            },
            specs: {type:"visits"}
        };
        
        if (membership === true) {
            queries.visitors.specs.kinds = ["membership"];
        } else if (membership === false) {
            queries.visitors.specs.kinds = ["ga", "group"];
        }

        var from1 =  state.lastFrom1;
        var to1 = state.lastTo1;
        var from2 = state.lastFrom2;
        var to2 = state.lastTo2;

        if(state.periodType == "week") {
            queries.visitors_lastperiod_1 = {
                periods:{
                    type:state.periodTypeForServer, 
                    from:sf(from1), 
                    to:sf(to1),
                    kind:"sum"
                },
                specs: {type:"visits"}
            };
            queries.visitors_lastperiod_2 = {
                periods:{
                    type:state.periodTypeForServer, 
                    from:sf(from2), 
                    to:sf(to2),
                    kind:"average"
                },
                specs: {type:"visits"}
            };
            
        } else if(state.periodType == "month"){
            queries.visitors_lastperiod_1 = {
                periods:{
                    type:state.periodTypeForServer, 
                    from:sf(from1), 
                    to:sf(to1),
                    kind:"sum"
                },
                specs: {type:"visits"}
            };
            queries.visitors_lastperiod_2 = {
                periods:{
                    type:state.periodTypeForServer, 
                    from:sf(from2), 
                    to:sf(to2),
                    kind:"sum"
                },
                specs: {type:"visits"}
            };

        } else if(state.periodType == "quarter"){
            queries.visitors_lastperiod_1 = {
                periods:{
                    type:state.periodTypeForServer, 
                    from:sf(from1), 
                    to:sf(to1),
                    kind:"sum"
                },
                specs: {type:"visits"}
            };
            queries.visitors_lastperiod_2 = {
                periods:{
                    type:state.periodTypeForServer, 
                    from:from2, 
                    to:to2,
                    kind:"sum"
                },
                specs: {type:"visits"}
            };
        }
        
        
        
        for (var channel in state.channelActive) {
            var query = {
                periods:{
                    type:state.periodTypeForServer, 
                    from:sf(state.periodFrom, state.periodTypeForServer), 
                    to:sf(state.periodTo, state.periodTypeForServer)
                },
                specs:{type:"sales", channel:channel, members:membership}
            }
            var totals = {
                periods:{
                    type:state.periodTypeForServer, 
                    from:sf(state.periodFrom, state.periodTypeForServer), 
                    to:sf(state.periodTo, state.periodTypeForServer),
                    kind:"sum"
                },
                specs:{type:"sales", channel:channel, members:membership}
            };
            
            if(state.periodType == "week" || state.periodType == "month" ) {
                var lastPeriod1 = {
                    periods:{
                        type:"date", 
                        from:sf(from1, "date"), 
                        to:sf(to1, "date"),
                        kind:"sum"
                    },
                    specs:{type:"sales", channel:channel, members:membership}
                }
            }
            
            if(state.periodType == "week") {
                var fromWeek = serverFormatWeek(from2);
                var toWeek = serverFormatWeek(to2);
                var lastPeriod2 = {
                    periods:{
                        type:"week", 
                        from:fromWeek, 
                        to:toWeek,
                        kind:"average"
                    },
                    specs:{type:"sales", channel:channel, members:membership}
                }
            } else if(state.periodType == "month") {
                var lastPeriod2 = {
                    periods:{
                        type:"date", 
                        from:sf(from2, state.periodTypeForServer), 
                        to:sf(to2, state.periodTypeForServer),
                        kind:"sum"
                    },
                    specs:{type:"sales", channel:channel, members:membership}
                }
            }
            
            if(state.periodType == "quarter") {
                var lastPeriod1 = {
                    periods:{
                        type:"week", 
                        from:sf(from1, state.periodTypeForServer), 
                        to:sf(to1, state.periodTypeForServer),
                        kind:"sum"
                    },
                    specs:{type:"sales", channel:channel, members:membership}
                }
                var lastPeriod2 = {
                    periods:{
                        type:"week", 
                        from:from2,     //hack already formatted 
                        to:to2,         //hack already formatted 
                        kind:"sum"
                    },
                    specs:{type:"sales", channel:channel, members:membership}
                }
            }
            
            // console.log(from1, to1, lastPeriod1);
            // console.log(from2, to2, lastPeriod2);

            if (membership===undefined) {
                delete query.specs.members;
                delete totals.specs.members;
                delete lastPeriod1.specs.members;
                delete lastPeriod2.specs.members;
            }
            queries[channel+"_bars"] = query;
            queries[channel+"_bars_totals"] = totals;
            queries[channel+"_bars_lastperiod_1"] = lastPeriod1;
            queries[channel+"_bars_lastperiod_2"] = lastPeriod2;
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
                from:sf(state.periodFrom, state.periodTypeForServer), 
                to:sf(state.periodTo, state.periodTypeForServer)
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
            var total_bars = result.total_bars;
            var partial_sum = result.partial_sum;
            var partial_sum_percap = result.partial_sum_percap;
            var barWidth = 100/total_bars.length;
            for (var i in total_bars) {
                var channels = [];
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
                
                var weather;
                if (this.state.periodType != "quarter" && wResult && wResult.length > i) {
                    weather = wResult[i];
                }
                
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
                        />);
            }
            
            var detailsRows = [];
            var totalSufix = "_bars_totals";
            var lastSufix = "_bars_"+this.state.comparePeriodType;
            
            var visitors = parseInt(result.visitors_total.units);
            var lastVisitors = parseInt(result["visitors_"+this.state.comparePeriodType].units);
            
            for(var k in channelActive) {
                if (channelActive[k] == "active" && !this.state.channelEmpty[k]) {
                    
                    var to = result[k+totalSufix].amount;
                    var from = result[k+lastSufix].amount;
                    
                    if(this.state.units == "percap") {
                        to /= visitors;
                        from /= lastVisitors;
                    }
                    
                    detailsRows.push(
                        <DetailsRow 
                            key={k} from={from} to={to} title={this.state.channelNames[k]}
                            className="parent-details multicolor-wrapper col-xs-12 col-sm-6"
                            details={
                                [
                                    {title:"General admision", from:11000, to:12323, details:[]},
                                    {title:"Groups", from:11000, to:10323, details:[]},
                                    {title:"Donation", from:9500, to:8100, details:[]},
                                    {title:"Other", from:10100, to:10323, details:[]}
                                ]
                            }
                        />
                    );
                } else {
                    detailsRows.push(<div key={k} ></div>);
                }
            };
            
        }
        
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
                            <div className="col-xs-12 col-sm-12">
                                <div className="col-xs-6 col-sm-6" id="header">
                                    {
                                        (this.state.comparePeriodType == "lastperiod_1") ?
                                            KUtils.date.detailsFormat(this.state.lastFrom1, this.state.lastTo1)
                                        :
                                            (this.state.periodType=="quarter") ?
                                                KUtils.date.detailsFormat(
                                                    KUtils.date.getDateFromWeek(this.state.lastFrom2), 
                                                    KUtils.date.getDateFromWeek(this.state.lastTo2)
                                                )
                                            :
                                                KUtils.date.detailsFormat(this.state.lastFrom2, this.state.lastTo2)
                                    }
                                    
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
                            <div className="col-xs-12 col-sm-12" id="table">
                                {detailsRows}
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
