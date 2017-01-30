/***********************************************************/
/******** BOTTOM ROW OF STAT BLOCKS FOR MEMBERSHIPS ********/
/***********************************************************/


var React = require('react');
var ReactDOM = require('react-dom');


var $ = require ("jquery");
require('../libs/jquery.easing.1.3.js');

var wnt = require ('./kcomponents/wnt.js');

var KAPI = {
    stats:require("./kapi/stats.js")
};

var du = require("./kutils/date-utils.js");

var Caret = require('./svg-icons').Caret;
var ChangeArrow = require('./svg-icons').ChangeArrow;
var analytics = require("./analytics.js");


var ActionMenu = require('./reusable-parts').ActionMenu;
var printDiv = require ('./kutils/print-div.js');
var saveImage = require ('./kutils/save-image.js');



var MembersBlock = React.createClass({
    render: function() {
        
        var description = this.props.description || "";
        
        return (
            <div className="stat-block stats-bottom">
                <div className="label">{this.props.label}</div>
                <div className="description">{description}</div>
                <div className="stat">{this.props.stat}</div>
                <div className="change">
                    <ChangeArrow width="62" height="69" color="#000000" className="up" />
                    <span className="compare-to">{this.props.comparedTo}</span>
                </div>
            </div>
        );
    }
});

