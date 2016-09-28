/**************************************/
/******** REUSABLE PARTS ICONS ********/
/**************************************/

var React = require('react');

var $ = require("jquery");
var wnt = require("./wnt.js");
var PlusSign = require('./svg-icons').PlusSign;
var Caret = require('./svg-icons').Caret;

var TimeDate = React.createClass({
    getInitialState: function() {
        return {
            clock: ''
        };
    },
    updateClock: function() {
        var today = new Date(),
            hours = today.getHours(),
            minutes = today.getMinutes(),
            date = today.getDate(),
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
            month = months[today.getMonth()],
            year = today.getFullYear(),
            time,
            period;
        // Handle zeros in front of minutes
        minutes = wnt.doubleDigits(minutes);
        // Format hours and period (AM/PM)
        if(hours === 0){
            time = '12:'+minutes;
            period = 'AM';
        }
        else if(hours < 12){
            time = hours+':'+minutes;
            period = 'AM';
        }
        else if(hours === 12){
            time = hours+':'+minutes;
            period = 'PM';
        }
        else {
            time = (hours-12)+':'+minutes;
            period = 'PM';
        }
        this.setState({ clock: [time, period, date, month+' '+year] });
        setTimeout(this.updateClock, 1000);
    },
    componentDidMount: function() {
        this.updateClock();
    },
    render: function() {
        return (
            <div className='time-date'>
                {this.state.clock[0]} <span className="time-period">{this.state.clock[1]}</span>
                {this.state.clock[2]} <span className="month-year">{this.state.clock[3]}</span>
            </div>
        );
    }
});

var ActionMenu = React.createClass({
    getInitialState:function () {
        return {in:""}
    },
    onClick:function (e) {
        if(this.state.in === "") {
            this.setState({in:"in"});
            e.stopPropagation();
        }
    },
    onClickOutside:function (e) {
        this.setState({in:""});
    },
    componentDidMount:function () {
        $(window).on("click", this.onClickOutside); 
    },
    componentWillUnmout:function () {
        $(window).off("click", this.onClickOutside); 
    },
    render: function() {
        if (this.props.actions.length==0) return (<div></div>);
        var actions = [];
        for (var k in this.props.actions) {
            var a = this.props.actions[k];
            actions.push(<div key={k} className="action"><a onClick={a.handler} href={a.href}>{a.text}</a></div>);
        }
        return (
            <div onClick={this.onClick} className="plus-sign-menu unsavable" data-toggle="popover" data-html="true" data-content="<a href='goals'>Edit</a>" data-placement="top">
                <PlusSign className="plus-sign-button" />
                <div className={"menu-content fade "+this.state.in} role="tooltip">
                    <div className="arrow"></div>
                    {actions}
                </div>
            </div>
        );
    }
});

var ButtonExpand = React.createClass({
    render: function() {
        return (
            <div className="button-expand collapsed" data-toggle="collapse" data-target={this.props.target}>
                <Caret />
            </div>
        );
    }
});

var Segment = React.createClass({
    render: function() {
        return (
            <td className="bar-meter-segment">
                {this.props.label}
            </td>
        );
    }
});

var Dial = React.createClass({
    render: function() {
        return (
            <div id={this.props.divID} className="dial">
                <div className="channel-info">
                    <div className="channel-name">{this.props.label}</div>
                    <div className="channel-amount">{this.props.amount}</div>
                    <div className="channel-goal">Goal: <span className="amount">{this.props.goal}</span></div>
                    <div className={"channel-status " + this.props.statusClass}>{this.props.status}</div>
                </div>
            </div>
        );
    }
});

var Meter = React.createClass({
    render: function() {
        return (
            <div id={this.props.divID} className="meter-group" data-completed={this.props.completed}>
                <div className="meter-label">{this.props.label}</div>
                <div className="meter-status"></div>
                <div className="bar-meter-marker"></div>
                <div className="bar-meter clear">
                    <div className="bar-meter-fill"></div>
                </div>
                <div className="meter-reading">
                    (<span className="current-amount">{this.props.amount}</span> of <span className="goal-amount">{this.props.goal}</span>)
                </div>
            </div>
        );
    }
});

console.log('Reusable parts loaded...');

module.exports.ActionMenu = ActionMenu;
module.exports.Meter = Meter;
module.exports.ButtonExpand = ButtonExpand;


// Loading just time and date instead of full welcome message
if(document.getElementById('time-date')){
    React.render(
        <TimeDate />,
        document.getElementById('time-date')
    );
    console.log('Time and date only loaded...');
}
