/******** The top row of stat blocks for visits. ********/

var VisitsBlock = React.createClass({
    render: function() {
        return (
            <div className="stat-block">
                <div className="label">{this.props.label}</div>
                <div className="stat">{this.props.stat}</div>
                <div className="change">
                    <ChangeArrow width="62" height="69" color="#ffffff" className={this.props.changeDirection} />
                    {this.props.tempData}
                </div>
            </div>
        );
    }
});

var VisitsBlocksSet = React.createClass({
    getInitialState: function() {
        return {
            visitsDate: '2015-05-06',   // TEMP STATIC DATE: Should be wnt.yesterday
            visitsTotal: '...',
            visitsGA: '...',
            visitsGroups: '...',
            visitsMembers: '...',
            visitsNonmembers: '...',
            salesGate: '...'
        };
    },
    componentDidMount: function() {
        $.post(
            this.props.source,
            {
                venue_id: this.props.venueID,
                queries: {
                    visits_total: { specs: { type: 'visits' }, periods: this.state.visitsDate },  //  this.state.visitsDate
                    visits_ga: { specs: { type: 'visits', kinds: ['ga'] }, periods: '2015-07-31' },
                    visits_groups: { specs: { type: 'visits', kinds: ['group'] }, periods: this.state.visitsDate },
                    visits_members: { specs: { type: 'visits', kinds: ['membership'] }, periods: this.state.visitsDate },
                    visits_nonmembers: { specs: { type: 'visits', kinds: ['ga', 'group'] }, periods: this.state.visitsDate },
                    sales_gate: { specs: { type: 'sales', channel: 'gate' }, periods: this.state.visitsDate }
                }
            }
        )
        .done(function(result) {
            console.log('Visits data loaded...');
            if(this.isMounted()) {
                this.setState({
                    visitsTotal: result.visits_total.units,
                    visitsGA: result.visits_ga.units,
                    visitsGroups: result.visits_groups.units,
                    visitsMembers: result.visits_members.units,
                    visitsNonmembers: result.visits_nonmembers.units,
                    salesGate: result.sales_gate.amount
                });
                // Set null data to 'No Data'
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
                // Format numbers
                $.each($('#visits-blocks-set .stat'), function(index,stat){
                    if($(stat).html() !== '-'){
                        if(index === 5){
                            $(stat).formatNumber({format:"$#,###", locale:"us"});
                        } else {
                            $(stat).formatNumber({format:"#,###", locale:"us"});
                        }
                    }
                });
            }
        }.bind(this))   // .bind() gives context to 'this' for this.isMounted to work since 'this' would have been the React component's 'this'
        .fail(function(result) {
            console.log('VISITS DATA ERROR!');
            console.log(result);
        });
    },
    render: function() {
        return (
            <div className="row">
                <div className="col-xs-6 col-sm-4 col-lg-2" id="visits-total">
                    <VisitsBlock 
                        label="Total Visitors" 
                        stat={this.state.visitsTotal} 
                        tempData="9,980" 
                        changeDirection="up" />
                </div>
                <div className="col-xs-6 col-sm-4 col-lg-2" id="visits-ga">
                    <VisitsBlock 
                        label="Gen Admission" 
                        stat={this.state.visitsGA} 
                        tempData="9,456" 
                        changeDirection="up" />
                </div>
                <div className="col-xs-6 col-sm-4 col-lg-2" id="visits-groups">
                    <VisitsBlock 
                        label="Groups" 
                        stat={this.state.visitsGroups} 
                        tempData="4,640" 
                        changeDirection="down" />
                </div>
                <div className="col-xs-6 col-sm-4 col-lg-2" id="visits-members">
                    <VisitsBlock
                        label="Members"
                        stat={this.state.visitsMembers}
                        tempData="5,220"
                        changeDirection="up" />
                </div>
                <div className="col-xs-6 col-sm-4 col-lg-2" id="visits-nonmembers">
                    <VisitsBlock
                        label="Non-members"
                        stat={this.state.visitsNonmembers}
                        tempData="4,340"
                        changeDirection="down" />
                </div>
                <div className="col-xs-6 col-sm-4 col-lg-2" id="sales-gate">
                    <VisitsBlock
                        label="Total Gate"
                        stat={this.state.salesGate}
                        tempData="$13,102"
                        changeDirection="up" />
                </div>
            </div>
        );
    }
});

React.render(
    <VisitsBlocksSet source="/api/v1/stats/query" venueID="1588" />,
    document.getElementById('visits-blocks-set')
);

console.log('Visits blocks loaded...');
