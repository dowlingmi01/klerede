/* Welcome Text */
var WelcomeText = React.createClass({
    getInitialState: function() {
        this.todaysDate;
        return {
            firstName: 'Joe',
            currentDate: 1
        };
    },
    todaysDate: function(){
        var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        var d = new Date();
        var y = d.getFullYear();
        var m = months[d.getMonth()];
        var lesDate = d.getDate();
        var hr = d.getHours();
        var min = d.getMinutes();
        this.setState({ currentDate: lesDate });
        console.log(lesDate);
    },
    render: function() {
        return (
            <div>
                Hi&#160;
                <span className='user-name'>{this.state.firstName}!</span>&#160;
                Things are looking good.
                <div className='time-date'>
                    12:00 <span className='time-date-modifier'>PM</span>&#160;&#160;&#160;
                    {this.state.currentDate} <span className='time-date-modifier'>July 2015</span>
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