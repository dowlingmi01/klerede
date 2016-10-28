/*******************************************************************/
/******** WELCOME TEXT WITH USER'S NAME AND LOCAL TIME/DATE ********/
/*******************************************************************/

var React = require('react');
var ReactDOM = require('react-dom');


var $ = require('jquery');
var wnt = require ('./kcomponents/wnt.js');

var ReportingOn = React.createClass({
    getInitialState: function() {
		var date = new Date(wnt.today);
        return {
            day:date.getUTCDate(),
			month:wnt.months[date.getUTCMonth()],
			year:date.getUTCFullYear()
        };
    },
    render: function() {
        return (
			<div>
				<h4>Reporting On</h4>
	            <div className='time-date'>
	                {this.state.day} <span className="month-year">{this.state.month} {this.state.year}</span>
	            </div>
			</div>
        );
    }
});

if(document.getElementById('reporting-on')){
    $.when(wnt.gettingVenueData).done(function(data) {
	    ReactDOM.render(
	        <ReportingOn />,
	        document.getElementById('reporting-on')
	    );
    });
}