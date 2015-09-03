/**************************************/
/******** MEMBERSHIP GOALS ROW ********/
/**************************************/

var MembershipGoals = React.createClass({
    getInitialState: function() {
        return {
            visitsDate: '2015-05-06',   // TEMP STATIC DATE: Should be wnt.yesterday
            sample: 'value'
        };
    },
    componentDidMount: function() {
        $.post(
            this.props.source,
            {
                venue_id: this.props.venueID,
                queries: {
                    myQuery: { specs: { type: 'visits' }, periods: this.state.visitsDate }
                }
            }
        )
        .done(function(result) {
            console.log('Membership Goals data loaded...');
            wnt.visits = result;
            if(this.isMounted()) {
                this.setState({
                    sample: result.myQuery.units
                });
            }
        }.bind(this))   // .bind() gives context to 'this'
        .fail(function(result) {
            console.log('MEMBERSHIP GOALS DATA ERROR! ... ' + result.statusText);
        });
    },
    render: function() {
        return (
            <div className="row">
                <div className="col-xs-6 col-md-6 arrow-connector-right">
                    <div className="widget" id="total-membership-goals">
                        <h2>Total Membership Goals</h2>
                        <ActionMenu />
                        <form>
                            <select className="form-control">
                                <option value="year">Current Year ({wnt.thisYear})</option>
                                <option value="quarter">Current Quarter ({wnt.thisQuarter})</option>
                                <option value="month">Current Month ({wnt.thisMonth})</option>
                                <option value="custom">Custom</option>
                            </select>
                            <Caret className="filter-caret" />
                        </form>
                        <div className="clear goal">Membership Goal: <span className="goalAmount">#4,500</span></div>
                        <div className="goalStatus">Status: <span className="goalStatusText behind">Behind</span></div>
                        <div className="bar-meter clear"></div>
                    </div>
                </div>
                <div className="col-xs-6 col-md-6">
                    <div className="widget" id="membership">
                        <h2>Membership / Donors</h2>
                        <ActionMenu />
                        <form>
                            <select className="form-control">
                                <option value="dollars">Dollars</option>
                            </select>
                            <Caret className="filter-caret" />
                        </form>
                        <div id="div5" className="clear dial">
                            <div className="channel-info">
                                <div className="channel-name">Individual</div>
                                <div className="channel-amount">$75,566</div>
                                <div className="channel-goal">Goal: $125,000</div>
                                <div className="channel-status ahead">Ahead</div>
                            </div>
                        </div>
                        <div id="div6" className="dial">
                            <div className="channel-info">
                                <div className="channel-name">Family</div>
                                <div className="channel-amount">$18,123</div>
                                <div className="channel-goal">Goal: $90,000</div>
                                <div className="channel-status on-track">On Track</div>
                            </div>
                        </div>
                        <div id="div7" className="dial">
                            <div className="channel-info">
                                <div className="channel-name">Donor</div>
                                <div className="channel-amount">$25,123</div>
                                <div className="channel-goal">Goal: $180,000</div>
                                <div className="channel-status on-track">On Track</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});

React.render(
    <MembershipGoals source="/api/v1/stats/query" venueID="1588" />,   // TEMP STATIC VENUE ID
    document.getElementById('membership-goals-widget')
);

console.log('Membership Goals row loaded...');
