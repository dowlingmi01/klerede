var React = require('react');
var ReactDOM = require('react-dom');

var $ = require('jquery');
var wnt = require ('./wnt.js');

var logos = {
    1518:<img src="img/na-logo-one-line.png" />,
    1204:<img style={{width:"165px"}} src="img/logo-psc-full.png" />
};

exports.logos = logos;

var CustomerLogo = React.createClass(
    {
        render:function () {
            if (logos[wnt.venue.id]) {
                return logos[wnt.venue.id];
            }
            return <div></div>;
        }
    }
);


if(document.getElementById('customer-logo')){
    $.when(wnt.gettingVenueData).done(function(data) {
	    ReactDOM.render(
	        <CustomerLogo />,
	        document.getElementById('customer-logo')
	    );
    });
}