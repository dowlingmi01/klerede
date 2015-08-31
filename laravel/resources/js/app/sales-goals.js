/*********************************/
/******** SALES GOALS ROW ********/
/*********************************/

var SalesGoals = React.createClass({
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
            console.log('Sales Goals data loaded...');
            wnt.visits = result;
            if(this.isMounted()) {
                this.setState({
                    sample: result.myQuery.units
                });
            }
        }.bind(this))   // .bind() gives context to 'this'
        .fail(function(result) {
            console.log('SALES GOALS DATA ERROR! ... ' + result.statusText);
        });
    },
    render: function() {
        return (
            <div className="row">
                <div className="col-xs-6 col-md-6 arrow-connector-right">
                    <div className="widget" id="total-sales-goals">
                        <h2>Total Sales Goals</h2>
                        <div className="action-menu"><PlusSign className="plus-sign-menu" /></div>
                        <form>
                            <select className="form-control">
                                <option value="year">Current Year ({wnt.thisYear})</option>
                                <option value="quarter">Current Quarter ({wnt.thisQuarter})</option>
                                <option value="month">Current Month ({wnt.thisMonth})</option>
                                <option value="custom">Custom</option>
                            </select>
                        </form>
                        <div className="clear goal">Goal: <span className="goalAmount">$2,000,000</span></div>
                        <div className="goalStatus">Status: <span className="goalStatusText ahead">Ahead</span></div>
                        <div className="bar-meter clear"></div>
                    </div>
                </div>
                <div className="col-xs-6 col-md-6">
                    <div className="widget" id="earned-revenue-channels">
                        <h2>Earned Revenue Channels</h2>
                        <div className="action-menu"><PlusSign className="plus-sign-menu" /></div>
                        <form>
                            <select className="form-control">
                                <option value="dollars">Dollars</option>
                            </select>
                        </form>
                        <div id="div1" className="clear dial">
                            <div className="channel-info">
                                <div className="channel-name">Box Office</div>
                                <div className="channel-amount">$18,456</div>
                                <div className="channel-goal">Goal: $25,000</div>
                                <div className="channel-status behind">Behind</div>
                            </div>
                        </div>
                        <div id="div2" className="dial">
                            <div className="channel-info">
                                <div className="channel-name">Cafe</div>
                                <div className="channel-amount">$8,123</div>
                                <div className="channel-goal">Goal: $14,000</div>
                                <div className="channel-status ahead">Ahead</div>
                            </div>
                        </div>
                        <div id="div3" className="dial">
                            <div className="channel-info">
                                <div className="channel-name">Gift Store</div>
                                <div className="channel-amount">$10,123</div>
                                <div className="channel-goal">Goal: $18,000</div>
                                <div className="channel-status on-track">On Track</div>
                            </div>
                        </div>
                        <div id="div4" className="dial">
                            <div className="channel-info">
                                <div className="channel-name">Membership</div>
                                <div className="channel-amount">$4,123</div>
                                <div className="channel-goal">Goal: $6,000</div>
                                <div className="channel-status ahead">Ahead</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});

React.render(
    <SalesGoals source="/api/v1/stats/query" venueID="1588" />,   // TEMP STATIC VENUE ID
    document.getElementById('sales-goals-widget')
);

console.log('Sales Goals row loaded...');
