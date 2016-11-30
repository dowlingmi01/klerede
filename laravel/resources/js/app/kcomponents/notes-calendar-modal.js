var React = require('react');
var $ = require('jquery');
var getDOMNode = require('../kutils/getDOMNode');

//icons
var Caret = require('../svg-icons').Caret;
var Circle = require('../svg-icons').Circle;
var CloseIcon = require('../svg-icons').CloseIcon;
var EditIcon = require('../svg-icons').EditIcon;
var NoteIcon = require('../svg-icons').NoteIcon;
var SlimMinusSign = require('../svg-icons').SlimMinusSign;

//lib components
var BigCalendar = require('../../libs/react-big-calendar');
var Select = require('react-select');
var moment = require('moment');
moment.updateLocale('en',{
    week:{
        dow:1
    }
});

require('dotdotdot');


//local components
var AddNoteTip = require('./add-note-tip');
var SVGButton = require('./svg-button');
var wnt = require('../kcomponents/wnt');
var du = require('../kutils/date-utils');
var KAPI = {
    notes:require('../kapi/notes'),
    auth:require('../kapi/auth')
};

BigCalendar.momentLocalizer(moment);


function NoteEvent({ event }) {
    // console.log(event.title, event);
    var className = "NoteEvent";
    var style = {};
    if (event.length > 1 || event.splitted) {
        className += " multiday revealed";
        
        style.width = (event.length*80 - 10)+"px";
        //
        // if(event.splitted) {
        //     console.log(event);
        // }
    } else {
        var count = Math.min(4, event.dateCount);
        var size = 5.5 * Math.pow(1.45454545454545, count);
        // size = Math.min(25, size);
        // console.log(event.dateCount, (1.25 ^ event.dateCount), size);
        style.width = size+"px";
        style.height = size+"px";
        style.marginLeft = (-size/2)+"px";
        style.marginTop = (-count)+"px"
        
        // if(event.firstOneDay && event.dateCount<=2) {
            className += " revealed";
        // }
        
    };
    return (
        <Circle style={style} className={className}/>
    )
}

function ShowMore(n) {
    // console.log(n);
    n = Math.min(4, n);
    var size = 5.5 * Math.pow(1.45454545454545, n+1);
    // size = Math.min(25, size);
    var style = {width:size+"px", height:size+"px", marginLeft:(-size/2)+"px", marginTop:(-n)+"px"};
    var className = "NoteEvent ShowMore";
    return (
        <Circle style={style} className={className}/>
    )
}


var DayBG = $('<div class="DayBG"></div>');
var WeekBG = $('<div class="DayBG WeekBG"></div>');

var NoteRow = React.createClass({
    getInitialState:function () {
        return {
            expanded:false,
            userID: KAPI.auth.getUser().id,
            permissions: KAPI.auth.getUserPermissions(),
            description:""
        } 
    },
    expandNote:function() {
        this.setState({
            expanded:!this.state.expanded
        });
    },
    onNoteDelete:function (e) {
        if (!confirm("Delete this note?")) {
            return;
        }
        var id = this.props.event.data.id;
        KAPI.notes.delete(id, wnt.venueID, this.onNoteDeleted);
    },
    onNoteDeleted:function (response) {
        alert("The note has been deleted.");
        this.props.onNoteDeleted();
    },
    addEllipses:function (description) {
        $(this.refs.noteDescription).text(description);
        $(this.refs.noteDescription).dotdotdot();
        this.setState({description:$(this.refs.noteDescription).text()});
    },
    componentDidMount(){
        // this.props.event;
        // console.log(this.props.event.data.description);
        this.addEllipses(this.props.event.data.description);
    },
    render:function () {
        
        var expanded = this.state.expanded;
        
        var event = this.props.event;
        var data = event.data;
        var start = moment(data.time_start);
        var end = moment(data.time_end);
        var lengthInDays = event.length;
        var splitted = (event.splitted);
        var author = this.props.authorList[data.owner_id];
        var hours = "All Day";
        
        if (!event.allDay) {
            var startFormat = ("h");
            if( start.format("a") != end.format("a") ) {
                startFormat = ("h a");
            }
            hours = start.format(startFormat) + " - " + end.format("h a");
        }
        
        var tags = [];
        for (var k in data.tags) {
            var tag = data.tags[k];
            tags.push(
                <div key={k} className={"tag"} id={tag.id}>#{tag.description}</div>
            );
        }
        
        var channels = [];
        for (var l in data.channels) {
            var channel = data.channels[l];
            channels.push(
                <div key={l} className={"channel "+channel.code} id={channel.id} title={channel.code}></div>
            );
        }
        
        if (this.state.permissions["users-manage"] || data.owner_id == this.state.userID) {
            var editable = true;
        }
        // console.log(lengthInDays);
        
        return (
            <div className={"note-row clearfix" + (expanded ? " expanded":"")}>
                <div className="col-xs-2 note-date">
                    <div className="date-container">
                    {start.format("MM.DD")}{(lengthInDays > 1 || splitted) ? "- "+end.format("MM.DD") :  ""}
                    </div>
                </div>
                <div className="col-xs-9">
                    <div className="col-xs-11 note-content">
                        <div className="note-header">{data.header}</div>
                        <div className="note-time">{hours}</div>
                        <div className="note-author">{author}</div>
                    </div>
                    <div className="col-xs-1 channels">{channels}</div>
                    <div >
                        <div className="col-xs-11 note-description" >
                            <p ref="noteDescription">{expanded ? data.description : this.state.description}</p>
                            <div className="tags">{tags}</div>
                    { false ?
                            <div className="related-events">
                                <div><span className="tag">Facility Sep 02, 2016</span> <strong>Fire in the hall</strong></div>
                                <div><span className="tag">Facility Sep 02, 2016</span> <strong>Fire in the hall</strong></div>
                            </div>
                        :
                        <div></div>
                    }
                        </div>
                        <div className="col-xs-1 edit-delete">
                            {(editable) ?
                            <span>
                                <EditIcon onClick={(e)=>this.props.onNoteEdit(data)} className="edit-icon"  /> 
                                <SVGButton 
                                    className={"circle delete vertical-middle"} 
                                    onClick={this.onNoteDelete} icon={<SlimMinusSign />} 
                                />
                            </span>
                            : 
                                <span></span>
                            }
                        </div>
                    </div>
                </div>
                <div className="col-xs-1 expand-note"><div onClick={this.expandNote} className="caret-container"><Caret className=""/></div></div>
                
            </div>
        );
    }
});

