/*********************************/
/******** SALES GOALS ROW ********/
/*********************************/

var SalesGoals = React.createClass({
    getInitialState: function() {
        return {
            visitsDate: '2015-05-06',   // TEMP STATIC DATE: Should be wnt.yesterday
            barSegments: wnt.period(0,12,true)
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
            wnt.sales = result;
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
    handleChange: function(event) {
        var filter = event.target.value;
        if(filter === 'year'){
            this.setState({
                barSegments: wnt.period(0, 12, true)
            });
        } else if(filter === 'quarter'){
            this.setState({
                barSegments: wnt.period(wnt.thisQuarterNum[0], wnt.thisQuarterNum[1], true)
            });
        }  else if(filter === 'month'){
            this.setState({
                barSegments: wnt.period(wnt.thisMonthNum, wnt.thisMonthNum+1, true)
            });
        } else {
            this.setState({
                barSegments: wnt.period(0, 12, true)
            });
        }
        event.target.blur();
    },
    componentDidUpdate: function(){
        $('#total-sales-goals .bar-meter-marker')
            .animate({
                left: '25%',
                transform: 'translateX(-25%)'
            },
            2000,
            'easeOutElastic'
        );
    },
    render: function() {
        return (
            <div className="row">
                <div className="col-xs-6 col-md-6 arrow-connector-right">
                    <div className="widget" id="total-sales-goals">
                        <h2>Total Sales Goals</h2>
                        <ActionMenu />
                        <form>
                            <select className="form-control" onChange={this.handleChange}>
                                <option value="year">Current Year ({wnt.thisYear})</option>
                                <option value="quarter">Current Quarter ({wnt.thisQuarterText})</option>
                                <option value="month">Current Month ({wnt.thisMonthText.substring(0,3)})</option>
                                <option value="custom">Custom</option>
                            </select>
                            <Caret className="filter-caret" />
                        </form>
                        <div className="clear goal">Goal: <span className="goalAmount">$2,000,000</span></div>
                        <div className="goalStatus">Status: <span className="goalStatusText ahead">Ahead</span></div>
                        <div className="bar-meter clear">
                            <div className="bar-meter-marker">$950,000</div>
                            <table className="bar-meter-segments">
                                <tr>
                                    { this.state.barSegments.map(function(segment) {
                                        return <Segment key={segment} label={segment} />;
                                    }) }
                                </tr>
                            </table>
                        </div>
                    </div>
                </div>
                <div className="col-xs-6 col-md-6">
                    <div className="widget" id="earned-revenue-channels">
                        <h2>Earned Revenue Channels</h2>
                        <ActionMenu />
                        <form>
                            <select className="form-control">
                                <option value="dollars">Dollars</option>
                                <option value="percap">Per Cap</option>
                            </select>
                            <Caret className="filter-caret" />
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
