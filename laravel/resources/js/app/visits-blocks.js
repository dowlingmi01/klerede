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
            visitsDate: '2015-05-06',   // TEMP STATIC DATE: Should be wnt.yesterday  ...  also have wnt.daybeforeyesterday now
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
                    visits_total: { specs: { type: 'visits' }, periods: this.state.visitsDate },
                    visits_ga: { specs: { type: 'visits', kinds: ['ga'] }, periods: this.state.visitsDate },
                    visits_groups: { specs: { type: 'visits', kinds: ['group'] }, periods: this.state.visitsDate },
                    visits_members: { specs: { type: 'visits', kinds: ['membership'] }, periods: this.state.visitsDate },
                    visits_nonmembers: { specs: { type: 'visits', kinds: ['ga', 'group'] }, periods: this.state.visitsDate },
                    sales_gate: { specs: { type: 'sales', channel: 'gate' }, periods: this.state.visitsDate },
                    /* Need last year, rolling year average, and day before
                    - "Trend over last two days"
                    - "Yesterday compared to same day last year"
                    - "Yesterday compared to average for 2015"
                    periods: {
                        type: 'date' (default) / 'week' / 'month' / 'quarter' / 'year'
                        period: XXXX-XX / from: XXXX-XX, to: XXXX-XX
                        subperiod (optional): 'date' / 'week' / 'month' / 'quarter'
                        kind: 'detail' (default) / 'sum' / 'average'
                    }
                    */
                    visits_total_compare_daybefore: { specs: { type: 'visits' }, periods: '2015-05-05' },
                    visits_total_compare_lastyear: { specs: { type: 'visits' }, periods: '2014-05-06' },            
                    /* NOTE: Sergio said average isn't ready yet */
                    visits_total_compare_rolling: { specs: { type: 'visits' }, periods: {
                        period: {
                            from: '2014-05-06',
                            to: '2015-05-06'
                        },
                        kind: 'average'
                    } }
                }
            }
        )
        .done(function(result) {
            console.log('Visits data loaded...');
            console.log(result);
            if(this.isMounted()) {
                this.setState({
                    visitsTotal: result.visits_total.units,
                    visitsGA: result.visits_ga.units,
                    visitsGroups: result.visits_groups.units,
                    visitsMembers: result.visits_members.units,
                    visitsNonmembers: result.visits_nonmembers.units,
                    salesGate: result.sales_gate.amount
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

var VisitsBlocksFilter = React.createClass({
    handleChange: function(event) {
        console.log('FILTER CHANGED!!!');
    },
    render: function() {
        return (
            <div className="filter">
                <form>
                    <select className="form-control" onChange={this.handleChange}>
                        <option>Trend over last two days</option>
                        <option>Yesterday compared to same day last year</option>
                        <option>Yesterday compared to average for the past year</option>
                    </select>
                </form>
               
            </div>
        );
    }
});

React.render(
    <VisitsBlocksSet source="/api/v1/stats/query" venueID="1588" />,
    document.getElementById('visits-blocks-set')
);

React.render(
    <VisitsBlocksFilter />,
    document.getElementById('visits-blocks-filter')
);

console.log('Visits blocks loaded...');