var MembersBlocksSet = React.createClass({
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
            
            membersConversion: '...',
            membersConversionCompareTo: '...',

            membersFrequency: '...',
            membersFrequencyCompareTo: '...',

            membersRecency: '...',
            membersRecencyCompareTo: '...',

            membersTotal: '...',
            membersTotalCompareTo: '...',

            membersCaptured: '...',
            membersCapturedCompareTo: '...',

            membersPercap: '...',
            membersPercapCompareTo: '...'
        };
    },
    onActionClick:function (event) {
        var eventAction = $(event.target).attr('href');
        switch(eventAction) {
        case "#save":
            saveImage("#members-blocks-widget",{}, "Membership Stats");
            break;
        case "#print":
            printDiv("#members-blocks-widget");
            break;
        default:
            return;
        }
        analytics.addEvent('Members Blocks', 'Plus Button Clicked', eventAction);
        event.preventDefault();
    },
	onStatsResult:function(result) {

        console.log(result);
        // Abbreviate numbers for total members block
        result.members_total_frequency_recency.current_members = this.abbrNumber(result.members_total_frequency_recency.current_members);
        result.members_total_frequency_recency_compareto_weekbefore.current_members = this.abbrNumber(result.members_total_frequency_recency_compareto_weekbefore.current_members);
        result.members_total_frequency_recency_compareto_lastyear.current_members = this.abbrNumber(result.members_total_frequency_recency_compareto_lastyear.current_members);
        result.members_total_frequency_recency_compareto_rolling.current_members = this.abbrNumber(result.members_total_frequency_recency_compareto_rolling.current_members);

        wnt.members = result;

        // Calculate Member Conversion
        wnt.members.members_conversion = (result.membership_sales.units / result.total_admissions.visits_unique) * 100;
        wnt.members.members_conversion_compareto_weekbefore = (result.membership_sales_compareto_weekbefore.units / result.total_admissions_compareto_weekbefore.visits_unique) * 100;
        wnt.members.members_conversion_compareto_lastyear = (result.membership_sales_compareto_lastyear.units / result.total_admissions_compareto_lastyear.visits_unique) * 100;
        wnt.members.members_conversion_compareto_rolling = (result.membership_sales_compareto_rolling.units / result.total_admissions_compareto_rolling.visits_unique) * 100;
        // Calculate Capture Rate
        wnt.members.capture_rate = (result.transactions.units / result.member_admissions.visits_unique) * 100;
        wnt.members.capture_rate_compareto_weekbefore = (result.transactions_compareto_weekbefore.units / result.member_admissions_compareto_weekbefore.visits_unique) * 100;
        wnt.members.capture_rate_compareto_lastyear = (result.transactions_compareto_lastyear.units / result.member_admissions_compareto_lastyear.visits_unique) * 100;
        wnt.members.capture_rate_compareto_rolling = (result.transactions_compareto_rolling.units / result.member_admissions_compareto_rolling.visits_unique) * 100;
        // Calculate Per Cap
        wnt.members.per_cap = result.transactions.amount / result.member_admissions.visits_unique;
        wnt.members.per_cap_compareto_weekbefore = result.transactions_compareto_weekbefore.amount / result.member_admissions_compareto_weekbefore.visits_unique;
        wnt.members.per_cap_compareto_lastyear = result.transactions_compareto_lastyear.amount / result.member_admissions_compareto_lastyear.visits_unique;
        wnt.members.per_cap_compareto_rolling = result.transactions_compareto_rolling.amount / result.member_admissions_compareto_rolling.visits_unique;

        if(this.isMounted()) {
            this.setState({

                membersConversion: wnt.members.members_conversion,
                membersConversionCompareTo: wnt.members.members_conversion_compareto_weekbefore,

                membersFrequency: result.members_total_frequency_recency.frequency,
                membersFrequencyCompareTo: result.members_total_frequency_recency_compareto_weekbefore.frequency,

                membersRecency: result.members_total_frequency_recency.recency,
                membersRecencyCompareTo: result.members_total_frequency_recency_compareto_weekbefore.recency,

                membersTotal: result.members_total_frequency_recency.current_members,
                membersTotalCompareTo: result.members_total_frequency_recency_compareto_weekbefore.current_members,

                membersCaptured: wnt.members.capture_rate,
                membersCapturedCompareTo: wnt.members.capture_rate_compareto_weekbefore,

                membersPercap: wnt.members.per_cap,
                membersPercapCompareTo: wnt.members.per_cap_compareto_weekbefore

            });
            // Set null data to '-'
            var self = this;
            $.each(this.state, function(stat, value){
                if(value === null){
                    var stateObject = function() {
                        returnObj = {};
                        returnObj[stat] = '-';
                        return returnObj;
                    };
                    self.setState(stateObject);
                }
            });
            this.formatNumbers;
        }
    },
	componentDidMount:function () {
        var sameDayWeekBefore = du.serverFormat(du.addDays(wnt.today, -7));
        var sameDayLastYear = du.serverFormat(du.addDays(wnt.today, -(7*52) ));
		
		var queries = {

            // Member Conversion = (Memberships Sold / Total Visitors) * 100
            membership_sales: { specs: { type: 'sales', channel: 'membership' }, periods: wnt.today},
            membership_sales_compareto_weekbefore: { specs: { type: 'sales', channel: 'membership' }, periods: sameDayWeekBefore},
            membership_sales_compareto_lastyear: { specs: { type: 'sales', channel: 'membership' }, periods: sameDayLastYear},
            membership_sales_compareto_rolling: { specs: { type: 'sales', channel: 'membership' },
                periods: {
                    from: wnt.yesterdaylastyear,
                    to: wnt.yesterday,
                    kind: 'average'
                }
            },

            // Capture Rate = (Members Transactions / Members Visitors) * 100
            // Per Cap = Store Sales to members / Members Visitors
            transactions: { specs: { type: 'sales', channel: 'store', members:true }, periods: wnt.today},
            transactions_compareto_weekbefore: { specs: { type: 'sales', channel: 'store', members:true }, periods: sameDayWeekBefore},
            transactions_compareto_lastyear: { specs: { type: 'sales', channel: 'store', members:true }, periods: sameDayLastYear},
            transactions_compareto_rolling: { specs: { type: 'sales', channel: 'store', members:true },
                periods: {
                    from: wnt.yesterdaylastyear,
                    to: wnt.yesterday,
                    kind: 'average'
                }
            },

            total_admissions: { specs: { type: 'visits' }, periods: wnt.today },
            total_admissions_compareto_weekbefore: { specs: { type: 'visits' }, periods: sameDayWeekBefore },
            total_admissions_compareto_lastyear: { specs: { type: 'visits' }, periods: sameDayLastYear },
            total_admissions_compareto_rolling: { specs: { type: 'visits' },
                periods: {
                    from: wnt.yesterdaylastyear,
                    to: wnt.yesterday,
                    kind: 'average'
                }
            },

            member_admissions: { specs: { type: 'visits', kinds: ['membership']  }, periods: wnt.today },
            member_admissions_compareto_weekbefore: { specs: { type: 'visits', kinds: ['membership'] }, periods: sameDayWeekBefore },
            member_admissions_compareto_lastyear: { specs: { type: 'visits', kinds: ['membership'] }, periods: sameDayLastYear },
            member_admissions_compareto_rolling: { specs: { type: 'visits', kinds: ['membership'] },
                periods: {
                    from: wnt.yesterdaylastyear,
                    to: wnt.yesterday,
                    kind: 'average'
                }
            },

            members_total_frequency_recency: { specs: { type: 'members' }, periods: wnt.today },
            members_total_frequency_recency_compareto_weekbefore: { specs: { type: 'members' }, periods: sameDayWeekBefore },
            members_total_frequency_recency_compareto_lastyear: { specs: { type: 'members' }, periods: sameDayLastYear },
            members_total_frequency_recency_compareto_rolling: { specs: { type: 'members'},
                periods: {
                    from: wnt.yesterdaylastyear,
                    to: wnt.yesterday,
                    kind: 'average'
                }
            }
        };

		console.log(queries);
		KAPI.stats.query(wnt.venueID, queries, this.onStatsResult);
		
	},
    handleChange: function(event) {
        var filter = event.target.value;
        analytics.addEvent('Members Blocks', 'Filter Changed', filter);
        if(filter === 'lastYear'){
            this.setState({
                membersConversionCompareTo: wnt.members.members_conversion_compareto_lastyear,
                membersFrequencyCompareTo: wnt.members.members_total_frequency_recency_compareto_lastyear.frequency,
                membersRecencyCompareTo: wnt.members.members_total_frequency_recency_compareto_lastyear.recency,
                membersTotalCompareTo: wnt.members.members_total_frequency_recency_compareto_lastyear.current_members,
                membersCapturedCompareTo: wnt.members.capture_rate_compareto_lastyear,
                membersPercapCompareTo: wnt.members.per_cap_compareto_lastyear
            });
        } else if(filter === 'lastYearAverage'){
            this.setState({
                membersConversionCompareTo: wnt.members.members_conversion_compareto_rolling,
                membersFrequencyCompareTo: wnt.members.members_total_frequency_recency_compareto_rolling.frequency,
                membersRecencyCompareTo: wnt.members.members_total_frequency_recency_compareto_rolling.recency,
                membersTotalCompareTo: wnt.members.members_total_frequency_recency_compareto_rolling.current_members,
                membersCapturedCompareTo: wnt.members.capture_rate_compareto_rolling,
                membersPercapCompareTo: wnt.members.per_cap_compareto_rolling
            });
        } else {
            this.setState({
                membersConversionCompareTo: wnt.members.members_conversion_compareto_weekbefore,
                membersFrequencyCompareTo: wnt.members.members_total_frequency_recency_compareto_weekbefore.frequency,
                membersRecencyCompareTo: wnt.members.members_total_frequency_recency_compareto_weekbefore.recency,
                membersTotalCompareTo: wnt.members.members_total_frequency_recency_compareto_weekbefore.current_members,
                membersCapturedCompareTo: wnt.members.capture_rate_compareto_weekbefore,
                membersPercapCompareTo: wnt.members.per_cap_compareto_weekbefore
            });
        }
        event.target.blur();
    },
    abbrNumber: function(number) {
        number = Math.round((number / 1000) * 10) / 10;
        return number;
    },
    formatNumbers: function(){
        // Format numbers and set the direction of the change arrows
        $.each($('#members-blocks-widget .stat-block'), function(index, statblock){
            var newstat = $(statblock).find('.stat');
            var oldstat = $(statblock).find('.compare-to');

            $(newstat).find(".units").remove();
            $(oldstat).find(".units").remove();
            
            var change = $(statblock).find('svg');
            if( ($(newstat).html() !== '-') && ($(oldstat).html() !== '-') ){
                if($(newstat).parseNumber({format:"#,##0", locale:"us"}) > $(oldstat).parseNumber({format:"#,##0", locale:"us"})){
                    $(change).attr('class','up');
                } else {
                    $(change).attr('class','down');
                }
                $(newstat).formatNumber({format:"#,##0.0", locale:"us"});
                $(oldstat).formatNumber({format:"#,##0.0", locale:"us"});

                if($(statblock).parent().hasClass("dollars")) {
                    $(newstat).html("<div class='units dollars'>$</div>"+$(newstat).html());
                    $(oldstat).html("$"+$(oldstat).html());
                };
                if($(statblock).parent().hasClass("percent")) {
                    $(newstat).html($(newstat).html()+"<div class='units percent'>%</div>");
                    $(oldstat).html($(oldstat).html()+"%");
                };
                if($(statblock).parent().hasClass("kilo")) {
                    $(newstat).html($(newstat).html()+"<div class='units kilo'>k</div>");
                    $(oldstat).html($(oldstat).html()+"k");
                };
            }
        });
    },
    componentDidUpdate: function(){
        this.formatNumbers();
        $('#members-blocks-widget .up').css('top','35px')
            .animate({
                top: '0'
            },
            700,
            'easeOutBounce'
        );
        $('#members-blocks-widget .down').css('top','-35px')
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
                    <div className="col-xs-6 col-sm-4 col-lg-2 percent" id="members-conversion">
                        <MembersBlock 
                            label="Member Conversion"
                            description="Guests that become members"
                            stat={this.state.membersConversion} 
                            comparedTo={this.state.membersConversionCompareTo} />
                    </div>
                    <div className="col-xs-6 col-sm-4 col-lg-2" id="members-frequency">
                        <MembersBlock 
                            label="Member Frequency"
                            description="# of visits per year"
                            stat={this.state.membersFrequency} 
                            comparedTo={this.state.membersFrequencyCompareTo} />
                    </div>
                    <div className="col-xs-6 col-sm-4 col-lg-2" id="members-recency">
                        <MembersBlock
                            label="Member Recency"
                            description="Time since last visit (days)"
                            stat={this.state.membersRecency}
                            comparedTo={this.state.membersRecencyCompareTo} />
                    </div>
                    <div className="col-xs-6 col-sm-4 col-lg-2 kilo" id="members-total">
                        <MembersBlock
                            label="Members"
                            description="Total #"
                            stat={this.state.membersTotal}
                            comparedTo={this.state.membersTotalCompareTo} />
                    </div>
                    <div className="col-xs-6 col-sm-4 col-lg-2 percent" id="members-captured">
                        <MembersBlock 
                            label="Member Capture Rate" 
                            description="% that purchased at gift store" 
                            stat={this.state.membersCaptured} 
                            comparedTo={this.state.membersCapturedCompareTo} />
                    </div>
                    <div className="col-xs-6 col-sm-4 col-lg-2 dollars" id="members-percap">
                        <MembersBlock
                            label="Member Per Cap"
                            description="$ amount spent at gift store"
                            stat={this.state.membersPercap}
                            comparedTo={this.state.membersPercapCompareTo} />
                    </div>
                </div>
            </div>
        );
    }
});

if(document.getElementById('members-blocks-widget')){
    $.when(wnt.gettingVenueData).done(function(data) {
        ReactDOM.render(
            <MembersBlocksSet />,
            document.getElementById('members-blocks-widget')
        );
        console.log('2) Members blocks loaded...');
    });
}
