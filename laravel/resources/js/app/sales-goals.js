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
                        <div className="action-menu">+</div>
                        <form>
                            <select className="form-control">
                                <option>XYZ</option>
                                <option>XYZ</option>
                            </select>
                        </form>
                        <div className="clear">Goal: $2,000,000</div>
                        <div>Status: Ahead</div>
                        <div className="bar-meter"></div>
                    </div>
                </div>
                <div className="col-xs-6 col-md-6">
                    <div className="widget" id="earned-revenue-channels">
                        <h2>Earned Revenue Channels</h2>
                        <div className="action-menu">+</div>
                        <form>
                            <select className="form-control">
                                <option>XYZ</option>
                                <option>XYZ</option>
                            </select>
                        </form>
                        <div id="div1" className="clear"></div>
                        <div>
                            Box Office
                            $18,456
                            Goal: $25,000
                            Behind
                        </div>
                        <div id="div2"></div>
                        <div id="div3"></div>
                        <div id="div4"></div>
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
