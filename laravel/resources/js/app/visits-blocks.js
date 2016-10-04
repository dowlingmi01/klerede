/***************************************************/
/******** TOP ROW OF STAT BLOCKS FOR VISITS ********/
/***************************************************/

var React = require('react');

var $ = require("jquery");
require('../libs/jquery.easing.1.3.js');
require('../libs/jquery.numberformatter-1.2.4.jsmin.js');

var wnt = require ('./wnt.js');
var analytics = require("./analytics.js");

var ChangeArrow = require('./svg-icons').ChangeArrow;
var Caret = require('./svg-icons').Caret;

var ActionMenu = require('./reusable-parts').ActionMenu;
var printDiv = require ('./kutils/print-div.js');
var saveImage = require ('./kutils/save-image.js');


var KAPI = {
    stats:require("./kapi/stats.js")
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
            
            visitsTotal: '...',
            visitsTotalCompareTo: '...',
            
            visitsGA: '...',
            visitsGACompareTo: '...',

            visitsGroups: '...',
            visitsGroupsCompareTo: '...',

            visitsMembers: '...',
            visitsMembersCompareTo: '...',

            visitsNonmembers: '...',
            visitsNonmembersCompareTo: '...',

            salesGate: '...',
            salesGateCompareTo: '...',
        };
    },
    onActionClick:function (event) {
        var eventAction = $(event.target).attr('href');
        switch(eventAction) {
        case "#save":
            saveImage("#visits-blocks-widget",{});
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
        wnt.visits = result;
        if(this.isMounted()) {
            this.setState({
                visitsTotal: result.visits_total.units,
                visitsTotalCompareTo: result.visits_total_compareto_weekbefore.units,

                visitsGA: result.visits_ga.units,
                visitsGACompareTo: result.visits_ga_compareto_weekbefore.units,

                visitsGroups: result.visits_groups.units,
                visitsGroupsCompareTo: result.visits_groups_compareto_weekbefore.units,

                visitsMembers: result.visits_members.units,
                visitsMembersCompareTo: result.visits_members_compareto_weekbefore.units,

                visitsNonmembers: result.visits_nonmembers.units,
                visitsNonmembersCompareTo: result.visits_nonmembers_compareto_weekbefore.units,

                salesGate: result.sales_gate.amount,
                salesGateCompareTo: result.sales_gate_compareto_weekbefore.amount
            });
            // Set null data to '-'
            var self = this;
            $.each(this.state, function(stat, value){
                if(value === null){
                    var stateObject = function() {
                        var returnObj = {};
                        returnObj[stat] = '-';
                        return returnObj;
                    };
                    self.setState(stateObject);
                }
            });
            this.formatNumbers;
        }
	},
    componentDidMount: function() {
        var du = KUtils.date;
        var sameDayWeekBefore = du.serverFormat(du.addDays(wnt.today, -7));
        var sameDayLastYear = du.serverFormat(du.addDays(wnt.today, -(7*52) ));

		var queries = {
	        visits_total: { specs: { type: 'visits' }, periods: wnt.today },
	        visits_total_compareto_weekbefore: { specs: { type: 'visits' }, periods: sameDayWeekBefore },
	        visits_total_compareto_lastyear: { specs: { type: 'visits' }, periods: sameDayLastYear },            
	        visits_total_compareto_rolling: { specs: { type: 'visits'},
	            periods: {
	                from: wnt.yesterdaylastyear,
	                to: wnt.yesterday,
	                kind: 'average'
	            }
	        },

	        visits_ga: { specs: { type: 'visits', kinds: ['ga'] }, periods: wnt.today },
	        visits_ga_compareto_weekbefore: { specs: { type: 'visits', kinds: ['ga'] }, periods: sameDayWeekBefore },
	        visits_ga_compareto_lastyear: { specs: { type: 'visits', kinds: ['ga'] }, periods: sameDayLastYear },
	        visits_ga_compareto_rolling: { specs: { type: 'visits', kinds: ['ga'] }, 
	            periods: {
	                from: wnt.yesterdaylastyear,
	                to: wnt.yesterday,
	                kind: 'average'
	            }
	        },

	        visits_groups: { specs: { type: 'visits', kinds: ['group'] }, periods: wnt.today },
	        visits_groups_compareto_weekbefore: { specs: { type: 'visits', kinds: ['group'] }, periods: sameDayWeekBefore },
	        visits_groups_compareto_lastyear: { specs: { type: 'visits', kinds: ['group'] }, periods: sameDayLastYear },
	        visits_groups_compareto_rolling: { specs: { type: 'visits', kinds: ['group'] }, 
	            periods: {
	                from: wnt.yesterdaylastyear,
	                to: wnt.yesterday,
	                kind: 'average'
	            }
	        },

	        visits_members: { specs: { type: 'visits', kinds: ['membership'] }, periods: wnt.today },
	        visits_members_compareto_weekbefore: { specs: { type: 'visits', kinds: ['membership'] }, periods: sameDayWeekBefore },
	        visits_members_compareto_lastyear: { specs: { type: 'visits', kinds: ['membership'] }, periods: sameDayLastYear },
	        visits_members_compareto_rolling: { specs: { type: 'visits', kinds: ['membership'] },
	            periods: {
	                from: wnt.yesterdaylastyear,
	                to: wnt.yesterday,
	                kind: 'average'
	            }
	        },

	        visits_nonmembers: { specs: { type: 'visits', kinds: ['ga', 'group'] }, periods: wnt.today },
	        visits_nonmembers_compareto_weekbefore: { specs: { type: 'visits', kinds: ['ga', 'group'] }, periods: sameDayWeekBefore },
	        visits_nonmembers_compareto_lastyear: { specs: { type: 'visits', kinds: ['ga', 'group'] }, periods: sameDayLastYear },
	        visits_nonmembers_compareto_rolling: { specs: { type: 'visits', kinds: ['ga', 'group'] }, 
	            periods: {
	                from: wnt.yesterdaylastyear,
	                to: wnt.yesterday,
	                kind: 'average'
	            }
	        },

	        sales_gate: { specs: { type: 'sales', channel: 'gate' }, periods: wnt.today },
	        sales_gate_compareto_weekbefore: { specs: { type: 'sales', channel: 'gate' }, periods: sameDayWeekBefore },
	        sales_gate_compareto_lastyear: { specs: { type: 'sales', channel: 'gate' }, periods: sameDayLastYear },
	        sales_gate_compareto_rolling: { specs: { type: 'sales', channel: 'gate' },
	            periods: {
	                from: wnt.yesterdaylastyear,
	                to: wnt.yesterday,
	                kind: 'average'
	            }
	        }
		};
		
		KAPI.stats.query(
			wnt.venueID,
			queries,
			this.onStatsResult
		);
    },
    handleChange: function(event) {
        var filter = event.target.value;
        analytics.addEvent('Visits Blocks', 'Filter Changed', filter);
        if(filter === 'lastYear'){
            this.setState({
                visitsTotalCompareTo: wnt.visits.visits_total_compareto_lastyear.units,
                visitsGACompareTo: wnt.visits.visits_ga_compareto_lastyear.units,
                visitsGroupsCompareTo: wnt.visits.visits_groups_compareto_lastyear.units,
                visitsMembersCompareTo: wnt.visits.visits_members_compareto_lastyear.units,
                visitsNonmembersCompareTo: wnt.visits.visits_nonmembers_compareto_lastyear.units,
                salesGateCompareTo: wnt.visits.sales_gate_compareto_lastyear.amount
            });
        } else if(filter === 'lastYearAverage'){
            this.setState({
                visitsTotalCompareTo: wnt.visits.visits_total_compareto_rolling.units,
                visitsGACompareTo: wnt.visits.visits_ga_compareto_rolling.units,
                visitsGroupsCompareTo: wnt.visits.visits_groups_compareto_rolling.units,
                visitsMembersCompareTo: wnt.visits.visits_members_compareto_rolling.units,
                visitsNonmembersCompareTo: wnt.visits.visits_nonmembers_compareto_rolling.units,
                salesGateCompareTo: wnt.visits.sales_gate_compareto_rolling.amount
            });
        } else {
            this.setState({
                visitsTotalCompareTo: wnt.visits.visits_total_compareto_weekbefore.units,
                visitsGACompareTo: wnt.visits.visits_ga_compareto_weekbefore.units,
                visitsGroupsCompareTo: wnt.visits.visits_groups_compareto_weekbefore.units,
                visitsMembersCompareTo: wnt.visits.visits_members_compareto_weekbefore.units,
                visitsNonmembersCompareTo: wnt.visits.visits_nonmembers_compareto_weekbefore.units,
                salesGateCompareTo: wnt.visits.sales_gate_compareto_weekbefore.amount
            });
        }
        event.target.blur();
    },
    formatNumbers: function(){
        // Format numbers and set the direction of the change arrows
        $.each($('#visits-blocks-widget .stat-block'), function(index, statblock){
            var newstat = $(statblock).find('.stat');
            var oldstat = $(statblock).find('.compare-to');
            var change = $(statblock).find('svg');

            // Prevent number formatting from turning '-' into 'NaN' and thus '0' upon parsing
            var newstatNum, oldstatNum;
            if($(newstat).text() !== '-'){ newstatNum = $(newstat).parseNumber({format:"$#,###", locale:"us"}); };
            if($(oldstat).text() !== '-'){ oldstatNum = $(oldstat).parseNumber({format:"$#,###", locale:"us"}); };

            if(newstatNum > oldstatNum){
                $(change).attr('class','up');
            } else {
                $(change).attr('class','down');
            }

            if(index === 5){
                if($(newstat).text() !== '-'){
                    $(newstat).formatNumber({format:"$#,###", locale:"us"});
                }
                if($(oldstat).text() !== '-'){
                    $(oldstat).formatNumber({format:"$#,###", locale:"us"});
                }
            } else {
                if($(newstat).text() !== '-'){
                    $(newstat).formatNumber({format:"#,###", locale:"us"});
                }
                if($(oldstat).text() !== '-'){
                    $(oldstat).formatNumber({format:"#,###", locale:"us"});
                }
            }

            // New methos for handling '-' values so rounding isn't skipped and value doesn't disappear
            if($(newstat).text() === ''){ $(newstat).text('-'); };
            if($(oldstat).text() === ''){ $(oldstat).text('-'); };
        });
    },
    componentDidUpdate: function(){
        this.formatNumbers();
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
                <div className="row">
                    <div className="col-xs-6 col-sm-4 col-lg-2" id="visits-total">
                        <VisitsBlock 
                            label="Total Visitors" 
                            stat={this.state.visitsTotal} 
                            comparedTo={this.state.visitsTotalCompareTo} />
                    </div>
                    <div className="col-xs-6 col-sm-4 col-lg-2" id="visits-ga">
                        <VisitsBlock 
                            label="Gen Admission" 
                            stat={this.state.visitsGA} 
                            comparedTo={this.state.visitsGACompareTo} />
                    </div>
                    <div className="col-xs-6 col-sm-4 col-lg-2" id="visits-groups">
                        <VisitsBlock 
                            label="Groups" 
                            stat={this.state.visitsGroups} 
                            comparedTo={this.state.visitsGroupsCompareTo} />
                    </div>
                    <div className="col-xs-6 col-sm-4 col-lg-2" id="visits-members">
                        <VisitsBlock
                            label="Members"
                            stat={this.state.visitsMembers}
                            comparedTo={this.state.visitsMembersCompareTo} />
                    </div>
                    <div className="col-xs-6 col-sm-4 col-lg-2" id="visits-nonmembers">
                        <VisitsBlock
                            label="Non-members"
                            stat={this.state.visitsNonmembers}
                            comparedTo={this.state.visitsNonmembersCompareTo} />
                    </div>
                    <div className="col-xs-6 col-sm-4 col-lg-2" id="sales-gate">
                        <VisitsBlock
                            label="Total Gate"
                            stat={this.state.salesGate}
                            comparedTo={this.state.salesGateCompareTo} />
                    </div>
                </div>
            </div>
        );
    }
});
if(document.getElementById('visits-blocks-widget')){
    $.when(wnt.gettingVenueData).done(function(data) {
        React.render(
            <VisitsBlocksSet />,
            document.getElementById('visits-blocks-widget')
        );
        console.log('2) Visits blocks loaded...');
    });
}
