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

var eventsTest = [{
    "id": 44,
    "header": "Test Note",
    "description": "Note by MD",
    "all_day": 0,
    "time_start": "2016-11-02 09:00:00",
    "time_end": "2016-11-02 12:00:00",
    "owner_id": 1,
    "last_editor_id": 1,
    "venue_id": 1518,
    "created_at": "2016-11-10 15:16:22",
    "updated_at": "2016-11-10 15:16:22",
    "channels": [{
        "id": 1,
        "code": "gate"
    }
    ],
    "tags": [{
        "id": 5,
        "description": "Private event",
        "venue_id": 0,
        "owner_id": 0,
        "pivot": {
            "note_id": 44,
            "tag_id": 5
        }
    }
    ]
}, {
    "id": 35,
    "header": "Pay What You Want Day",
    "description": "Visitors to the aquarium will be able to determine their own pricing",
    "all_day": 1,
    "time_start": "2016-11-06 00:00:00",
    "time_end": "2016-11-06 00:00:00",
    "owner_id": 6,
    "last_editor_id": 6,
    "venue_id": 1518,
    "created_at": "2016-11-08 20:12:31",
    "updated_at": "2016-11-08 20:12:31",
    "channels": [{
        "id": 3,
        "code": "cafe"
    }, {
        "id": 1,
        "code": "gate"
    }, {
        "id": 2,
        "code": "membership"
    }, {
        "id": 4,
        "code": "store"
    }
    ],
    "tags": [{
        "id": 5,
        "description": "Private event",
        "venue_id": 0,
        "owner_id": 0,
        "pivot": {
            "note_id": 35,
            "tag_id": 5
        }
    }, {
        "id": 7,
        "description": "Campaign",
        "venue_id": 0,
        "owner_id": 0,
        "pivot": {
            "note_id": 35,
            "tag_id": 7
        }
    }
    ]
}, {
    "id": 34,
    "header": "Election Day",
    "description": "Historic election",
    "all_day": 1,
    "time_start": "2016-11-08 00:00:00",
    "time_end": "2016-11-08 00:00:00",
    "owner_id": 6,
    "last_editor_id": 6,
    "venue_id": 1518,
    "created_at": "2016-11-08 20:10:00",
    "updated_at": "2016-11-08 20:10:00",
    "channels": [{
        "id": 3,
        "code": "cafe"
    }, {
        "id": 1,
        "code": "gate"
    }, {
        "id": 2,
        "code": "membership"
    }, {
        "id": 4,
        "code": "store"
    }
    ],
    "tags": [{
        "id": 1,
        "description": "Facility",
        "venue_id": 0,
        "owner_id": 0,
        "pivot": {
            "note_id": 34,
            "tag_id": 1
        }
    }
    ]
}, {
    "id": 36,
    "header": "Test Note",
    "description": "description of what's going on",
    "all_day": 1,
    "time_start": "2016-11-09 00:00:00",
    "time_end": "2016-11-09 00:00:00",
    "owner_id": 6,
    "last_editor_id": 6,
    "venue_id": 1518,
    "created_at": "2016-11-08 21:15:49",
    "updated_at": "2016-11-08 21:15:49",
    "channels": [{
        "id": 3,
        "code": "cafe"
    }, {
        "id": 1,
        "code": "gate"
    }, {
        "id": 2,
        "code": "membership"
    }, {
        "id": 4,
        "code": "store"
    }
    ],
    "tags": [{
        "id": 5,
        "description": "Private event",
        "venue_id": 0,
        "owner_id": 0,
        "pivot": {
            "note_id": 36,
            "tag_id": 5
        }
    }
    ]
}, {
    "id": 43,
    "header": "Note in the future",
    "description": "Omit any punctuation on either side of the ellipsis, unless the punctuation is necessary to make the shortened",
    "all_day": 0,
    "time_start": "2016-11-17 08:30:00",
    "time_end": "2016-11-17 11:30:00",
    "owner_id": 1,
    "last_editor_id": 1,
    "venue_id": 1518,
    "created_at": "2016-11-08 23:31:51",
    "updated_at": "2016-11-08 23:31:51",
    "channels": [{
        "id": 3,
        "code": "cafe"
    }, {
        "id": 1,
        "code": "gate"
    }, {
        "id": 2,
        "code": "membership"
    }, {
        "id": 4,
        "code": "store"
    }
    ],
    "tags": [{
        "id": 4,
        "description": "Special exhibit",
        "venue_id": 0,
        "owner_id": 0,
        "pivot": {
            "note_id": 43,
            "tag_id": 4
        }
    }
    ]
}
]

;

