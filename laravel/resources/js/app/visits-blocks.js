/***************************************************/
/******** TOP ROW OF STAT BLOCKS FOR VISITS ********/
/***************************************************/

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
        return {
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
	onStatsResult:function (result) {
        console.log('Visits data loaded using KAPI...');
        wnt.visits = result;
        if(this.isMounted()) {
            this.setState({
                visitsTotal: result.visits_total.units,
                visitsTotalCompareTo: result.visits_total_compareto_daybefore.units,

                visitsGA: result.visits_ga.units,
                visitsGACompareTo: result.visits_ga_compareto_daybefore.units,

                visitsGroups: result.visits_groups.units,
                visitsGroupsCompareTo: result.visits_groups_compareto_daybefore.units,

                visitsMembers: result.visits_members.units,
                visitsMembersCompareTo: result.visits_members_compareto_daybefore.units,

                visitsNonmembers: result.visits_nonmembers.units,
                visitsNonmembersCompareTo: result.visits_nonmembers_compareto_daybefore.units,

                salesGate: result.sales_gate.amount,
                salesGateCompareTo: result.sales_gate_compareto_daybefore.amount
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
    componentDidMount: function() {
		KAPI.stats.query(
			wnt.venueID,
			{
                visits_total: { specs: { type: 'visits' }, periods: wnt.yesterday },
                visits_total_compareto_daybefore: { specs: { type: 'visits' }, periods: wnt.daybeforeyesterday },
                visits_total_compareto_lastyear: { specs: { type: 'visits' }, periods: wnt.yesterdaylastyear },            
                visits_total_compareto_rolling: { specs: { type: 'visits'},
                    periods: {
                        from: wnt.yesterdaylastyear,
                        to: wnt.yesterday,
                        kind: 'average'
                    }
                },

                visits_ga: { specs: { type: 'visits', kinds: ['ga'] }, periods: wnt.yesterday },
                visits_ga_compareto_daybefore: { specs: { type: 'visits', kinds: ['ga'] }, periods: wnt.daybeforeyesterday },
                visits_ga_compareto_lastyear: { specs: { type: 'visits', kinds: ['ga'] }, periods: wnt.yesterdaylastyear },
                visits_ga_compareto_rolling: { specs: { type: 'visits', kinds: ['ga'] }, 
                    periods: {
                        from: wnt.yesterdaylastyear,
                        to: wnt.yesterday,
                        kind: 'average'
                    }
                },

                visits_groups: { specs: { type: 'visits', kinds: ['group'] }, periods: wnt.yesterday },
                visits_groups_compareto_daybefore: { specs: { type: 'visits', kinds: ['group'] }, periods: wnt.daybeforeyesterday },
                visits_groups_compareto_lastyear: { specs: { type: 'visits', kinds: ['group'] }, periods: wnt.yesterdaylastyear },
                visits_groups_compareto_rolling: { specs: { type: 'visits', kinds: ['group'] }, 
                    periods: {
                        from: wnt.yesterdaylastyear,
                        to: wnt.yesterday,
                        kind: 'average'
                    }
                },

                visits_members: { specs: { type: 'visits', kinds: ['membership'] }, periods: wnt.yesterday },
                visits_members_compareto_daybefore: { specs: { type: 'visits', kinds: ['membership'] }, periods: wnt.daybeforeyesterday },
                visits_members_compareto_lastyear: { specs: { type: 'visits', kinds: ['membership'] }, periods: wnt.yesterdaylastyear },
                visits_members_compareto_rolling: { specs: { type: 'visits', kinds: ['membership'] },
                    periods: {
                        from: wnt.yesterdaylastyear,
                        to: wnt.yesterday,
                        kind: 'average'
                    }
                },

                visits_nonmembers: { specs: { type: 'visits', kinds: ['ga', 'group'] }, periods: wnt.yesterday },
                visits_nonmembers_compareto_daybefore: { specs: { type: 'visits', kinds: ['ga', 'group'] }, periods: wnt.daybeforeyesterday },
                visits_nonmembers_compareto_lastyear: { specs: { type: 'visits', kinds: ['ga', 'group'] }, periods: wnt.yesterdaylastyear },
                visits_nonmembers_compareto_rolling: { specs: { type: 'visits', kinds: ['ga', 'group'] }, 
                    periods: {
                        from: wnt.yesterdaylastyear,
                        to: wnt.yesterday,
                        kind: 'average'
                    }
                },

                sales_gate: { specs: { type: 'sales', channel: 'gate' }, periods: wnt.yesterday },
                sales_gate_compareto_daybefore: { specs: { type: 'sales', channel: 'gate' }, periods: wnt.daybeforeyesterday },
                sales_gate_compareto_lastyear: { specs: { type: 'sales', channel: 'gate' }, periods: wnt.yesterdaylastyear },
                sales_gate_compareto_rolling: { specs: { type: 'sales', channel: 'gate' },
                    periods: {
                        from: wnt.yesterdaylastyear,
                        to: wnt.yesterday,
                        kind: 'average'
                    }
                }
        	},
			this.onStatsResult
		);
    },
    handleChange: function(event) {
        var filter = event.target.value;
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
                visitsTotalCompareTo: wnt.visits.visits_total_compareto_daybefore.units,
                visitsGACompareTo: wnt.visits.visits_ga_compareto_daybefore.units,
                visitsGroupsCompareTo: wnt.visits.visits_groups_compareto_daybefore.units,
                visitsMembersCompareTo: wnt.visits.visits_members_compareto_daybefore.units,
                visitsNonmembersCompareTo: wnt.visits.visits_nonmembers_compareto_daybefore.units,
                salesGateCompareTo: wnt.visits.sales_gate_compareto_daybefore.amount
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
                    <div className="col-xs-12 col-sm-8 col-lg-4">
                        <div className="filter">
                            <form>
                                <select className="form-control" onChange={this.handleChange}>
                                    <option value="twoDays">Trend over last two days</option>
                                    <option value="lastYear">Yesterday compared to same day last year</option>
                                    <option value="lastYearAverage">Yesterday compared to average for the past year</option>
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
