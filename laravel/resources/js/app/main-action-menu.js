/*********************************/
/******** MAIN ACTION MENU *******/
/*********************************/

var React = require('react');
var $ = require('jquery');
var wnt = require('./wnt.js');

var ActionMenu = require('./reusable-parts').ActionMenu;

var printDiv = require ('./kutils/print-div.js');
var saveImage = require ('./kutils/save-image.js');
var analytics = require("./analytics.js");


var MainActionMenu = React.createClass({
    
    getInitialState: function() {
        var actions = [];
        
        if(features.save) {
            actions.push({href:"#save", text:"Save Page", handler:this.onActionClick});
        }
        if (features.print) {
            actions.push({href:"#print", text:"Print Page", handler:this.onActionClick});
        }
        
        return {actions:actions};
    },
    onActionClick:function (event) {
        var eventAction = $(event.target).attr('href');
        switch(eventAction) {
        case "#save":

            saveImage("body");
            break;
        case "#print":
            printDiv("body");
            break;
        default:
            return;
        }
        analytics.addEvent('Main Action Menu', 'Plus Button Clicked', eventAction);
        event.preventDefault();
    },
    render:function () {
        return (
            <ActionMenu actions={this.state.actions}/>
        );
    }
});

if(document.getElementById('main-action-menu')){
    $.when(wnt.gettingVenueData).done(function(data) {
        React.render(
            <MainActionMenu />,
            document.getElementById('main-action-menu')
        );
    });
}
