/*********************************/
/******** SALES GOALS ROW ********/
/*********************************/

var SalesGoals = React.createClass({
    getInitialState: function() {
        return {
            day: '2015-05-06',   // TEMP STATIC DATE: Should be wnt.yesterday

            yearStart: '2015-01-01',   // TO DO: CALCULATE THESE
            quarterStart: '2015-04-01',   // TO DO: CALCULATE THESE
            monthStart: '2015-05-01',   // TO DO: CALCULATE THESE

            goal: 13000000,   // TEMP STATIC GOAL (OTHER GOALS ARE STATIC IN HANDLECHANGE)

            status: 'On Track',
            statusClass: 'on-track',
            markerPosition: this.markerPosition('2015-01-01', '2015-05-06', 365),
            barGradient: 'Red, Orange, Yellow, YellowGreen, Green',
            barSegments: wnt.period(0,12,true)   // 1st, 8th, 15th, 22nd, 30th(31st, 28th)
        };
    },
    markerPosition: function(startDate, endDate, periodLength) {
        var days = Math.floor(( Date.parse(endDate) - Date.parse(startDate) ) / 86400000);
        var percentage = (days / periodLength) * 100;
        return percentage;
    },
    barGradient: function(expected, current) {
        /*
            <50 = Red = Behind
            >50 <75 = Orange = Behind
            >75 <90 = Yellow = Slightly Behind
            >90 <110 = Yellowish-green = On Track
            >110 = Green = Ahead

            halfBlocksToMiddleOfCurrent = [1, 3, 5, 7, 9]
            Each block counts as 2 so the marker is centered in the color
            (current / halfBlocksToMiddleOfCurrent) * 2HalvesEach 
        */
        var gradient = ['Red', 'Orange', 'Yellow', 'YellowGreen', 'Green'];
        var diff = (current / expected) * 100;
        var band;

        console.log(diff);

        if(diff < 50) {
            this.setState({ status: 'Behind', statusClass: 'behind' });
            band = Math.round((current / 1) * 2);
            return 'Red '+(band)+'%, Orange, Yellow, YellowGreen, Green';   // ['Red', 'Orange', 'Yellow', 'YellowGreen', 'Green']
        } else if(diff < 75) {
            this.setState({ status: 'Behind', statusClass: 'behind' });
            band = Math.round((current / 3) * 2);
            return 'Red '+(band)+'%, Orange '+(band*2)+'%, Yellow, YellowGreen, Green';   // ['Orange', 'Yellow', 'YellowGreen', 'Green']
        } else if(diff < 90) {
            this.setState({ status: 'Slightly Behind', statusClass: 'slightly-behind' });
            band = Math.round((current / 5) * 2);
            return 'Red '+(band)+'%, Orange '+(band*2)+'%, Yellow '+(band*3)+'%, YellowGreen, Green';   // gradient.slice(2).toString()
        } else if(diff < 110) {
            this.setState({ status: 'On Track', statusClass: 'on-track' });
            band = Math.round((current / 7) * 2);
            return 'Red '+(band)+'%, Orange '+(band*2)+'%, Yellow '+(band*3)+'%, YellowGreen '+(band*4)+'%, Green';   // ['YellowGreen', 'Green']
        } else {
            this.setState({ status: 'Ahead', statusClass: 'ahead' });
            band = Math.round((current / 9) * 2);
            return 'Red '+(band)+'%, Orange '+(band*2)+'%, Yellow '+(band*3)+'%, YellowGreen '+(band*4)+'%, Green'+(band*5)+'%';
        }
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
                    sales: result.sales_year.amount,
                    barGradient: this.barGradient(
                            this.markerPosition(this.state.yearStart, this.state.day, 365),
                            (result.sales_year.amount / this.state.goal) * 100
                        )
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
                goal: 13000000,
                sales: wnt.sales.sales_year.amount,
                markerPosition: this.markerPosition(this.state.yearStart, this.state.day, 365),
                barGradient: this.barGradient(
                            this.markerPosition(this.state.yearStart, this.state.day, 365),
                            (wnt.sales.sales_year.amount / 13000000) * 100
                        )
            });
        } else if(filter === 'quarter'){
            this.setState({
                barSegments: wnt.period(wnt.thisQuarterNum[0], wnt.thisQuarterNum[1], true),
                goal: 5000000,
                sales: wnt.sales.sales_quarter.amount,
                markerPosition: this.markerPosition(this.state.quarterStart, this.state.day, 91),
                barGradient: this.barGradient(
                            this.markerPosition(this.state.quarterStart, this.state.day, 91),
                            (wnt.sales.sales_quarter.amount / 5000000) * 100
                        )
            });
        }  else if(filter === 'month'){
            this.setState({
                barSegments: wnt.period(wnt.thisMonthNum, wnt.thisMonthNum, true),
                goal: 1000000,
                sales: wnt.sales.sales_month.amount,
                markerPosition: this.markerPosition(this.state.monthStart, this.state.day, 30),
                barGradient: this.barGradient(
                            this.markerPosition(this.state.monthStart, this.state.day, 30),
                            (wnt.sales.sales_month.amount / 1000000) * 100
                        )
            });
        } else {
            this.setState({
                barSegments: wnt.period(0, 12, true),
                goal: 20000000,
                sales: wnt.sales.sales_year.amount,
                markerPosition: this.markerPosition(this.state.yearStart, this.state.day, 365),
                barGradient: this.barGradient(
                            this.markerPosition(this.state.yearStart, this.state.day, 365),
                            (wnt.sales.sales_year.amount / 20000000) * 100
                        )
            });
        }
        event.target.blur();
    },
    formatNumbers: function(){
        $('#total-sales-goals .goalAmount').parseNumber({format:"$#,###", locale:"us"});
        $('#total-sales-goals .goalAmount').formatNumber({format:"$#,###", locale:"us"});
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
