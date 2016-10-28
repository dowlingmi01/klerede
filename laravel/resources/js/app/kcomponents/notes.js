var React = require('react');
var $ = require('jquery');
var getDOMNode = require('../kutils/getDOMNode.js');

var wnt = require ('./wnt.js');

require('bootstrap');

var KAPI={notes:require("../kapi/notes.js")};

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
var CloseIcon = require('../svg-icons').CloseIcon;
var NoteIcon = require('../svg-icons').NoteIcon;
var SlimPlusSign = require('../svg-icons').SlimPlusSign;
var SlimMinusSign = require('../svg-icons').SlimMinusSign;

var Channel = require('./channel.js');
var JQTimePicker = require('./timepicker.js');


var SVGButton = React.createClass({
    render:function () {
        if (this.props.disabled) {
            return (
                <div id={this.props.id || ""} className={"svg-button disabled " + (this.props.className || "")}>
                    <div className="svg-button-content">{this.props.icon}</div>
                </div>
            );
        };
        return (
            <div onClick={this.props.onClick || null} onMouseDown={this.props.onMouseDown} id={this.props.id || ""} className={"svg-button " + (this.props.className || "")}>
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
        return(
            {
                channelNames:{gate:"Box Office", cafe: "Cafe", store: "Gift Store", membership: "Membership"},
                channelActive:{gate:"active", cafe: "active", store: "active", membership: "active"},
                categoryList:[
                    {value:1,label:"Facility", global:true}, 
                    {value:2, label:"Weather", global:true}, 
                    {value:3, label:"Holiday", global:true}, 
                    {value:4, label:"Local Event", global:true}
                ],
                selectedCategories:[],
                notify:"none",
                allDay:true,
				dateStart:moment(),
                dateEnd:moment(),
                timeStart:"9:00am",
                timeEnd:"10:00am",
                addCategoryActive:false,
                newCategory:"",
                changed:false,
                editCategory:false
            }
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
    onChange:function (e) {
        console.log(e);
    },
    onDateStartChange(d) {
        this.setChanged();
        this.setState({dateStart:d})
    },
    onDateEndChange(d) {
        this.setChanged();
        this.setState({dateEnd:d})
    },
    onTimeStartChange(d) {
        this.setChanged();
        this.setState({timeStart:$(d.target).val()});
    },
    onTimeEndChange(d) {
        this.setChanged();
        this.setState({timeEnd:$(d.target).val()});
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
            categoryList.push({value:newCategory, label:newCategory, new:true});
            this.setState({categoryList:categoryList, newCategory:"", addCategoryActive:false});
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
                categoryList.splice(i,1);
                this.setState({categoryList:categoryList});
                return;
            }
        }
        throw "category value not found: "+value;
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
    onCategorySelectBlur(e) {
        // console.log("onCategorySelectBlur");
        // this.stopEditCategory();
    },
    onCategorySelectOpen(e) {
        // console.log("onCategorySelectOpen");
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
            showAddNoteModal:false
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



module.exports = Notes;