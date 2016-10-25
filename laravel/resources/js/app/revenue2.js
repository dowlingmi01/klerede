
var React = require('react');
var ReactDOM = require('react-dom');

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
var NoteIcon = require('./svg-icons').NoteIcon;
var CloseIcon = require('./svg-icons').CloseIcon;
var CalendarIcon = require('./svg-icons').CalendarIcon;
var CheckMark = require('./svg-icons').CheckMark;

var analytics = require("./analytics.js");

var ActionMenu = require('./reusable-parts').ActionMenu;
var printDiv = require ('./kutils/print-div.js');
var saveImage = require ('./kutils/save-image.js');

require('bootstrap');

require('timepicker');

var JQTimePicker = React.createClass({
    componentDidMount:function () {
        $(this.refs.self).timepicker(
            {"timeFormat":this.props.timeFormat || "g:ia"}
        );
         $(this.refs.self).on("changeTime", this.props.onChange)
    },
    render:function () {
        return (
            <input type="text" id={this.props.id} ref="self" className={this.props.className} defaultValue={this.props.defaultValue} />
        )
    }
});

var DatePicker = require('react-datepicker');
var moment = require('moment');
moment.updateLocale('en',{
    week:{
        dow:1
    }
});
var getDOMNode = require('./kutils/getDOMNode.js');


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
        
        if(this.props.placeholder) {
            options.push(<option disabled key={'placeholder'} value="placeholder">{this.props.placeholder}</option>)
        }
        
        
        for (var v in optionList) {
            var option = <option key={v} value={v}>{optionList[v]}</option>;
            options.push(option);
        }
        
        return (
            <div className={this.props.className}>
                <Caret className="filter-caret" />
                <select className="form-control" value={this.props.selected} onChange={this.props.onChange} >
                    {options}
                </select>
            </div>
        );
    }
});