function NoteEvent({ event }) {
    var className = "NoteEvent";
    var style = {};
    if (event.length >= 1) {
        className += " multiday";
    } else {
        var size = 5.5 * Math.pow(1.45454545454545, event.dateCount);
        size = Math.min(36, size);
        // console.log(event.dateCount, (1.25 ^ event.dateCount), size);
        style.width = size+"px";
        style.height = size+"px";
        
        if(event.firstOneDay) {
            className += " revealed";
        }
        
    };
    return (
        <Circle style={style} className={className}/>
    )
}

function ShowMore(n) {
    var size = 5.5 * Math.pow(1.45454545454545, n+1);
    size = Math.min(36, size);
    var style = {width:size+"px", height:size+"px"};
    var className = "NoteEvent ShowMore";
    return (
        <Circle style={style} className={className}/>
    )
}


var DayBG = $('<div class="DayBG"></div>');

var NoteRow = React.createClass({
    getInitialState:function () {
        return {
            expanded:false,
            userID: KAPI.auth.getUser().id,
            permissions: KAPI.auth.getUserPermissions()
        } 
    },
    expandNote:function() {
        this.setState({
            expanded:!this.state.expanded
        })
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
    render:function () {
        
        var expanded = this.state.expanded;
        
        var event = this.props.event;
        var data = event.data;
        var start = moment(event.start);
        var end = moment(event.end);
        var lengthInDays = event.length;
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
                <div key={k} className={"tag"} id={tag.id}>{tag.description}</div>
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
                    {start.format("DD.MM")}{(lengthInDays > 0) ? "- "+end.format("DD.MM") :  ""}
                    </div>
                </div>
                <div className="col-xs-9">
                    <div className="col-xs-7 note-content">
                        <div className="note-header">{data.header}</div>
                        <div className="note-time">{hours}</div>
                        <div className="note-author">{author}</div>
                    </div>
                    <div className="col-xs-4 tags">{tags}</div>
                    <div className="col-xs-1 channels">{channels}</div>
                    <div >
                        <div className="col-xs-11 note-description" >
                            <p>{data.description}</p>
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
        var today = new Date(du.localFormat(wnt.today));
                
        var state = {
			currentDate:moment(defaultDate),
            events:[],
            week:week,
            calendarView:true,
            today:today,
            noteExpandedData:null,
            monthStart:null
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
    getNotes(date, events) {
        if (!events) {
            events = this.state.events;
        }
        
        var dateStart = moment(date).startOf('day');
        var dateEnd = moment(date).endOf('day');
        var notes = []
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
        var monthStart = moment(date).startOf('month').format('YYYY-MM-DD');
        var monthEnd = moment(date).endOf('month').format('YYYY-MM-DD');
        
        if (!forceUpdate && monthStart == this.state.monthStart) return;
        
        this.setState({monthStart:monthStart});
        
        KAPI.notes.list(wnt.venueID, monthStart, monthEnd, this.onNotesUpdated);
    },
    onNotesUpdated:function (result) {
        // result  = eventsTest;
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
            }
            
            var eventLength = (end.startOf("day").diff(start.startOf("day"), 'days'));
            dateCount++;
            
            if (!firstFound && eventLength < 1) {
                firstFound = true;
                firstOneDay = true;
            }
            
            events.push({
                'title': r.header,
                'allDay': r.all_day ? true : false,
                'start': start.toDate(),
                'end': end.toDate(),
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
        // console.log(events);
        
        this.setState({events:events, notes:this.getNotes(this.state.currentDate, events)});
    },
    updateDate:function (date) {
        this.updateNotes(date);
        this.props.onSelectDate(date);
        this.setState({currentDate:moment(date), week:this.getWeek(date), notes:this.getNotes(date)});
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
    onDateChange:function (e) {
        console.log(e);
        // e.preventDefault();
        this.updateDate(e);
    },
    onSelectNote:function (e) {
        console.log(e);
        this.updateDate(e.start);
    },
    onSelectSlot:function (e) {
        console.log(e);
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
        var current = $(getDOMNode(this.refs.BigCalendar)).find(".rbc-current");
        // console.log(this.refs.BigCalendar, current, DayBG);
        $(current).append(DayBG);
	},
    render:function () {
        
        var currentDate = this.state.currentDate.format("MMMM, YYYY")
        
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
                    <div className={this.state.calendarView? "calendar": "calendar folded"}>
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
                        <a href="#" onClick={null}><div className="week inline-block">
                            {this.state.week.start.format("MMM DD")} - {this.state.week.end.format("MMM DD")}, {this.state.week.start.format("YYYY")}
                        </div></a>
                        <div className="date inline-block">&nbsp;&nbsp;|&nbsp;&nbsp;{this.state.currentDate.format("dddd MMM Do, YYYY")}</div>
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