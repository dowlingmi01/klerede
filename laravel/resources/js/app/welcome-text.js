/*******************************************************************/
/******** WELCOME TEXT WITH USER'S NAME AND LOCAL TIME/DATE ********/
/*******************************************************************/

var React = require('react');
var ReactDOM = require('react-dom');


var WelcomeText = React.createClass({
    getInitialState: function() {
        return {
            firstName: 'Michael'
        };
    },
    render: function() {
        return (
            <div className="row">
                <div className="col-xs-12 col-md-12">
                    Hi&#160;
                    <span className='user-name'>{this.state.firstName}!</span>&#160;
                    Things are looking good.
                    <TimeDate />
                </div>
            </div>
        );
    }
});

if(document.getElementById('welcome-text')){
    ReactDOM.render(
        <WelcomeText />,
        document.getElementById('welcome-text')
    );
    console.log('Welcome text loaded...');
}
