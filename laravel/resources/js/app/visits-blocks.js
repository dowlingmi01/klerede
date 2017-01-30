/***************************************************/
/******** TOP ROW OF STAT BLOCKS FOR VISITS ********/
/***************************************************/

var React = require('react');
var ReactDOM = require('react-dom');


var $ = require("jquery");
require('../libs/jquery.easing.1.3.js');
require('../libs/jquery.numberformatter-1.2.4.jsmin.js');


var numeral = require('numeral');


var wnt = require ('./kcomponents/wnt.js');
var analytics = require("./analytics.js");

var ChangeArrow = require('./svg-icons').ChangeArrow;
var Caret = require('./svg-icons').Caret;

var ActionMenu = require('./reusable-parts').ActionMenu;
var printDiv = require ('./kutils/print-div.js');
var saveImage = require ('./kutils/save-image.js');


var KAPI = {
    stats:require("./kapi/stats.js"),
    boxes:require("./kapi/dashboard.js").boxes
};
var KUtils = {
    date:require("./kutils/date-utils.js")
}

var VisitsBlock = React.createClass({
    render: function() {
        return (
            <div className="stat-block">
                <div className="label">{this.props.label}</div>
                <div className="stat">{this.props.stat}</div>
                <div className="change">
                    <ChangeArrow className="up" />
                    <span className="compare-to">{this.props.comparedTo}</span>
                </div>
            </div>
        );
    }
});

var VisitsBlocksSet = React.createClass({
    getInitialState: function() {
        var actions = [];
        
        if(features.save) {
            actions.push({href:"#save", text:"Save", handler:this.onActionClick});
        }
        if (features.print) {
            actions.push({href:"#print", text:"Print", handler:this.onActionClick});
        }
        return {
            
            actions:actions,
            periodCompare:'prevWeek'
        };
    },
    onActionClick:function (event) {
        var eventAction = $(event.target).attr('href');
        switch(eventAction) {
        case "#save":
            saveImage("#visits-blocks-widget",{}, "Daily Attendance Stats");
            break;
        case "#print":
            printDiv("#visits-blocks-widget");
            break;
        default:
            return;
        }
        analytics.addEvent('Visit Blocks', 'Plus Button Clicked', eventAction);
        event.preventDefault();
    },
	onStatsResult:function (result) {
        console.debug(result);
        this.setState({result:result});
	},
    onBoxesLoaded:function(rows){
        var du = KUtils.date;
        var sameDayWeekBefore = du.serverFormat(du.addDays(wnt.today, -7));
        var sameDayLastYear = du.serverFormat(du.addDays(wnt.today, -(7*52) ));

		var queries = {};
        var boxesData = {};
        for (var i=0; i<rows.length; i++) {
            var row = rows[i];
            
            boxesData["row"+i] = {};
            
            for(var j=0; j<row.length; j++) {
                var box = row[j];
                
                var id = "row"+i+"box"+j;
                
                boxesData["row"+i][id] = box;
                queries[id] = { specs: box.specs, periods: wnt.today };
                queries[id+"prevWeek"] = { specs: box.specs, periods: sameDayWeekBefore };
                queries[id+"lastYear"] = { specs: box.specs, periods: sameDayLastYear };
                queries[id+"lastYearAverage"] = { 
                    specs: box.specs, 
                    periods: {
                        from: wnt.yesterdaylastyear,
                        to: wnt.yesterday,
                        kind: 'average'
                    }
                };
            }
        }
        
        this.setState({lastQueries:queries, boxesData:boxesData});
        
        KAPI.stats.query(
            wnt.venueID,
            queries,
            this.onStatsResult
        );
    },
    componentDidMount: function() {
        KAPI.boxes(wnt.venueID, this.onBoxesLoaded);
    },
    handleChange: function(event) {
        var filter = event.target.value;
        this.setState({periodCompare:filter})
    },
    componentDidUpdate: function(){
        $('#visits-blocks-widget .up').css('top','35px')
            .animate({
                top: '0'
            },
            700,
            'easeOutBounce'
        );
        $('#visits-blocks-widget .down').css('top','-35px')
            .animate({
                top: '0'
            },
            700,
            'easeOutBounce'
        );
    },
    render: function() {
        var result = this.state.result;
        if (!result) {
            return <div></div>;
        }
        
        var boxesData = this.state.boxesData;
        
        var rows = [];
        
        for (var k in boxesData) {
            var row = boxesData[k];
            var boxes = [];
            for (var l in row) {
                var boxData = row[l];
                var title = boxData.title;
                var field = boxData.result_field;
                //
                var stats = result[l];
                var stat = stats[field] || 0;

                var comparedStats = result[l+this.state.periodCompare];
                var comparedTo = comparedStats[field] || 0;
                
                if (field == "amount") {
                    stat = numeral(stat).format('$0,0');
                    comparedTo = numeral(comparedTo).format('$0,0');
                } else {
                    stat = numeral(stat).format('0,0');
                    comparedTo = numeral(comparedTo).format('0,0');
                }
                
                
                boxes.push(
                    <div key={l} className="col-xs-6 col-sm-4 col-lg-2" id="visits-total">
                        <VisitsBlock 
                            label={title} 
                            stat={stat} 
                            comparedTo={comparedTo} />
                    </div>
                )
            }
            
            rows.push(
                <div key={k} className="row">
                {boxes}
                </div>
            )
        }
        
        return (
            <div>
                <div className="row">
                    <div className="position-relative"><ActionMenu className="widget-plus-menu" actions={this.state.actions}/></div>
                    <div className="col-xs-12 col-sm-8 col-lg-4">
                        <div className="filter">
                            <form>
                                <select className="form-control" onChange={this.handleChange}>
                                    <option value="prevWeek">Compared to same day previous week</option>
                                    <option value="lastYear">Compared to same day last year</option>
                                    <option value="lastYearAverage">Compared to average for the past year</option>
                                </select>
                                <Caret className="filter-caret" />
                            </form>
                        </div>
                    </div>
                </div>
                {rows}
            </div>
        );
    }
});
if(document.getElementById('visits-blocks-widget')){
    $.when(wnt.gettingVenueData).done(function(data) {
        ReactDOM.render(
            <VisitsBlocksSet />,
            document.getElementById('visits-blocks-widget')
        );
        console.log('2) Visits blocks loaded...');
    });
}
