/*********************************/
/******** SALES GOALS ROW ********/
/*********************************/

var SalesGoals = React.createClass({
    getInitialState: function() {
        return {
            /*
                HOW TO CALCULATE...
                    MARKER POSITION = % of time window
                    GRADIENT =     ......    goal vs current = % complete vs what % should be complete at the current marker position (this.state.markerPosition is a % number)
                    (CURRENT / GOAL) * 100 = %COMPLETE
                        if goal = 100 and current = 25 ... 25% complete .... e.g. this.state.markerPosition = 50%, then the goal should be 50% complete, but since it's 25% it's off by -25%
                            if that 25% complete matches what SHOULD be complete

                        so we have 2 numbers ... 25 and 50 (%done vs %expected)

                Status () ... (calculated as percentage of goal)
                    <50 = Red
                    >50 <75 = Orange
                    >75 <90 = Yellow
                    >90 <110 = Yellowish-green
                    >110 = Green
            */
            day: '2015-05-06',   // TEMP STATIC DATE: Should be wnt.yesterday

            yearStart: '2015-01-01',   // TO DO: CALCULATE THESE
            quarterStart: '2015-04-01',   // TO DO: CALCULATE THESE
            monthStart: '2015-05-01',   // TO DO: CALCULATE THESE

            goal: '$6,000,000',   // TEMP STATIC GOAL (OTHER GOALS ARE STATIC IN HANDLECHANGE)

            status: 'On Track',
            statusClass: 'on-track',
            markerPosition: this.markerPosition('2015-01-01', '2015-05-06', 365),
            barGradient: 'Red, Orange, Yellow, YellowGreen, Green, Blue',
            barSegments: wnt.period(0,12,true)
        };
    },
    markerPosition: function(startDate, endDate, periodLength) {
        var days = Math.floor(( Date.parse(endDate) - Date.parse(startDate) ) / 86400000);
        var percentage = (days / periodLength) * 100;
        return percentage;
    },
    componentDidMount: function() {
        $.post(
            this.props.source,
            {
                venue_id: this.props.venueID,
                queries: {
                    sales_year: { specs: { type: 'sales' }, periods: { from: this.state.yearStart, to: this.state.day, kind: 'sum' } },
                    sales_quarter: { specs: { type: 'sales' }, periods: { from: this.state.quarterStart, to: this.state.day, kind: 'sum' } },
                    sales_month: { specs: { type: 'sales' }, periods: { from: this.state.monthStart, to: this.state.day, kind: 'sum' } }
                }
            }
        )
        .done(function(result) {
            console.log('Sales Goals data loaded...');
            wnt.sales = result;
            if(this.isMounted()) {
                this.setState({
                    sales: result.sales_year.amount
                });
                this.formatNumbers();
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
                barSegments: wnt.period(0, 12, true),
                goal: '$6,000,000',
                sales: wnt.sales.sales_year.amount,
                markerPosition: this.markerPosition(this.state.yearStart, this.state.day, 365)
            });
        } else if(filter === 'quarter'){
            this.setState({
                barSegments: wnt.period(wnt.thisQuarterNum[0], wnt.thisQuarterNum[1], true),
                goal: '$1,500,000',
                sales: wnt.sales.sales_quarter.amount,
                markerPosition: this.markerPosition(this.state.quarterStart, this.state.day, 91)
            });
        }  else if(filter === 'month'){
            this.setState({
                barSegments: wnt.period(wnt.thisMonthNum, wnt.thisMonthNum+1, true),
                goal: '$500,000',
                sales: wnt.sales.sales_month.amount,
                markerPosition: this.markerPosition(this.state.monthStart, this.state.day, 30)
            });
        } else {
            this.setState({
                barSegments: wnt.period(0, 12, true),
                goal: '$6,000,000',
                sales: wnt.sales.sales_year.amount,
                markerPosition: this.markerPosition(this.state.yearStart, this.state.day, 365)
            });
        }
        event.target.blur();
    },
    formatNumbers: function(){
        $('#total-sales-goals .bar-meter-marker').parseNumber({format:"$#,###", locale:"us"});
        $('#total-sales-goals .bar-meter-marker').formatNumber({format:"$#,###", locale:"us"});
    },
    componentDidUpdate: function(){
        this.formatNumbers();
        $('#total-sales-goals .bar-meter-marker')
            .animate({
                left: this.state.markerPosition+'%'
            },
            2000,
            'easeOutElastic'
        );
    },
    render: function() {
        var gradient = {
            background: 'linear-gradient(to right, '+this.state.barGradient+')'
        };
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
                        <div className="clear goal">Goal: <span className="goalAmount">{this.state.goal}</span></div>
                        <div className="goalStatus">Status: <span className={"goalStatusText " + this.state.statusClass}>{this.state.status}</span></div>
                        <div className="bar-meter clear" style={gradient}>
                            <div className="bar-meter-marker">{this.state.sales}</div>
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
