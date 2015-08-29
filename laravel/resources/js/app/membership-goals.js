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
                        <div className="action-menu">+</div>
                        <form>
                            <select className="form-control">
                                <option>XYZ</option>
                                <option>XYZ</option>
                            </select>
                        </form>
                        <div className="clear">Membership Goal: #4,500</div>
                        <div>Status: Behind</div>
                        <div className="bar-meter"></div>
                    </div>
                </div>
                <div className="col-xs-6 col-md-6">
                    <div className="widget" id="membership">
                        <h2>Membership</h2>
                        <div className="action-menu">+</div>
                        <form>
                            <select className="form-control">
                                <option>XYZ</option>
                                <option>XYZ</option>
                            </select>
                        </form>
                        <div id="div5" className="clear"></div>
                        <div id="div6"></div>
                        <div id="div7"></div>
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
