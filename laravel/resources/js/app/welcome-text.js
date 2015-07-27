/* The welcome text at the top of the page; including the user's name and the current local time and date. */
var WelcomeText = React.createClass({
    getInitialState: function() {
        return {
            firstName: 'Joe',
            clock: wnt.updateClock()
        };
    },
    updateClock: function(){
        this.setState({ clock: wnt.updateClock() });
        setTimeout(this.updateClock, 1000);  //change to 60000?
    },
    componentDidMount: function(){
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
