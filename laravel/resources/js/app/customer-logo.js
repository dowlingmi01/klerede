var React = require('react');
var $ = require('jquery');
var wnt = require ('./wnt.js');

var logos = {
    1518:<img src="img/na-logo-one-line.png" />
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
	    React.render(
	        <CustomerLogo />,
	        document.getElementById('customer-logo')
	    );
    });
}