var React = require('react');
var $ = require('jquery');
var getDOMNode = require('../kutils/getDOMNode.js');

var limitString = require('../kutils/string-utils.js').limitString;

var wnt = require ('./wnt.js');
var NotesCalendarModal = require('../kcomponents/notes-calendar-modal.js');

require('bootstrap');
require ('jquery-placeholder');
require('dotdotdot');

var KAPI={
    notes:require("../kapi/notes.js"),
    users:require("../kapi/users.js"),
    tags:require("../kapi/tags.js"),
    auth:require("../kapi/auth.js")
};

var DatePicker = require('react-datepicker');

var moment = require('moment');
moment.updateLocale('en',{
    week:{
        dow:1
    }
});

var Select = require('react-select');


var CalendarIcon = require('../svg-icons').CalendarIcon;
var Caret = require('../svg-icons').Caret;
var CheckMark = require('../svg-icons').CheckMark;
var Circle = require('../svg-icons').Circle;
var CloseIcon = require('../svg-icons').CloseIcon;
var CloseIconPink = require('../svg-icons').CloseIconPink;
var EditIcon = require('../svg-icons').EditIcon;
var NoteIcon = require('../svg-icons').NoteIcon;
var SlimPlusSign = require('../svg-icons').SlimPlusSign;
var SlimMinusSign = require('../svg-icons').SlimMinusSign;

var AddNoteTip = require('./add-note-tip');
var Channel = require('./channel.js');
var JQTimePicker = require('./timepicker.js');
var SVGButton = require('./svg-button');


var Asterisc = React.createClass({
    render:function () {
        return <div className={this.props.className}>*</div>;
    }
})

var Category = React.createClass({
    render:function () {
        return(
            <div className="category-item">
                <CloseIconPink className="remove-category-item" onClick={this.props.onRemove} />
                {"#"+this.props.name}
            </div>
        );
    }
})

var TextArea = React.createClass({
    onChange:function (e) {
        var self = $(this.refs.self);
        self.height(Math.max(self.prop('scrollHeight'), this.props.minHeight));
        this.props.onChange(e);
    },
    render:function () {
        return(
            <textarea ref="self" id={this.props.id} className={this.props.className} placeholder={this.props.placeholder} value={this.props.value} defaultValue={this.props.defaultValue} onChange={this.onChange} />
        );
    }
});

var SelectOption = React.createClass({
    getInitialState:function () {
        return {};
    },
    doDelete:function (e) {
        this.props.onDelete(this.props.value);
    },
    doNotDelete:function (e) {
        this.setState({deleting:null});
    },
    delete:function (e) {
        this.setState({deleting:true});
    },
    render:function () {
        if (this.state.deleting) 
            return (
                <div>Are you sure?
                    <button type="button" onClick={this.doDelete} className="btn">Yes</button>
                    <button type="button"  onClick={this.doNotDelete}  className="btn" >No</button>
                </div>
            );
        if (this.props.editMode) 
            return (
                <div>{this.props.label}
                    <SVGButton onClick={this.delete} className="delete-category" icon={<SlimMinusSign />}/>
                </div>
            );
        
        return (
            <div>{this.props.label}</div>
        );
    } 
});

