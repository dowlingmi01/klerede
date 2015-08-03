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
            visitsDate: wnt.yesterday,
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
                    visits_total: { specs: { type: 'visits' }, periods: '2015-05-06' },  //  this.state.visitsDate
                    visits_ga: { specs: { type: 'visits', kinds: ['ga'] }, periods: this.state.visitsDate },
                    visits_groups: { specs: { type: 'visits', kinds: ['group'] }, periods: '2015-05-06' },
                    visits_members: { specs: { type: 'visits', kinds: ['membership'] }, periods: '2015-05-06' },
                    visits_nonmembers: { specs: { type: 'visits', kinds: ['ga', 'group'] }, periods: '2015-05-06' },
                    sales_gate: { specs: { type: 'sales', channel: 'gate' }, periods: '2015-05-06' }
                }
            }
        )
        .done(function(result) {
            console.log('Visits data loaded...');
            if(this.isMounted()) {
                // TO DO: Run null checks here???
                this.setState({
                    visitsTotal: result.visits_total.units,
                    visitsGA: result.visits_ga.units,
                    visitsGroups: result.visits_groups.units,
                    visitsMembers: result.visits_members.units,
                    visitsNonmembers: result.visits_nonmembers.units,
                    salesGate: result.sales_gate.amount
                });
                console.log('visitsGA for this date when isMounted = ' + this.state.visitsGA);
                if(this.state.visitsGA === null){
                    console.log('Tis null with no quotes');
                    //this.setState({ visitsGA: 'No Data' });   // Creates weird behavior ... zeros for 4 stats (first two and last two)
                }
            }
        }.bind(this))   // .bind() gives context to 'this' for this.isMounted to work since 'this' would have been the React component's 'this'
        .fail(function(result) {
            console.log('VISITS DATA ERROR!');
            console.log(result);
        });
        console.log('visitsDate = ' + this.state.visitsDate);
        console.log('visitsGA for this date = ' + this.state.visitsGA);
    },
    componentDidUpdate: function() {
        $('#visits-total .stat').formatNumber({format:"#,###", locale:"us"});
        $('#visits-ga .stat').formatNumber({format:"#,###", locale:"us"});
        $('#visits-groups .stat').formatNumber({format:"#,###", locale:"us"});
        $('#visits-members .stat').formatNumber({format:"#,###", locale:"us"});
        $('#visits-nonmembers .stat').formatNumber({format:"#,###", locale:"us"});
        $('#sales-gate .stat').formatNumber({format:"$#,###", locale:"us"});
        console.log('visitsGA for this date on componentDidUpdate = ' + this.state.visitsGA);
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