var NotesCalendarModal = React.createClass({
    getInitialState:function () {
        var defaultDate = new Date(this.props.defaultDate);
        var week = this.getWeek(defaultDate);
        var month = this.getMonth(defaultDate);
        var quarter = this.getQuarter(defaultDate);
        var today = new Date(du.localFormat(wnt.today));
                
        var state = {
			currentDate:moment(defaultDate),
            events:[],
            week:week,
            month:month,
            quarter:quarter,
            periodType:this.props.periodType,
            periodStart:null,
            calendarView:true,
            today:today,
            noteExpandedData:null
        };
        return(
            state
        ); 
    },
    getWeek:function (date) {
        var start = moment(date).startOf('week');
        var end = moment(date).endOf('week');
        return {start:start, end:end};
    },
    getQuarter:function (date) {
        var start = moment(date).startOf('quarter');
        var end = moment(date).endOf('quarter');
        return {start:start, end:end};
    },
    getMonth:function (date) {
        var start = moment(date).startOf('month');
        var end = moment(date).endOf('month');
        return {start:start, end:end};
    },
    getNotes(date, events, periodType) {
        
        date = date || this.state.currentDate;
        
        events = events || this.state.events;

        periodType = periodType || this.state.periodType;
        
        // console.log(date, events, periodType);
        var dateStart = moment(date).startOf(periodType);
        var dateEnd = moment(date).endOf(periodType);
        var notes = [];
        // console.log(events);
        for (var i=0; i<events.length; i++) {
            var evt = events[i];
            var evtStart = moment(evt.start);
            var evtEnd = moment(evt.end);
            // console.log(dateStart, evt.start, evt.end);
            if ( 
                (evtEnd.isBetween(dateStart, dateEnd) || evtEnd.isSame(dateEnd))                //el evento termina ese dia
                ||
                (evtStart.isBetween(dateStart, dateEnd) || evtStart.isSame(dateStart))          //el evento comienza ese dia
                ||
                dateStart.isBetween(evtStart, evtEnd)                                           //el evento abarca el comienzo del dia
                ||
                dateEnd.isBetween(evtStart,evtEnd)                                              //el evento abarca la finalizacion del dia
            ) {
                notes.push(<NoteRow onNoteEdit={this.props.onNoteEdit} onNoteDeleted={()=>this.updateNotes(this.state.currentDate, true)} expandNote={this.expandNote} key={i} event={evt} authorList={this.props.authorList} />)
            }
        }
        return notes;
    },
    updateNotes:function (date, forceUpdate) {
        if (this.props.periodType == "week")
            var period = "month";
        else 
            period = this.props.periodType;
        
        var periodStart = moment(date).startOf(period).format('YYYY-MM-DD');
        var periodEnd = moment(date).endOf(period).format('YYYY-MM-DD');
        // console.log(period, periodStart, periodEnd);
        
        if (!forceUpdate && periodStart == this.state.periodStart) return;
        
        this.setState({periodStart:periodStart});
        
        KAPI.notes.list(wnt.venueID, periodStart, periodEnd, this.onNotesUpdated);
    },
    onNotesUpdated:function (result) {
        // console.log(result);
        var events = [];
        
        var lastDate = "";
        var dateCount = 0;
        var firstFound = false;
        
        for (var i=0; i<result.length; i++) {
            var r = result[i];
            var start = moment(r.time_start);
            var end = moment(r.time_end);
            var currentDate = start.format('YYYY-MM-DD');
            var firstOneDay = false;
            
            if(lastDate!=currentDate) {
                lastDate=currentDate;
                dateCount=0;
                firstFound = false;
            } else {
                events[events.length-1].lastInDate = false;
                if(events[events.length-1].splitted) {
                    events[events.length-2].lastInDate = false;
                }
            }
            
            var eventLength = (moment(end).startOf("day").diff(moment(start).startOf("day"), 'days'))  + r.all_day;
            
            dateCount++;
            
            if (!firstFound && eventLength < 1) {
                firstFound = true;
                firstOneDay = true;
            }
            
            var splitted = false;
            
            if(eventLength > 1) {
                var internalEnd = moment(start).endOf("week");
                if (internalEnd.isBefore(end)) {
                    
                    splitted = true;

                    var internalStart = moment(end).startOf("week");

                    var eventLength1 = (moment(internalEnd).startOf("day").diff(moment(start).startOf("day"), 'days')) + r.all_day;
                    var eventLength2 = (moment(end).startOf("day").diff(moment(internalStart).startOf("day"), 'days')) + r.all_day;
                    
                    events.push({
                        'title': r.header,
                        'allDay': r.all_day ? true : false,
                        'start': start.toDate(),
                        'end': internalEnd.toDate(),
                        'splitted':splitted,
                        'part2':true,
                        'length': eventLength1,
                        'data': r,
                        dateCount:dateCount,
                        lastInDate:true,
                        firstOneDay:firstOneDay
                    })
                    
                    eventLength = eventLength2;
                    start = internalStart;
                }
            }
            
            if(r.all_day) end.endOf("day");
            
            events.push({
                'title': r.header,
                'allDay': r.all_day ? true : false,
                'start': start.toDate(),
                'end': end.toDate(),
                'splitted':splitted,
                'length': eventLength,
                'data': r,
                dateCount:dateCount,
                lastInDate:true,
                firstOneDay:firstOneDay
            })
        }
        
        var lastCount = 1;
        for (var i=events.length-1; i>=0; i--) {
            var e = events[i];
            if (e.lastInDate) {
                lastCount = e.dateCount;
            } else {
                e.dateCount = lastCount;
            }
        }
        console.log(events);
        
        this.setState({events:events, notes:this.getNotes(null, events)});
    },
    updateDate:function (date, periodType) {
        periodType = periodType || this.props.periodType;
        this.updateNotes(date);
        this.props.onSelectDate(date);
        this.setState({
            periodType:periodType,
            currentDate:moment(date), 
            week:this.getWeek(date), 
            month:this.getMonth(date), 
            quarter:this.getQuarter(date), 
            notes:this.getNotes(date, null, periodType)
        });
    },
    monthChange:function (e, n) {
        var newDate = new Date(du.addMonths(this.state.currentDate.toDate(), n));
        this.updateDate(newDate);
        this.updateNotes(newDate);
    },
    addNote:function(e) {
        e.preventDefault();
        this.props.onNoteEdit(null);
    },
    exitDayMode:function (e) {
        // console.log(e);
        e.preventDefault();
        this.setState({notes:this.getNotes(null, null, this.props.periodType), periodType:this.props.periodType});
        
    },
    onDateChange:function (e) {
        // console.log(e);
        // e.preventDefault();
        this.updateDate(e, "day");
    },
    onSelectNote:function (e) {
        // console.log(e);
        this.updateDate(e.start);
    },
    onSelectSlot:function (e) {
        // console.log(e);
        this.updateDate(e.start, this.props.periodType);
    },
    onSelecting:function (e) {
        console.log(e);
    },
    expandNote:function(note) {
        this.setState({noteExpandedData:note});
    },
    toggleCalendarView:function (e) {
        this.setState({calendarView:!this.state.calendarView})
    },
    show:function() {
        $(getDOMNode(this)).modal("show");
        this.setState({periodType:this.props.periodType});
        this.props.onSelectDate(this.state.currentDate);
        this.updateNotes(this.state.currentDate, true);
    },
    hide:function() {
        $(getDOMNode(this)).modal("hide");
    },
    componentWillReceiveProps:function (nextProps) {
        if(nextProps.defaultDate != this.props.defaultDate) {
            var currentDate = new Date(du.localFormat(nextProps.defaultDate));
            
            this.setState({currentDate:moment(currentDate)})
        }
        
        if (nextProps.show  == this.props.show) return;
        
        
        if(nextProps.show) {
            this.show();
        } else {
            this.hide();
        }
    },
    componentDidMount:function () {
        $(getDOMNode(this)).on('hide.bs.modal', this.props.onClose);
        if(this.props.show) {
            this.show();
        }
    },
	componentDidUpdate:function(){
        
        WeekBG.detach();
        DayBG.detach();
        
        if (this.state.periodType != "week" && this.state.periodType !="day") return;
        
        var bg = this.state.periodType == "week" ? WeekBG : DayBG;
        var current = $(getDOMNode(this.refs.BigCalendar)).find(".rbc-current");
        // console.log(this.refs.BigCalendar, current, DayBG);
        $(this.state.periodType == "week" ? current.parent() : current).append(bg);
	},
    render:function () {
        
        var currentDate = this.state.currentDate.format("MMMM, YYYY");
        var currentPeriod = this.state[this.props.periodType];
        
        return(
            <div className="modal fade" tabIndex="-1" role="dialog">
              <div className="modal-dialog" id="calendar-modal" role="document">
                <div className="modal-content" >
                  <div className="modal-header modal-section">
                    <div className="top-bar">
                        <button type="button" style={{display:"none"}} className="close" data-dismiss="modal" aria-label="Close"><CloseIcon className="close-icon"/></button>
                        <h3 className="modal-title inline-block">{currentDate}</h3>
                        <div id="month-switch" className="inline-block">
                            <div className="inline-block" onClick={(e) => this.monthChange(e, -1)}>
                                <Caret className="left-caret"/>
                            </div> 
                                Month 
                            <div className="inline-block" onClick={(e)=>this.monthChange(e, +1)}>
                                <Caret  className="right-caret" />
                            </div>
                        </div>
                        <div id="select-wrapper" className="inline-block">
                        {false ? 
                            <Select
                                ref="categorySelect"
                                name="category-select"
                                placeholder="Choose a category"
                                options={this.state.categoryList}
                                onChange={this.onCategorySelect}
                                clearable={false}
                                searchable={false}
                                openOnFocus={true}
                                arrowRenderer={function(){return(<Caret className="filter-caret" />)}}
                                optionRenderer={this.optionRenderer}
                                onClose={this.onCategorySelectClose}
                                onBlur={this.onCategorySelectBlur}
                                onOpen={this.onCategorySelectOpen}
                            />
                        :   <div></div>
                        }
                        </div>
                    </div>
                    <div className="clearfix"></div>
                    <div className={(this.state.calendarView? "calendar": "calendar folded")+" "+this.props.periodType }>
                        <BigCalendar
                            ref="BigCalendar"
                            components={{event:NoteEvent}}
                            messages={{showMore:ShowMore}}
                            popup={false}
                            selectable={true}
                            timeslots={2}
                            showAllEvents={false}
                            toolbar={false}
                            views={['month']}
                            date={this.state.currentDate.toDate()}
                            events={this.state.events}
                            now={this.state.today}
                            onNavigate={this.onDateChange}
                            onSelectEvent={this.onSelectNote}
                            onSelectSlot={this.onSelectSlot}
                            onSelecting={this.onSelecting}
                        />
                    </div>
                    <div className="clearfix"></div>
                    <div className="date-bar">
                        <a href="#" onClick={this.exitDayMode}><div className="week inline-block">
                            {currentPeriod.start.format("MMM DD")} - {currentPeriod.end.format("MMM DD")}, {this.state.week.start.format("YYYY")}
                        </div></a>
                            {this.state.periodType == "day" ?
                                <div className="date inline-block">&nbsp;&nbsp;|&nbsp;&nbsp;{this.state.currentDate.format("dddd MMM Do, YYYY")}</div>
                            :
                                <div className="date inline-block"></div>
                            }
                        <div className={"float-right" + (this.state.calendarView ? "":" active") } id="toggle-expand" onClick={this.toggleCalendarView}>
                            <Caret className=""/>
                        </div>
                        <div className="float-right" id="add-note" onClick={this.addNote} onMouseEnter={this.showNoteTipIcon} onMouseLeave={this.hideNoteTipIcon}>
                            <NoteIcon className="note-icon" /> 
                            <AddNoteTip  onAddNote={this.addNote} ref="addNoteTipIcon" left="5px" fadein={this.state.noteTipIcon}/>
                        </div>
                    </div>
                  </div>
                  <div className={"modal-body modal-section" + (this.state.calendarView? "": " expanded")}>
                        <div className="note-rows-container">
                            {this.state.notes}
                        </div>
                  </div>
                </div>
              </div>
            </div>
        );
    }
});

module.exports = NotesCalendarModal;