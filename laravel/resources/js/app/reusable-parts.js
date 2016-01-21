/**************************************/
/******** REUSABLE PARTS ICONS ********/
/**************************************/

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
    render: function() {
        return (
            <div className="plus-sign-menu" data-toggle="popover" data-html="true" data-content="<a href='goals'>Edit</a> <span onClick='wnt.export(this);'>Save</span> <span>Email</span> <span onClick='wnt.print(this);'>Print</span>" data-placement="top">
                <PlusSign className="plus-sign-button" />
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

console.log('Reusable parts loaded...');

// Loading just time and date instead of full welcome message
if(document.getElementById('time-date')){
    React.render(
        <TimeDate />,
        document.getElementById('time-date')
    );
    console.log('Time and date only loaded...');
}