var AddNoteModal = React.createClass({
    getInitialState:function () {
        var state = {
            channelNames:{gate:"Box Office", cafe: "Cafe", store: "Gift Store", membership: "Membership"},
            channelActive:{gate:"active", cafe: "active", store: "active", membership: "active"},
            categoryList:[],
            selectedCategories:[],
            notify:"none",
            allDay:true,
			dateStart:moment(this.props.selectedDate || this.props.date),
            dateEnd:moment(this.props.selectedDate || this.props.date),
            timeStart:"9:00am",
            timeEnd:"10:00am",
            addCategoryActive:false,
            newCategory:"",
            changed:false,
            editCategory:false,
            header:"",
            description:"",
            id:null
        };
        
        var note = this.props.editNote;
        if (note) {
            state.channelActive = {gate:"", cafe: "", store: "", membership: ""};
            for (var i in note.channels) {
                var ch = note.channels[i].code;
                state.channelActive[ch] = "active";
            }
            for (var j in note.tags) {
                var tag = note.tags[j];
                state.selectedCategories.push({value:tag.id, label:tag.description, global:(tag.venue_id == 0) ? true : false})
            }
            state.allDay = note.all_day ? true : false;
            state.dateStart = moment(note.time_start);
            state.dateEnd = moment(note.time_end);
            if(!state.allDay) {
                state.timeStart = state.dateStart.format("h:mma");
                state.timeEnd = state.dateEnd.format("h:mma");
            }
            state.header = note.header;
            state.description = note.description;
            state.id = note.id;
        }
        
        return(
            state
        ); 
    },
    setChanged:function() {
        if (!this.state.changed) {
            this.setState({changed:true});
        }
    },
    componentDidMount:function () {
        $(getDOMNode(this)).modal("show");
        // $(getDOMNode(this)).on('hidden.bs.modal', this.props.onClose);
        // $(getDOMNode(this)).on('hidden.bs.modal', this.onClose);
        $(getDOMNode(this)).on('hide.bs.modal', this.onClose);
        // $(getDOMNode(this)).on('close.bs.alert', this.onClose);
        
        this.loadTags();
    },
    loadTags:function () {
        KAPI.tags.list(wnt.venueID, this.onTagsLoaded);
    },
    onTagsLoaded:function (tags) {
        var categoryList = [];
        for (var i=0 ; i<tags.length ; i++) {
            var tag = tags[i];
            categoryList.push(
                {
                    value:tag.id,
                    label:tag.description,
                    global:(tag.venue_id == 0) ? true : false
                }
            )
        }
        this.setState({categoryList:categoryList});
    },
    onClose:function (e) {
        // console.log(e);
        // e.stopPropagation();
        if (this.state.changed && !confirm("Your changes will be lost.\nAre you sure?")) {
            e.preventDefault();
        } else {
            this.props.onClose();
        }
    },
    onHeaderChange:function (e) {
        this.setChanged();
        this.setState({header:e.target.value});
    },
    onDescriptionChange:function (e) {
        var value = e.target.value;
        if(!features.notes_calendar && value.length>120) {
            alert("120 character limit reached.")
            value = value.substring(0, 120);
        };
        this.setChanged();
        this.setState({description:value});
    },
    onDateStartChange(d) {
        this.setChanged();
        var state = {dateStart:d};
        if (moment(this.state.dateEnd).isBefore(d)) {
            state.dateEnd = d;
        };
        this.setState(state);
    },
    onDateEndChange(d) {
        this.setChanged();
        var state = {dateEnd:d};
        if (moment(this.state.dateStart).isAfter(d)) {
            state.dateStart = d;
        };
        this.setState(state);
    },
    onTimeStartChange(d) {
        this.setChanged();
        var timeStart = $(d.target).val();
        var state = {timeStart:timeStart};
        
        if ( this.state.dateStart.isSame(this.state.dateEnd) ) {
            var timeStartM = moment(timeStart,["h:mma"]);
            var timeEndM = moment(this.state.timeEnd,["h:mma"]);

            if( timeStartM.isAfter(timeEndM) ) {
                state.timeEnd = timeStartM.add(1, "h").format("h:mma");
            }
        }
        
        this.setState(state);
    },
    onTimeEndChange(d) {
        this.setChanged();
        var timeEnd = $(d.target).val();
        var state = {timeEnd:timeEnd};
        
        if ( this.state.dateStart.isSame(this.state.dateEnd) ) {
            var timeStartM = moment(this.state.timeStart,["h:mma"]);
            var timeEndM = moment(timeEnd,["h:mma"]);

            if( timeStartM.isAfter(timeEndM) ) {
                state.timeStart = timeEndM.add(-1, "h").format("h:mma");
            }
        }
        
        this.setState(state);
    },
    onChannelClick:function (k) {
        this.setChanged();
        var channelActive = this.state.channelActive;
        if (channelActive[k] ==="active") {
            channelActive[k] = "";
        } else {
            channelActive[k] = "active";
        }
        this.setState({channelActive:channelActive});
    },
    onCategorySelect(c) {
        
        var selectedCategories = this.state.selectedCategories;
        
        for (var i=0; i<selectedCategories.length; i++) {
            if (selectedCategories[i].value == c.value) {
                return;
            }
        }
        
        this.setChanged();
        
        selectedCategories.push(c);
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
        if(e.target.value.length>25) {
            alert("25 character limit reached.")
            return;
        };
        this.setState({newCategory:e.target.value});
    },
    onAddCategoryClick(e){

        if(!this.state.addCategoryActive) {
            
            this.setState({addCategoryActive:true});
            this.refs.addCategory.focus();
            
        } else if (this.state.newCategory.length) {
            
            var categoryList = this.state.categoryList;
            var newCategory = this.state.newCategory;
            
            for (var i=0; i<categoryList.length; i++) {
                var category = categoryList[i];
                if(category.label == newCategory) {
                    alert("This category already exits: "+newCategory);
                    return;
                }
            }
            
            this.setChanged();
            var newCategory = {value:newCategory, label:newCategory, new:true};
            categoryList.push(newCategory);
            this.setState({categoryList:categoryList, newCategory:"", addCategoryActive:false});
            this.onCategorySelect(newCategory);
        }
    },
    onAddCategoryBlur(e){
        if (!this.state.newCategory.length) {
            this.setState({addCategoryActive:false});
        }
    },
    onEditCategory(e) {
        // console.log("onEditCategory", this.state.editCategory);
        if (!this.state.editCategory) {
            
            this.setState({editCategory:true});
            this.refs.categorySelect.focus();
            $(".Select-menu-outer").show();
            e.stopPropagation();
        } else {
            this.stopEditCategory();
            this.refs.categorySelect.focus();
            $(".Select-menu-outer").hide();
        }
    },
    stopEditCategory:function () {
        // console.log("stopEditCategory", this.state.editCategory);
        if(this.state.editCategory) {
            this.setState({editCategory:false});
        }
    },
    onDeleteCategory(value) {
        var categoryList = this.state.categoryList;
        for (var i=0; i<categoryList.length; i++) {
            if (categoryList[i].value == value) {

                var deletedCat = categoryList[i];

                this.onCategoryDeselect(deletedCat);

                categoryList.splice(i,1);
                this.setState({categoryList:categoryList});

                if(deletedCat.new) {
                    return;
                }

                this.doDeleteCategory(value);
                return;
            }
        }
        throw "category value not found: "+value;
    },
    doDeleteCategory:function (value) {
        console.log("doDeleteCategory:"+value);
        KAPI.tags.delete(value, wnt.venueID, this.onDeleteCategorySuccess, this.onDeleteCategoryError);
    },
    onDeleteCategorySuccess: function(response) {
        console.log(response);
    },
    onDeleteCategoryError: function(response) {
        this.loadTags();
        var result = response.responseJSON;
        if(result) {
            if(result.message=="used_tag") {
                alert("Cannot delete a category that contains notes");
            } else {
                alert("Cannot delete a category: "+result.message);
            }
        } else {
            throw response;
        };
    },
    onNotifyClick:function (notify) {
        this.setChanged();
        this.setState({notify:notify});
    },
    onAllDayClick:function (e) {
        this.setChanged();
        this.setState({allDay:!this.state.allDay})
    },
    optionRenderer:function (o) {
        return (
            <SelectOption value={o.value} onDelete={this.onDeleteCategory} editMode={!o.global && this.state.editCategory} label={o.label}/>
        );
    },
    onCategorySelectClose() {
        // console.log("onCategorySelectClose");
        if(this.state.editCategory) {
            throw("editingCategory");
        } 
    },
    checkEditCategoryOuter(e) {
        this.stopEditCategory();
        $(".Select-menu-outer").hide();
        
    },
    checkEditCategoryInner(e) {
        e.stopPropagation();
        e.preventDefault();
    },
    onCategorySelectBlur(e) {
        // console.log("onCategorySelectBlur");
        // this.stopEditCategory();
    },
    onCategorySelectOpen(e) {
        // console.log("onCategorySelectOpen");
    },
    onSaveNote:function (e) {
        //console.log(save note)
        
        if(!this.state.header.length) {
            alert("Please add a header.");
            return;
        }
        if(!this.state.description.length) {
            alert("Please add a description.");
            return;
        }
        
        
        var channels = [],
            i=0;
        for (var k in this.state.channelActive) {
            i++;
            if (this.state.channelActive[k] == 'active') {
                channels.push(i);
            }
        }
        
        var categoryList = this.state.categoryList;
        var newTags = [];
        for (var l in categoryList) {
            if (categoryList[l].new) {
                newTags.push(categoryList[l].label);
            };
        }

        var tags = [];
        for (var m in this.state.selectedCategories) {
            tags.push(this.state.selectedCategories[m].value);
        };
        
		if(tags.length == 0 && newTags.length == 0) {
			alert("Please select at least one category.");
			return;
		}
        
        var dateStart = moment(this.state.dateStart);
        var dateEnd = moment(this.state.dateEnd);
        
        if (!this.state.allDay) {
            var timeStart = moment(this.state.timeStart,["h:mma"]);
            var timeEnd = moment(this.state.timeEnd,["h:mma"]);

            dateStart.hour(timeStart.hour());
            dateStart.minute(timeStart.minute());

            dateEnd.hour(timeEnd.hour());
            dateEnd.minute(timeEnd.minute());
        }
        // console.log( dateStart.format('YYYY-MM-DD HH:mm:ss'));
        // } else {
        //     var dateStart = this.state.dateStart.format('YYYY-MM-DD HH:mm:ss');
        //     var dateEnd = this.state.dateEnd.format('YYYY-MM-DD HH:mm:ss');
        // }
        if (this.state.id) {
            // alert("Edit not implemented yet.");
            // return;
            KAPI.notes.put(
                this.state.id,
                this.state.header,
                this.state.description,
                dateStart.format('YYYY-MM-DD HH:mm:ss'),
                dateEnd.format('YYYY-MM-DD HH:mm:ss'),
                channels,
                tags,
                this.onSaveNoteSucces,
                this.onSaveNoteError,
                this.state.allDay,
                newTags
            );
        } else {
            KAPI.notes.post(
                wnt.venueID,
                this.state.header,
                this.state.description,
                dateStart.format('YYYY-MM-DD HH:mm:ss'),
                dateEnd.format('YYYY-MM-DD HH:mm:ss'),
                channels,
                tags,
                this.onSaveNoteSucces,
                this.onSaveNoteError,
                this.state.allDay,
                newTags
            );
        }
    },
    onSaveNoteSucces(response) {
        if (response.result=="ok") {
            this.setState({changed:false});
            $(getDOMNode(this)).modal("hide");
            alert("New note has been saved.");
            this.props.onSave();
        } else {
            alert("Unkown problem found: "+response.message);
        }
    },
    onSaveNoteError(response) {
        console.log(response);
        alert("An error ocurred saving note.");
    },
	componentDidUpdate:function(){
		$('input, textarea').placeholder();
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
        var categories = [];
        
        for (var i=0; i<selectedCategories.length; i++) {
            var c = selectedCategories[i];
            
            categories.push(<Category key={c.value} onRemove={this.onCategoryDeselect.bind(this, c)} value={c.value} name={c.label} />)
        }
        
        var categoryList = this.state.categoryList;
        for (var i=0; i<categoryList.length; i++) {
            if (!categoryList[i].global) {
                var editableCatExist = true;
                break;
            }
        }

        var currentDate = moment(this.state.dateStart).format("MMMM D, YYYY")
        
        return(
            <div className="modal fade" tabIndex="-1" role="dialog">
              <div className="modal-dialog" role="document">
                <div className="modal-content" onClick={this.checkEditCategoryOuter}>
                  <div className="modal-header modal-section">
                    <button type="button" className="close" data-dismiss="modal" aria-label="Close"><CloseIcon className="close-icon"/></button>
                    <h3 className="modal-title">{currentDate}</h3>
                    <div id="calendar-button-container">
                    {false ? 
                        <div id="calendar-button"> <CalendarIcon /> <span id="text">Calendar</span></div>
                    :
                        <div></div>
                    }
                    </div>
                  </div>
                  <div className="modal-body modal-section">
                    <div className="required-text"><Asterisc className="required-circle" /> Indicates Required Field</div>
                    <form ref="addNoteForm" className="" onFocus={null}>
                        <div className="form-group">
                            <input autoComplete="off" type="text" id="header" className="form-control" placeholder="Add Note Header" value={this.state.header} onChange={this.onHeaderChange} />
                            <Asterisc className="required-circle note-header" />
                        </div>
                        <div className="form-group">
                            <TextArea autoComplete="off" minHeight={34} id="description" className="form-control" placeholder={"Description"+ (features.notes_calendar ? "":" - 120 character limit")} value={this.state.description} onChange={this.onDescriptionChange} />
                            <Asterisc className="required-circle" />
                        </div>
                        <div className="form-group" id="date-time">
                            <Asterisc className="required-circle" />
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
                            <Asterisc className="required-circle" />
                        </div>
                        <div className="form-group" id="categories">
                            <div className="choose-text">
                                <Asterisc className="required-circle" />
                                <div>
                                    Choose a common category OR create your own.
                                    <br />
                                    <small>
                                        Categories classify notes to help facilitate search and data analysis.
                                    </small>
                                </div>
                            </div>
                            
                            <div className="inline-block" id="select-category" onClick={this.checkEditCategoryInner}>
                                <div id="select-wrapper" className="inline-block vertical-middle">
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
                                </div>
                                <SVGButton 
                                    onClick={this.onEditCategory}
                                    className={"circle category-svg-button vertical-middle" + (this.state.editCategory ? " active" : "")}
                                    icon={<SlimMinusSign />}
                                    disabled={editableCatExist || this.state.editCategory ? null : 'disabled'}
                                />
                            </div>
                            <div className="inline-block float-right">
                                <div className={"character-limit" + (this.state.addCategoryActive ? " active" : "")}><small>25 character limit</small></div>
                                <SVGButton className={"circle category-svg-button vertical-middle"+(this.state.newCategory.length ? " active" : "")} onClick={this.onAddCategoryClick} icon={<SlimPlusSign />} />
                                &nbsp;
                                <input 
                                    autoComplete="off"
                                    type="text" 
                                    ref="addCategory" 
                                    id="add-category" 
                                    className={"form-control vertical-middle" + (this.state.addCategoryActive ? " active" : "")}
                                    disabled={ this.state.addCategoryActive ? null : "disabled" }
                                    placeholder={this.state.addCategoryActive ? "Add new category" : ""} 
                                    value={this.state.newCategory} 
                                    onChange={this.onAddCategoryChange} 
                                    onBlur={this.onAddCategoryBlur}
                                />
                                
                            </div>
                            <div id="category-list">{categories}</div>
                        </div>
                        { (false) ? 
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
                        :
                            <div></div>   
                        }
                    </form>
                    
                  </div>
                  <div className="modal-footer modal-section">
                    <div className="buttons">
                        <button type="button" id="button-save" onClick={this.onSaveNote} className="btn btn-primary">Save Note</button>
                        <button type="button"  id="button-cancel" className="btn btn-default" data-dismiss="modal">Cancel</button>
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
		var style = {};
		// console.log(this.props.circleClassName)
		if (this.props.circleClassName == " empty") {
			style.width = "0px";
			// console.log(style);
		}
        return(
            <div style={style} id={this.props.id} className="note-circle-container" onClick={this.props.onClick}>
                <div className={"note-circle "+this.props.circleClassName}><Circle /></div>
            </div>
        );
    }
});

var NoteBar = React.createClass({
    getInitialState:function () {
        return {fadein:"out"}
    },
    onMouseEnter:function (e) {
        this.setState({fadein:"in"});
        var selectedDate = this.props.id;
        this.props.onSelectDate(selectedDate);
    },
    onMouseLeave:function (e) {
        this.setState({fadein:"out"});
    },
    render:function () {

        var showNotes = this.props.showNotes;
        var circleClassName;
        
        switch (this.props.noteCount) {
        case 0:
            circleClassName = " empty";
            showNotes = null;
            break;
        case 1:
            circleClassName = " one";
            break;
        case 2:
            circleClassName = " two";
            break;
        case 3:
            circleClassName = " three";
            break;
        default:
            circleClassName = " four";
            break;
        };
        
        return(
            <div 
                style={this.props.width ? {width:this.props.width} : {}} 
                className={"notebar "+this.props.className} 
                onClick={this.props.addNote}
				onMouseEnter={this.onMouseEnter} 
				onMouseLeave={this.onMouseLeave} 
            >
                <NoteCircle 
                    id={this.props.id} 
                    circleClassName={circleClassName}
                    onClick = {showNotes}
                /> 
                <div id="add-note-tip-container">
                    <AddNoteTip onAddNote={this.props.addNote} ref="addNoteTip" fadein={this.state.fadein}/>
                </div>
            </div>
        )
    } 
});

var NoteColumn = React.createClass({
    getInitialState:function () {
        return {
            permissions: KAPI.auth.getUserPermissions(),
            userID: KAPI.auth.getUser().id,
            description:"",
            readMore:false
        }
    },
    onNoteEdit:function (e) {
        this.props.onNoteEdit(this.props.note);
    },
    onNoteDelete:function (e) {
        if (!confirm("Delete this note?")) {
            return;
        }
        var id = this.props.note.id;
        KAPI.notes.delete(id, wnt.venueID, this.onNoteDeleted);
    },
    onNoteDeleted:function (response) {
        alert("The note has been deleted.");
        this.props.onNoteDeleted();
    },
    componentWillReceiveProps:function (nextProps) {
        if(this.props.note.description != nextProps.note.description) {
            this.addEllipses(nextProps.note.description);
        }
    },
    onEllipsesAdded:function(isTruncated, orgContent) {
        this.setState({readMore:isTruncated});
    },
    readMore:function () {
        // console.log(this.props.note)
        this.props.readMore(this.props.note);
    },
    addEllipses:function (description) {
        $(this.refs.noteDescription).text(description);
        $(this.refs.noteDescription).dotdotdot({
            callback:this.onEllipsesAdded,
            ellipsis:""
        });
        this.setState({description:$(this.refs.noteDescription).text()});
    },
    componentDidMount:function () {
        this.addEllipses(this.props.note.description);
    },
    render:function() {
        var note = this.props.note;
        var eventLength = note.all_day +  moment(note.time_end).diff(moment(note.time_start), 'days');
        //console.log("eventLength",eventLength);
        var formatedTime = eventLength >= 2 ?  eventLength+" days" : note.all_day ? "All day" : moment(note.time_start).format("ha")+"-"+moment(note.time_end).format("ha");
        var description = this.state.description;
        
        
        if (this.state.permissions["notes-manage"] || note.owner_id == this.state.userID) {
            var editable = true;
        }
        
        return(
            <div className="note-column" >
                <div className="note-header">{note.header}</div>
                <div className="note-time">{formatedTime}</div>
                <div className="edit-delete">
                {(editable) ?
                <span>
                    <EditIcon onClick={this.onNoteEdit} className="edit-icon"  /> 
                    <SVGButton 
                        className={"circle delete vertical-middle"} 
                        onClick={this.onNoteDelete} icon={<SlimMinusSign />} 
                    />
                </span>
                : 
                    <span></span>
                }
                </div>
                <div className="note-author">{note.author}</div>
                <div ref="noteDescription" className="note-description">
                    {description}
                </div>
                {this.state.readMore ?
                    <a onClick={this.readMore} className="readMore">...</a>
                    :
                    <span></span>
                }
            </div>
        );
    }
});
var Notes = React.createClass({
    getInitialState:function() {
        return {
            noteTipIcon:"", 
            noteDetailsClass:"",
            activeNote:null,
            showAddNoteModal:false,
            showCalendarModal:false,
            readMoreNoteID:null,
            noteEditCalendar:false,
            selectedDate:null,
            noteList:{},
            editNote:null,
            authorList:{}
        }
    },
    closeCalendarModal(e) {
        // console.log(e);
        this.setState({showCalendarModal:false, readMoreNoteID:null});
    },
    closeAddNoteOpenCalendar(e) {
        this.setState({showAddNoteModal:false, showCalendarModal:true, noteEditCalendar:false});
    },
    closeAddNoteModal(e) {
        this.setState({showAddNoteModal:false});
    },
	onSelectDate(selectedDate) {
		this.setState({selectedDate:selectedDate});
        // console.log(selectedDate);
	},
    onNoteEdit:function(note) {
        this.setState({showAddNoteModal:true, editNote:note});
    },
    onNoteEditCalendar:function(note) {
        this.setState({noteEditCalendar:true});
        this.onNoteEdit(note);
    },
    addNote:function(e) {
        // console.log(e.target, e.currentTarget);
        e.preventDefault();
        this.setState({showAddNoteModal:true, editNote:false});
    },
    showNoteTipIcon:function (e) {
		
        var selectedDate = moment(this.state.activeNote).format();
		
        this.setState({noteTipIcon:"in", selectedDate:selectedDate});
    },
    hideNoteTipIcon:function (e) {
        this.setState({noteTipIcon:"out"});
    },
    showCalendar:function (e) {
        this.setState({showCalendarModal:true});
    },
    readMore:function(note) {
        // console.log("notes->setState:",{defaultExpanded:note, showCalendarModal:true})
        this.setState({readMoreNoteID:note.id, showCalendarModal:true});
    },
    showNotes:function (event, n) {
        event.stopPropagation();
        
        
        var activeNote = $(event.currentTarget).attr('id');

        if (this.state.activeNote == activeNote) {
            this.hideNotes(event);
            return;
        }
        
        if(this.props.isQuarter) {
            this.props.onShowNotes(moment(activeNote).format("MM/DD/YYYY"));
            return;
        }
        
        // console.debug(activeNote, $(event.currentTarget).prop('id'))
        this.setState({activeNote:activeNote, noteDetailsClass:"active"});
    },
    hideNotes:function (e) {
        this.setState({activeNote:null, noteDetailsClass:""});
    },
    updateAuthorList:function () {
        KAPI.users.get(wnt.venueID, this.onAuthorListUpdated)
    },
    onAuthorListUpdated:function (authors) {
        var authorList = {};
        for(var i = 0 ; i < authors.length; i++) {
            var author = authors[i];
            authorList[author.id] = author.name;
        }
        this.setState({authorList:authorList});
        this.updateNoteList();
    },
    updateNoteList:function (props) {
        // console.log(props.startDate, props.endDate);
        if (!props) props = this.props;
        
        KAPI.notes.list(wnt.venueID, props.startDate, props.endDate, this.onNoteListUpdated);
    },
    onNoteListUpdated(response) {
        var multiDay = [];
        var noteList = {};
        var count = 0;
        var currentDate = moment(this.props.startDate);
        var endDate = moment(this.props.endDate);
        var step = 1;
        if (this.props.isQuarter) {
            var weekday = currentDate.weekday();
            currentDate.add(-weekday,"d");
            step = 7;
        }
        
        while(currentDate.isBefore(endDate)) {
            var currentDatePlusOne = moment(currentDate).add(step, "d");
            var dateNotes = [];
            while(response.length) {
                var note = response.shift();
                var noteStartDate = moment(note.time_start);
                var noteEndDate = moment(note.time_end);
                if( noteStartDate.isBefore(currentDatePlusOne) ) {

                    var author = this.state.authorList[note.owner_id];
                    if (author)
                        note.author = author;
                    dateNotes.push(note);
                    
                    if(noteEndDate.isSameOrAfter(currentDatePlusOne)) {
                        multiDay.unshift(note);
                    }
                    
                } else {
                    response.unshift(note);
                    break;
                }
            }
            response = multiDay.concat(response);
            multiDay = [];
            
            
            noteList[currentDate.format()] = dateNotes;
            count++;
            
            currentDate = currentDatePlusOne;
        }
        
        if (this.props.isQuarter) {
            count = 14;
        }
        
        var state = {noteList:noteList};
        // console.debug(noteList, count);
        if (this.props.showFirstNote) {
            for (var k in noteList) {
                if(noteList[k].length) {
                    state.activeNote = k;
                    state.noteDetailsClass = "active";
                    break;
                }
            }
            this.props.onShowFristNoteComplete();
        }
        
        if (this.state.activeNote) {
            var noteColumns = [];
            var currentNotes = noteList[this.state.activeNote];
            if(currentNotes.length == 0) {
                this.hideNotes();
            }
        }
        
        this.setState(state);
    },
    componentWillReceiveProps:function (nextProps) {
        if (this.props.startDate == nextProps.startDate && this.props.endDate == nextProps.endDate ) {
            return;
        }
		this.hideNotes();
        this.updateNoteList(nextProps);
    },
    componentDidMount:function () {
        this.updateAuthorList();
    },
    componentDidUpdate:function () {
        if ($('div.modal-backdrop.fade.in').length > 1) {
            $($('div.modal-backdrop.fade.in')[0]).detach();
        }
    },
    render:function () {
        var noteList = this.state.noteList;
        var noteBars = [];
        var barWidth = (100/this.props.barCount)+"%";
        for (var k in noteList) {
            var dayNotes = noteList[k];
            var noteBar = <NoteBar
                key={k}
                id={k}
                addNote={this.addNote}
                width={barWidth}
                className={this.state.activeNote==k ? "active":""} 
                showNotes={(event)=>this.showNotes(event, k)}
                addNote={this.addNote}
                noteCount = {dayNotes.length}
				onSelectDate = {this.onSelectDate}
            />
            noteBars.push(noteBar);
        }
        
        if (this.state.activeNote) {
            var noteColumns = [];
            var currentNotes = noteList[this.state.activeNote];
            for (var i=0 ; i<currentNotes.length; i++) {
                // if(i>=4)
                //     break;
                
                noteColumns.push(
                    <div  key={i} className="col-xs-3">
                        <NoteColumn readMore={this.readMore} note={currentNotes[i]} onNoteEdit={this.onNoteEdit} onNoteDeleted={this.updateNoteList} />
                    </div>
                )
            }
            var formattedDate = moment(this.state.activeNote).format("dddd, MMM D, YYYY");
        
        }
        
        return (
            <div className="notes">
            { features.notes_calendar ?
                <div id="calendar-button-container" onClick={this.showCalendar}>
                    <div id="calendar-button"> <img src="/img/icon_calendar.svg" /> </div>
                </div>
                :<div></div>
            }
                <div id="notebars">
                    {noteBars}
                </div>
                <div id="note-details" className={this.state.noteDetailsClass}>
                     <div id="close-icon-container" onClick={this.hideNotes}><CloseIcon className="close-icon"/></div>
                    <div id="contents">
                        <div id="note-details-header">
                            <div id="add-note" onClick={this.addNote} onMouseEnter={this.showNoteTipIcon} onMouseLeave={this.hideNoteTipIcon}>
                                <NoteIcon className="note-icon" /> 
                                <AddNoteTip  onAddNote={this.addNote} ref="addNoteTipIcon" left="5px" fadein={this.state.noteTipIcon}/>
                            </div>
                            {formattedDate}
                        </div>
                        <div className="row" id="note-columns">
                            {noteColumns}
                        </div>
                    </div>
                </div>
                
                <NotesCalendarModal 
                    defaultDate={this.state.activeNote || this.props.date.currentDate} 
                    onSave={this.updateNoteList} 
                    onClose={this.closeCalendarModal}
                    authorList={this.state.authorList}
                    onNoteEdit={this.onNoteEditCalendar}
                    onSelectDate={this.onSelectDate}
                    onNoteDeleted={this.updateNoteList}
                    readMoreNoteID={this.state.readMoreNoteID}
                    show={ this.state.showCalendarModal && !this.state.showAddNoteModal }
                    periodType={this.props.periodType}
                /> 
                
                {this.state.showAddNoteModal ? 
                    <AddNoteModal 
                        editNote={this.state.editNote} 
                        selectedDate={this.state.selectedDate} 
                        date={this.props.startDate} 
                        onSave={this.updateNoteList} 
                        onClose={this.state.noteEditCalendar ? this.closeAddNoteOpenCalendar :  this.closeAddNoteModal }
                    /> 
                    : <div></div>
                }

            </div>
        );
    }
});



module.exports = Notes;