var Channel = React.createClass({
    render:function () {
        return(
            <div className={"channel multicolor-wrapper "+this.props.empty}>
                <div className={"circle-checkbox multicolorbg "+this.props.active} onClick={this.props.onClick}>
                    <CheckMark className="legend-check" />
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
        
        
        var weatherDiv =<WeatherPopup id={"weather-popup-"+this.props.id} ref="popup" bottom={height+37} units={this.props.units} channels={channels} date={this.props.date} periodType={this.props.periodType} data={this.props.weather} attendance={this.props.attendance} />;
        
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
        var key = this.props.units;
        var sign = "$";
        if (this.props.units == "dollars") {
            key = "amount";
        }
        if (this.props.units == "attendance-tab") {
            key = "amount";
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
            popupChannels.push(<ChannelPopup key={i} name={channels[i].name}  data={channels[i].data} units={this.props.units} />);
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
        var formatNumber = this.props.formatNumber;

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
                        formatNumber={this.props.formatNumber}
                        sign={this.props.sign}
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

var SlimPlusSign = require('./svg-icons').SlimPlusSign;
var SlimMinusSign = require('./svg-icons').SlimMinusSign;

var SVGButton = React.createClass({
    render:function () {
        return (
            <div onClick={this.props.onClick || null} id={this.props.id || ""} className={"svg-button " + (this.props.className || "")}>
                <div className="svg-button-content">{this.props.icon}</div>
            </div>
        );
    }
});

var Category = React.createClass({
    render:function () {
        return(
            <div className="category-item">
                <SVGButton className="circle" onClick={this.props.onRemove} id="remove-category-item" icon={<CloseIcon className="" />} />
                {"#"+this.props.name}
            </div>
        );
    }
})

var TextArea = React.createClass({
    onChange:function (e) {
        var self = $(this.refs.self);
        self.height(Math.max(self.prop('scrollHeight'), this.props.minHeight));
    },
    render:function () {
        return(
            <textarea ref="self" id={this.props.id} className={this.props.className} placeholder={this.props.placeholder} defaultValue={this.props.defaultValue} onChange={this.onChange} />
        );
    }
});

var AddNoteModal = React.createClass({
    getInitialState:function () {
        return(
            {
                channelNames:{gate:"Box Office", cafe: "Cafe", store: "Gift Store", membership: "Membership"},
                channelActive:{gate:"active", cafe: "active", store: "active", membership: "active"},
                categoryNames:{1:"Facility", 2:"Weather", 3:"Holiday", 4:"Local Event"},
                selectedCategories:[],
                notify:"none",
                allDay:true,
				dateStart:moment(),
                dateEnd:moment(),
                timeStart:"9:00am",
                timeEnd:"10:00am",
                addCategoryActive:false,
                newCategory:""
            }
        ); 
    },
    componentDidMount:function () {
        $(getDOMNode(this)).modal("show");
        $(getDOMNode(this)).on('hidden.bs.modal', this.props.onClose);
    },
    onChange:function (e) {
        console.log(e);
    },
    onDateStartChange(d) {
        this.setState({dateStart:d})
    },
    onDateEndChange(d) {
        this.setState({dateEnd:d})
    },
    onTimeStartChange(d) {
        this.setState({timeStart:$(d.target).val()});
    },
    onTimeEndChange(d) {
        this.setState({timeEnd:$(d.target).val()});
    },
    onChannelClick:function (k) {
        var channelActive = this.state.channelActive;
        if (channelActive[k] ==="active") {
            channelActive[k] = "";
        } else {
            channelActive[k] = "active";
        }
        this.setState({channelActive:channelActive});
    },
    onCategorySelect(e) {
        var selectedCategories = this.state.selectedCategories;
        var value = e.target.value;

        if(selectedCategories.indexOf(value) >= 0) 
            return;
        
        selectedCategories.push(value);
        this.setState({selectedCategories:selectedCategories});
    },
    onCategoryDeselect(c) {
        var selectedCategories = this.state.selectedCategories;
        var index = selectedCategories.indexOf(c);
        
        if (index <0) 
            return;
        
        selectedCategories.splice(index, 1);
        
        this.setState({selectedCategories:selectedCategories});
    },
    onAddCategoryChange(e){
        this.setState({newCategory:e.target.value});
    },
    onAddCategoryClick(e){
        if(!this.state.addCategoryActive) {
            this.setState({addCategoryActive:true});
            this.refs.addCategory.focus();
        } else if (this.state.newCategory.length) {
            var categoryNames = this.state.categoryNames;
            var newCategory = this.state.newCategory;
            
            if (!categoryNames[newCategory]) {
                categoryNames[newCategory] = newCategory;
                this.setState({categoryNames:categoryNames, newCategory:"", addCategoryActive:false});
            } else {
                alert("This category already exits: "+newCategory);
            }
        }
    },
    onAddCategoryBlur(e){
        if (!this.state.newCategory.length) {
            this.setState({addCategoryActive:false});
        }
    },
    onNotifyClick:function (notify) {
        this.setState({notify:notify});
    },
    onAllDayClick:function (e) {
        this.setState({allDay:!this.state.allDay})
    },
    render:function () {
        var channels = [];
        for (var k in this.state.channelNames) {
            var channel = this.state.channelNames[k];
            var active = this.state.channelActive[k];
            channels.push(
                <Channel empty={""} key={k} name={channel} active={active} onClick={this.onChannelClick.bind(this, k)} />
            );
        }
        
        var selectedCategories = this.state.selectedCategories;
        var categoryNames = this.state.categoryNames;
        var categories = [];
        
        for (var i=0; i<selectedCategories.length; i++) {
            var c = selectedCategories[i];
            if (categoryNames[c]) {
                categories.push(<Category key={c} onRemove={this.onCategoryDeselect.bind(this, c)} value={c} name={categoryNames[c]} />)
            };
        }

        
        
        return(
            <div className="modal fade" tabIndex="-1" role="dialog">
              <div className="modal-dialog" role="document">
                <div className="modal-content">
                  <div className="modal-header modal-section">
                    <button type="button" className="close" data-dismiss="modal" aria-label="Close"><CloseIcon className="close-icon"/></button>
                    <h3 className="modal-title">September 5, 2016</h3>
                    <div id="calendar-button-container">
                        <div id="calendar-button"> <CalendarIcon /> <span id="text">Calendar</span></div>
                    </div>
                  </div>
                  <div className="modal-body modal-section">
                    <form ref="addNoteForm" className="" onFocus={null}>
                        <div className="form-group">
                            <input type="text" id="header" className="form-control" placeholder="Add Note Header" defaultValue={null} onChange={this.onChange} />
                        </div>
                        <div className="form-group">
                            <TextArea minHeight={34} id="description" className="form-control" placeholder="Description" defaultValue={null} onChange={this.onChange} />
                        </div>
                        <div className="form-group" id="date-time">
                            <span>
                                All day: <SVGButton className={"rounded-box " + (this.state.allDay ? "":"inactive")} onClick={this.onAllDayClick} id="all-day" icon={<CheckMark className="" />} />
                            </span>
                            <label className="checkbox-inline">
                                Starts: <DatePicker dateFormat="MMM DD, YYYY" selected={this.state.dateStart} onChange={this.onDateStartChange} popoverAttachment='bottom center'
    popoverTargetAttachment='top center' />
                            </label>
                            <label className="checkbox-inline">
                            { this.state.allDay ? 
                                <span className="timepicker"></span> 
                            :
                                <JQTimePicker className="timepicker" id="start-hour" defaultValue={this.state.timeStart} onChange={this.onTimeStartChange} />
                            }
                            </label>
                            <label className="checkbox-inline">
                              Ends: <DatePicker dateFormat="MMM DD, YYYY" selected={this.state.dateEnd} onChange={this.onDateEndChange} popoverAttachment='bottom center'
    popoverTargetAttachment='top center' />
                            </label>
                            <label className="checkbox-inline">
                            { this.state.allDay ? 
                                <span className="timepicker"></span> 
                             :
                                <JQTimePicker className="timepicker" id="end-hour" defaultValue={this.state.timeEnd} onChange={this.onTimeEndChange} />
                            }
                            </label>
                        </div>
                        <div className="form-group">
                            <h6>Check all that apply:</h6>
                            <div>{channels}</div>
                        </div>
                        <div className="form-group" id="categories">
                            <div className="inline-block">
                                <Dropdown
                                    className="inline-block revenue-dropdown vertical-middle"
                                    ref="category-select"
                                    optionList={this.state.categoryNames}
                                    selected={"placeholder"}
                                    placeholder="Chose a category"
                                    onChange={this.onCategorySelect}
                                />
                                <SVGButton className="circle category-svg-button vertical-middle" icon={<SlimMinusSign />} />
                            </div>
                            <div className="inline-block float-right">
                                <SVGButton className={"circle category-svg-button vertical-middle"+(this.state.newCategory.length ? " active" : "")} onClick={this.onAddCategoryClick} icon={<SlimPlusSign />} />
                                &nbsp;
                                <input 
                                    type="text" 
                                    ref="addCategory" 
                                    id="add-category" 
                                    className={"form-control vertical-middle" + (this.state.addCategoryActive ? " active" : "")} 
                                    placeholder={this.state.addCategoryActive ? "Add Category" : ""} 
                                    value={this.state.newCategory} 
                                    onChange={this.onAddCategoryChange} 
                                    onBlur={this.onAddCategoryBlur}
                                />
                                
                            </div>
                            <div id="category-list">{categories}</div>
                        </div>
                        <div className="form-group" id="notify">
                            Notify Users:
                            &nbsp;
                            <span>
                                <SVGButton 
                                    onClick={this.onNotifyClick.bind(this, "email")} 
                                    className={"circle "+ (this.state.notify!="email" ? "inactive" : "")} 
                                    id="email-notify" 
                                    icon={<CheckMark className="" />} 
                                />
                                &nbsp;Via Email
                            </span>
                            &nbsp;
                            &nbsp;
                            <span>
                                <SVGButton 
                                    onClick={this.onNotifyClick.bind(this, "none")} 
                                    className={"circle "+ (this.state.notify!="none" ? "inactive" : "")} 
                                    id="none-notify" 
                                    icon={<CheckMark className="" />} 
                                />
                                &nbsp;None
                            </span>
                        </div>
                    </form>
                    
                  </div>
                  <div className="modal-footer modal-section">
                    <div className="buttons">
                        <button type="button" className="btn btn-default" data-dismiss="modal">Cancel</button>
                        <button type="button" className="btn btn-primary">Save Note</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
        );
    }
});

var NoteCircle = React.createClass({
    // onMouseEnter:function (e) {
    //     console.log("note-circle-container", e.target, e.currentTarget, e.relatedTarget, e.eventPhase);
    //     e.stopPropagation();
    // },
    render:function () {
        return(
            <div className="note-circle-container" onClick={this.props.onClick} >
                <div className="note-circle four"></div>
            </div>
        );
    }
});
var AddNoteTip = React.createClass({
    componentDidMount:function () {
        // $(this.getDOMNode()).modal("show");
        
    },
    render:function () {
        return (
            <div className="add-note-menu">
                <div className={"menu-content fade "+this.props.fadein} style={{left:this.props.left}} role="tooltip" ><div className="arrow"></div><div className="action" ><a href="#add-note" onClick={this.props.onAddNote}>Add Note</a></div></div>
            </div> 
        );
    }
});

var NoteBar = React.createClass({
    render:function () {
        return(
            <div className={"notebar "+this.props.className} onClick={this.props.onClick} >
                <NoteCircle onClick={this.props.onNoteClick}/> 
            </div>
        )
    } 
});
var NoteColumn = React.createClass({
    render:function() {
        return(
            <div className="note-column" >
                <div className="note-header">Short Week</div>
                <div className="note-time">12pm-2pm</div>
                <div className="note-author">Tom.Wolfe</div>
                <div className="note-description">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut lab... </div>
            </div>
        );
    }
});
var Notes = React.createClass({
    getInitialState:function() {
        return {
            noteTipIcon:"", 
            noteTip:"", 
            noteTipLeft:0,
            noteDetailsClass:"",
            activeNote:null,
            showAddNoteModal:true
        }
    },
    closeAddNoteModal(e) {
        this.setState({showAddNoteModal:false});
    },
    addNote:function(e) {
        // console.log(e);
        e.preventDefault();
        this.setState({showAddNoteModal:true});
    },
    showNoteTip:function (e) {
        if (this.state.noteTip == "in") 
            return;
        
        if ($(e.target).hasClass("note-circle-container"))
            return;
        
        e.stopPropagation();

        var addNoteTip = $(getDOMNode(this.refs.addNoteTip));
        this.setState({noteTip:"in", noteTipLeft:e.pageX - addNoteTip.offset().left});
    },
    hideNoteTip:function (e) {
        
        if (this.state.noteTip == "out") 
            return;
        
        e.stopPropagation();

        this.setState({noteTip:"out"});
    },
    showNoteTipIcon:function (e) {
        this.setState({noteTipIcon:"in"});
    },
    hideNoteTipIcon:function (e) {
        this.setState({noteTipIcon:"out"});
    },
    showNotes:function (n, event) {
        event.stopPropagation();
        this.setState({activeNote:n, noteDetailsClass:"active"});
    },
    hideNotes:function (e) {
        this.setState({activeNote:null, noteDetailsClass:""});
    },
    render:function () {
        return (
            <div className="notes">
                <div id="calendar-button-container">
                    <div id="calendar-button"> <img src="/img/icon_calendar.svg" /> </div>
                </div>
                <div id="notebars" onMouseEnter={this.showNoteTip} onMouseLeave={this.hideNoteTip}>
                    <div id="add-note-tip-container">
                        <AddNoteTip onAddNote={this.addNote} ref="addNoteTip" left={this.state.noteTipLeft+"px"} fadein={this.state.noteTip}/>
                    </div>
                    <NoteBar onClick={this.addNote} className={this.state.activeNote===0 ? "active":""} onNoteClick={(event)=>this.showNotes(0, event) } />
                    <NoteBar onClick={this.addNote} className={this.state.activeNote===1 ? "active":""} onNoteClick={(event)=>this.showNotes(1, event)} />
                    <NoteBar onClick={this.addNote} className={this.state.activeNote===2 ? "active":""} onNoteClick={(event)=>this.showNotes(2, event)} />
                    <NoteBar onClick={this.addNote} className={this.state.activeNote===3 ? "active":""} onNoteClick={(event)=>this.showNotes(3, event)} />
                    <NoteBar onClick={this.addNote} className={this.state.activeNote===4 ? "active":""} onNoteClick={(event)=>this.showNotes(4, event)} />
                    <NoteBar onClick={this.addNote} className={this.state.activeNote===5 ? "active":""} onNoteClick={(event)=>this.showNotes(5, event)} />
                    <NoteBar onClick={this.addNote} className={this.state.activeNote===6 ? "active":""} onNoteClick={(event)=>this.showNotes(6, event)} />
                </div>
                <div id="note-details" className={this.state.noteDetailsClass}>
                     <div id="close-icon-container" onClick={this.hideNotes}><CloseIcon className="close-icon"/></div>
                    <div id="contents">
                        <div id="note-details-header">
                            <div id="add-note" onClick={this.addNote} onMouseEnter={this.showNoteTipIcon} onMouseLeave={this.hideNoteTipIcon}>
                                <NoteIcon className="note-icon" /> 
                                <AddNoteTip  onAddNote={this.addNote} ref="addNoteTipIcon" left="5px" fadein={this.state.noteTipIcon}/>
                            </div>
                            Friday, May 5, 2016
                        </div>
                        <div className="row" id="note-columns">
                            <div className="col-xs-3">
                                <NoteColumn />
                            </div>
                            <div className="col-xs-3">
                                <NoteColumn />
                            </div>
                            <div className="col-xs-3">
                                <NoteColumn />
                            </div>
                            <div className="col-xs-3">
                                <NoteColumn />
                            </div>
                        </div>
                    </div>
                </div>
                
                {this.state.showAddNoteModal ? <AddNoteModal onClose={this.closeAddNoteModal}/> : <div></div>}
                
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
        
        var regularUnitsData = {
            channelNames:{gate:"Box Office", cafe: "Cafe", store: "Gift Store", membership: "Membership"},
            channelActive:{gate:"active", cafe: "active", store: "active", membership: "active"},
            childCategories:{ga:"General admission", group:"Groups", donation:"Donation", other:"Other"},
            childCategoriesQdetails:{prefix:"gate_bars_by_", channel:"gate", type:'sales'},
            attendanceDetailTitle:"Attendance"
        }

        var attendanceData = {
            channelNames:{visitors_non_members:"Box Office", visitors_members:"Membership"},
            channelActive:{visitors_non_members:"active", visitors_members:"active"},
            childCategories:{ga:"General admission", group:"Groups"},
            childCategoriesQdetails:{prefix:"visitors_non_members_bars_by_", channel:"ALL", type:'visits'},
            attendanceDetailTitle:"Revenue"
        }
        
        return {
            actions:actions,
            channelEmpty:{
                gate:true, cafe: true, store: true, membership: true
                ,visitors_non_members:true, visitors_members:true
            },
            dollars:regularUnitsData,
            percap:regularUnitsData,
            'attendance-tab':attendanceData,
            periodType:"week",
            members:"totals",
            units:"dollars",
            comparePeriodType:"lastperiod_1",
            date:date,
            periodFrom:date.thisWeekStart,      //mm/dd/yyyy
            periodTo:date.thisWeekLimit,          //mm/dd/yyyy
            dirty:-1,
            dirtyWeather:-1,
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
        if (this.state.periodFrom === event.target.value) {
            return;
        }
        var date = this.buildDateDetails(event.target.value);
        var formatedDate = wnt.formatDate(new Date(event.target.value));
        analytics.addEvent('Earned Revenue', 'Date Changed', formatedDate);
        this.setState({date:date, dirty:1, dirtyWeather:1});
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
        
        var newState = {};
        newState.units = units;
        
        if (units == 'attendance-tab') {
            newState.members = "totals";
            newState.dirty = 1;
        } else if( this.state.units == 'attendance-tab' ) {
            newState.dirty = 1;
        }
        
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
                        asum += parseFloat(r[sub].amount);
                    }
                    w13av.push({periodFrom:from, periodTo:r[sub].period , units:usum/13, amount:asum/13});
                }
                result[query] = w13av;
            }
        }
        return state;
    },
    copyUnitsToEmptyAmount:function (state) {
        var result = state.result;
        for (var i in result) {
            var r = result[i];
            if (r.units && !r.amount) {
                r.amount = r.units;
                continue;
            }
            try {
                for (var j in r) {
                    var d = r[j];
                    if(d.units && !d.amount)
                        d.amount = d.units;
                }
            } catch (e) {
                // console.error(i, e.message, r);
            }
        }

        return state;
    },
    updateSums:function (state) {
        var result = state.result;
        
        var channelActive = state[state.units].channelActive;
        var total_bars = result.total_bars;
        var visitors = result.visitors;
        var partial_sum = [];
        var partial_sum_percap = [];
        var max = 0;
        var maxPercap = 0;

        var unitSufix = this.state.units == 'attendance-tab'?'units':'amount';

        for (var i in total_bars) {
            
            //Save sum, only active channels
            //And calculate percaps
            var barSum = 0;
            var percapSum = 0;
            
            for (var k in channelActive) {
                if(channelActive[k] == "active") {
                    if(result[k+"_bars"].length > i) {
                        
                        barSum += parseInt( result[k+"_bars"][i][unitSufix] );

                        if (visitors[i]) {
                            var v = parseInt(visitors[i].units);
                            result[k+"_bars"][i].percap = result[k+"_bars"][i][unitSufix]/v;
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
        
        queries.visitors_revenue = getQuery(from, to, membership, 'gate', {type:'sales', kinds:['ga','group']}, 'detail', barInterval);
        
        queries.visitors_revenue_totals = getQuery(from, to, membership, 'ALL', {type:'sales', kinds:['ga','group']}, 'sum', 'date');
        
        

        //GENERAL QUERIES -> PAST PERIODS

        queries.visitors_lastperiod_1 = getQuery(lastBarFrom1, lastBarTo1, membership, 'ALL', 'visits', 'detail', lastBarInterval1);
        
        queries.visitors_lastperiod_1_totals = getQuery(lastFrom1, lastTo1, membership, 'ALL', 'visits', 'sum', 'date');

        queries.visitors_lastperiod_2 = getQuery(lastBarFrom2, lastBarTo2, membership, 'ALL', 'visits', 'detail', lastBarInterval2);

        queries.visitors_lastperiod_2_totals = getQuery(lastFrom2, lastTo2, membership, 'ALL', 'visits', 'sum', 'date');
        
        if (lastBarFrom3) 
            queries.visitors_lastperiod_3 = getQuery(lastBarFrom3, lastBarTo3, membership, 'ALL', 'visits', 'detail', lastBarInterval3);


        // TODO: Consider making separate query packs for attendance tab
        // ATENDANCE TAB NON MEMBERS CATEGORIES
        // queries.visitors_non_members_bars_by_ga = getQuery(from, to, 'ga', 'ALL', 'visits', 'detail', barInterval);
        // queries.visitors_non_members_bars_by_group = getQuery(from, to, 'group', 'ALL', 'visits', 'detail', barInterval);
        //
        // queries.visitors_non_members_bars_by_ga_totals = getQuery(from, to, 'ga', 'ALL', 'visits', 'sum', 'date');
        // queries.visitors_non_members_bars_by_group_totals = getQuery(from, to, 'group', 'ALL', 'visits', 'sum', 'date');
        //
        // //ATENDANCE TAB -> PAST PERIODS
        //
        // queries.visitors_non_members_bars_by_ga_lastperiod_1 = getQuery(lastBarFrom1, lastBarTo1, 'ga', 'ALL', 'visits', 'detail', lastBarInterval1);
        // queries.visitors_non_members_bars_by_group_lastperiod_1 = getQuery(lastBarFrom1, lastBarTo1, 'group', 'ALL', 'visits', 'detail', lastBarInterval1);
        //
        // queries.visitors_non_members_bars_by_ga_lastperiod_1_totals = getQuery(lastFrom1, lastTo1, 'ga', 'ALL', 'visits', 'sum', 'date');
        // queries.visitors_non_members_bars_by_group_lastperiod_1_totals = getQuery(lastFrom1, lastTo1, 'group', 'ALL', 'visits', 'sum', 'date');
        //
        // queries.visitors_non_members_bars_by_ga_lastperiod_2 = getQuery(lastBarFrom2, lastBarTo2, 'ga', 'ALL', 'visits', 'detail', lastBarInterval2);
        // queries.visitors_non_members_bars_by_group_lastperiod_2 = getQuery(lastBarFrom2, lastBarTo2, 'group', 'ALL', 'visits', 'detail', lastBarInterval2);
        //
        // queries.visitors_non_members_bars_by_ga_lastperiod_2_totals = getQuery(lastFrom2, lastTo2, 'ga', 'ALL', 'visits', 'sum', 'date');
        // queries.visitors_non_members_bars_by_group_lastperiod_2_totals = getQuery(lastFrom2, lastTo2, 'group', 'ALL', 'visits', 'sum', 'date');
        //
        // if (lastBarFrom3) {
        //     queries.visitors_non_members_bars_by_ga_lastperiod_3 = getQuery(lastBarFrom3, lastBarTo3, 'ga', 'ALL', 'visits', 'detail', lastBarInterval3);
        //     queries.visitors_non_members_bars_by_group_lastperiod_3 = getQuery(lastBarFrom3, lastBarTo3, 'group', 'ALL', 'visits', 'detail', lastBarInterval3);
        // }


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
            
            //Last period III (only for bars nowadays)
            queries[prefix+kind+"_lastperiod_3"] = getQuery(
                    lastBarFrom3, lastBarTo3, membership, channel, {type:type, kinds:[kind]}, lastBarOperation3, lastBarInterval3
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
        this.copyUnitsToEmptyAmount(state);
        this.updateSums(state);
        this.updateQuarter13WeekAverage(state);
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
        var unitsData = this.state[this.state.units];
        var channelTypes = unitsData.channelNames;
        var channelActive = unitsData.channelActive;
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
                    
                    //Collect Attendance or Visitors Revenue Data
                    try {
                        var attendance = 0;
                        var formatAmount = KUtils.number.formatAmount;
                        if (!barIsEmpty) {
                            attendance = isNotAttendanceTab ? 
                                "Attendance: "+formatAmount(visitors[i].units, 0) 
                                    : 
                                "Revenue: $"+formatAmount(result.visitors_revenue[i].amount) ;
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
                    var revenue = parseInt(result.visitors_revenue_totals.units);
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

                    var revenue = parseInt(result.visitors_revenue[dataIndex].amount);
                
                    ttTotals = "";
                };
            } catch(e) {
                console.log("Collect General Data for Details Error -> "+e, this.state);
            }
            
            var attendanceDetailData = isNotAttendanceTab ?
                                                    KUtils.number.formatInteger(visitors)
                                                :
                                                    <span><small>$</small> {KUtils.number.formatAmount(revenue)}</span>
            ;
            
            
            
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
                            var childCategories = this.state[this.state.units].childCategories;

                            for (var tt in childCategories) {
                        
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
                                        
                                        var title = childCategories[tt];
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
                                    key={k} from={from} to={to} title={unitsData.channelNames[k]}
                                    className="parent-details multicolor-wrapper col-xs-12"
                                    formatNumber = {detailsFormatNumber}
                                    details={subDetails}
                                    sign={sign}
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
                                    <DatePickerJQuery defaultDate={this.state.periodFrom} onSelect={this.onDateSelect} id="datepicker-2"/>
                                </div>
                                <div className="col-xs-4 col-lg-6 text-right" id="members">
                                    {membersDropDown}
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
                                        <TabSelector 
                                            selected = {this.state.units}
                                            id="attendance-tab"
                                            onClick={this.onUnitsChange.bind(this,"attendance-tab")}
                                            name="Attendance"
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
                            { features.notes ?
                                <div className="row notes-container">
                                    <Notes/>
                                </div>
                            :
                                <div></div>
                            }
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
        ReactDOM.render(
            <Revenue2 />,
            document.getElementById('revenue-row-widget2')
        );
        console.log('0!) Revenue 2 row loaded...');
    });
}
