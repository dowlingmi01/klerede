/******** The welcome text at the top of the page; including the user's name and the current local time and date. ********/

var WelcomeText = React.createClass({
    getInitialState: function() {
        return {
            firstName: 'Joe',
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
            <div>
                Hi&#160;
                <span className='user-name'>{this.state.firstName}!</span>&#160;
                Things are looking good.
                <div className='time-date'>
                    {this.state.clock[0]} <span className="time-period">{this.state.clock[1]}</span>
                    {this.state.clock[2]} <span className="month-year">{this.state.clock[3]}</span>
                </div>
            </div>
        );
    }
});

React.render(
  <WelcomeText />,
  document.getElementById('welcome-text')
);
console.log('Welcome text loaded...');
