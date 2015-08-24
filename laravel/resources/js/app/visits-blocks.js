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
                    <ChangeArrow width="62" height="69" color="#ffffff" className="up" />
                    <span className="compare-to">{this.props.comparedTo}</span>
                </div>
            </div>
        );
    }
});

var VisitsBlocksSet = React.createClass({
    getInitialState: function() {
        return {
            visitsDate: '2015-05-06',   // TEMP STATIC DATE: Should be wnt.yesterday
            visitsDayBefore: '2015-05-05',   // TEMP STATIC DATE: Should be wnt.daybeforeyesterday
            visitsDayLastYear: '2014-05-06',   // TEMP STATIC DATE: Should be wnt.yesterdaylastyear
            
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
    componentDidMount: function() {
        $.post(
            this.props.source,
            {
                venue_id: this.props.venueID,
                queries: {
                    visits_total: { specs: { type: 'visits' }, periods: this.state.visitsDate },
                    visits_total_compareto_daybefore: { specs: { type: 'visits' }, periods: this.state.visitsDayBefore },
                    visits_total_compareto_lastyear: { specs: { type: 'visits' }, periods: this.state.visitsDayLastYear },            
                    visits_total_compareto_rolling: { specs: { type: 'visits'},
                        periods: {
                            from: this.state.visitsDayLastYear,
                            to: this.state.visitsDate,
                            kind: 'average'
                        }
                    },


                    visits_ga: { specs: { type: 'visits', kinds: ['ga'] }, periods: this.state.visitsDate },
                    visits_ga_compareto_daybefore: { specs: { type: 'visits', kinds: ['ga'] }, periods: this.state.visitsDayBefore },
                    visits_ga_compareto_lastyear: { specs: { type: 'visits', kinds: ['ga'] }, periods: this.state.visitsDayLastYear },
                    visits_ga_compareto_rolling: { specs: { type: 'visits', kinds: ['ga'] }, 
                        periods: {
                            from: this.state.visitsDayLastYear,
                            to: this.state.visitsDate,
                            kind: 'average'
                        }
                    },


                    visits_groups: { specs: { type: 'visits', kinds: ['group'] }, periods: this.state.visitsDate },
                    visits_groups_compareto_daybefore: { specs: { type: 'visits', kinds: ['group'] }, periods: this.state.visitsDayBefore },
                    visits_groups_compareto_lastyear: { specs: { type: 'visits', kinds: ['group'] }, periods: this.state.visitsDayLastYear },
                    visits_groups_compareto_rolling: { specs: { type: 'visits', kinds: ['group'] }, 
                        periods: {
                            from: this.state.visitsDayLastYear,
                            to: this.state.visitsDate,
                            kind: 'average'
                        }
                    },


                    visits_members: { specs: { type: 'visits', kinds: ['membership'] }, periods: this.state.visitsDate },
                    visits_members_compareto_daybefore: { specs: { type: 'visits', kinds: ['membership'] }, periods: this.state.visitsDayBefore },
                    visits_members_compareto_lastyear: { specs: { type: 'visits', kinds: ['membership'] }, periods: this.state.visitsDayLastYear },
                    visits_members_compareto_rolling: { specs: { type: 'visits', kinds: ['membership'] },
                        periods: {
                            from: this.state.visitsDayLastYear,
                            to: this.state.visitsDate,
                            kind: 'average'
                        }
                    },


                    visits_nonmembers: { specs: { type: 'visits', kinds: ['ga', 'group'] }, periods: this.state.visitsDate },
                    visits_nonmembers_compareto_daybefore: { specs: { type: 'visits', kinds: ['ga', 'group'] }, periods: this.state.visitsDayBefore },
                    visits_nonmembers_compareto_lastyear: { specs: { type: 'visits', kinds: ['ga', 'group'] }, periods: this.state.visitsDayLastYear },
                    visits_nonmembers_compareto_rolling: { specs: { type: 'visits', kinds: ['ga', 'group'] }, 
                        periods: {
                            from: this.state.visitsDayLastYear,
                            to: this.state.visitsDate,
                            kind: 'average'
                        }
                    },


                    sales_gate: { specs: { type: 'sales', channel: 'gate' }, periods: this.state.visitsDate },
                    sales_gate_compareto_daybefore: { specs: { type: 'sales', channel: 'gate' }, periods: this.state.visitsDayBefore },
                    sales_gate_compareto_lastyear: { specs: { type: 'sales', channel: 'gate' }, periods: this.state.visitsDayLastYear },
                    sales_gate_compareto_rolling: { specs: { type: 'sales', channel: 'gate' },
                        periods: {
                            from: '2014-05-06',
                            to: '2015-05-06',
                            kind: 'average'
                        }
                    }

                }
            }
        )
        .done(function(result) {
            console.log('Visits data loaded...');
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
        }.bind(this))   // .bind() gives context to 'this' for this.isMounted to work since 'this' would have been the React component's 'this'
        .fail(function(result) {
            console.log('VISITS DATA ERROR!');
            console.log(result);
        });
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
    },
    formatNumbers: function(){
        // Format numbers and set the direction of the change arrows
        $.each($('#visits-blocks-widget .stat-block'), function(index, statblock){
            var newstat = $(statblock).find('.stat');
            var oldstat = $(statblock).find('.compare-to');
            var change = $(statblock).find('svg');
            if( ($(newstat).html() !== '-') && ($(oldstat).html() !== '-') ){
                if($(newstat).parseNumber({format:"$#,###", locale:"us"}) > $(oldstat).parseNumber({format:"$#,###", locale:"us"})){
                    $(change).attr('class','up');
                } else {
                    $(change).attr('class','down');
                }
                if(index === 5){
                    $(newstat).formatNumber({format:"$#,###", locale:"us"});
                    $(oldstat).formatNumber({format:"$#,###", locale:"us"});
                } else {
                    $(newstat).formatNumber({format:"#,###", locale:"us"});
                    $(oldstat).formatNumber({format:"#,###", locale:"us"});
                }
            }
        });
    },
    componentDidUpdate: function(){
        this.formatNumbers();
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

React.render(
    <VisitsBlocksSet source="/api/v1/stats/query" venueID="1588" />,   // TEMP STATIC VENUE ID
    document.getElementById('visits-blocks-widget')
);

console.log('Visits blocks loaded...');
