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
            goalBoxoffice: 3250000,
            goalCafe: 3250000,
            goalGiftstore: 3250000,
            goalMembership: 3250000,

            boxoffice: '...',
            cafe: '...',
            giftstore: '...',
            membership: '...',

            status: 'On Track',
            statusBoxoffice: 'On Track',
            statusCafe: 'On Track',
            statusGiftstore: 'On Track',
            statusMembership: 'On Track',

            statusClass: 'on-track',
            statusClassBoxoffice: 'on-track',
            statusClassCafe: 'on-track',
            statusClassGiftstore: 'on-track',
            statusClassMembership: 'on-track',

            markerPosition: this.markerPosition('2015-01-01', '2015-05-06', 365),
            barGradient: 'Red, Orange, Yellow, YellowGreen, Green',
            barSegments: wnt.period(0,12,true)
        };
    },
    markerPosition: function(startDate, endDate, periodLength) {
        var days = Math.floor(( Date.parse(endDate) - Date.parse(startDate) ) / 86400000);
        var percentage = (days / periodLength) * 100;
        return percentage;
    },
    barGradient: function(expected, current) {
        /*
            <50         = Red               = Behind            = rgba(221,35,2,1)
            >50 <75     = Orange            = behind            = rgba(235,164,9,1)
            >75 <90     = Yellow            = Slightly behind   = rgba(255,254,19,1)
            >90 <110    = Yellowish-green   = On Track          = rgba(170,202,55,1)
            >110        = Green             = Ahead             = rgba(72,126,3,1)

            halfBlocksToMiddleOfCurrent = [1, 3, 5, 7, 9]
            Each block counts as 2 so the marker is centered in the color
            (current / halfBlocksToMiddleOfCurrent) * 2HalvesEach 
            The % stops in the gradient are where to start the next color, not the color's width
        */
        var gradient = ['Red', 'Orange', 'Yellow', 'YellowGreen', 'Green'];
        var diff = (current / expected) * 100;
        var band;

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
                    sales_month: { specs: { type: 'sales' }, periods: { from: this.state.monthStart, to: this.state.day, kind: 'sum' } },

                    boxoffice_year: { specs: { type: 'sales', channel: 'gate' }, periods: { from: this.state.yearStart, to: this.state.day, kind: 'sum' } },
                    boxoffice_quarter: { specs: { type: 'sales', channel: 'gate' }, periods: { from: this.state.quarterStart, to: this.state.day, kind: 'sum' } },
                    boxoffice_month: { specs: { type: 'sales', channel: 'gate' }, periods: { from: this.state.monthStart, to: this.state.day, kind: 'sum' } },
                    
                    cafe_year: { specs: { type: 'sales', channel: 'cafe' }, periods: { from: this.state.yearStart, to: this.state.day, kind: 'sum' } },
                    cafe_quarter: { specs: { type: 'sales', channel: 'cafe' }, periods: { from: this.state.quarterStart, to: this.state.day, kind: 'sum' } },
                    cafe_month: { specs: { type: 'sales', channel: 'cafe' }, periods: { from: this.state.monthStart, to: this.state.day, kind: 'sum' } },
                    
                    giftstore_year: { specs: { type: 'sales', channel: 'store' }, periods: { from: this.state.yearStart, to: this.state.day, kind: 'sum' } },
                    giftstore_quarter: { specs: { type: 'sales', channel: 'store' }, periods: { from: this.state.quarterStart, to: this.state.day, kind: 'sum' } },
                    giftstore_month: { specs: { type: 'sales', channel: 'store' }, periods: { from: this.state.monthStart, to: this.state.day, kind: 'sum' } },
                    
                    membership_year: { specs: { type: 'sales', channel: 'membership' }, periods: { from: this.state.yearStart, to: this.state.day, kind: 'sum' } },
                    membership_quarter: { specs: { type: 'sales', channel: 'membership' }, periods: { from: this.state.quarterStart, to: this.state.day, kind: 'sum' } },
                    membership_month: { specs: { type: 'sales', channel: 'membership' }, periods: { from: this.state.monthStart, to: this.state.day, kind: 'sum' } }
                }
            }
        )
        .done(function(result) {
            console.log('Sales Goals data loaded...');
            wnt.salesGoals = result;
            if(this.isMounted()) {
                this.setState({
                    sales: result.sales_year.amount,
                    barGradient: this.barGradient(
                            this.markerPosition(this.state.yearStart, this.state.day, 365),
                            (result.sales_year.amount / this.state.goal) * 100
                        ),
                    boxoffice: result.boxoffice_year.amount,
                    cafe: result.cafe_year.amount,
                    giftstore: result.giftstore_year.amount,
                    membership: result.membership_year.amount
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
                sales: wnt.salesGoals.sales_year.amount,
                markerPosition: this.markerPosition(this.state.yearStart, this.state.day, 365),
                barGradient: this.barGradient(
                            this.markerPosition(this.state.yearStart, this.state.day, 365),
                            (wnt.salesGoals.sales_year.amount / 13000000) * 100
                        )
            });
        } else if(filter === 'quarter'){
            this.setState({
                barSegments: wnt.period(wnt.thisQuarterNum[0], wnt.thisQuarterNum[1], true),
                goal: 5000000,
                sales: wnt.salesGoals.sales_quarter.amount,
                markerPosition: this.markerPosition(this.state.quarterStart, this.state.day, 91),
                barGradient: this.barGradient(
                            this.markerPosition(this.state.quarterStart, this.state.day, 91),
                            (wnt.salesGoals.sales_quarter.amount / 5000000) * 100
                        )
            });
        }  else if(filter === 'month'){
            this.setState({
                barSegments: wnt.period(wnt.thisMonthNum, wnt.thisMonthNum, true),
                goal: 1000000,
                sales: wnt.salesGoals.sales_month.amount,
                markerPosition: this.markerPosition(this.state.monthStart, this.state.day, 30),
                barGradient: this.barGradient(
                            this.markerPosition(this.state.monthStart, this.state.day, 30),
                            (wnt.salesGoals.sales_month.amount / 1000000) * 100
                        )
            });
        } else {
            this.setState({
                barSegments: wnt.period(0, 12, true),
                goal: 20000000,
                sales: wnt.salesGoals.sales_year.amount,
                markerPosition: this.markerPosition(this.state.yearStart, this.state.day, 365),
                barGradient: this.barGradient(
                            this.markerPosition(this.state.yearStart, this.state.day, 365),
                            (wnt.salesGoals.sales_year.amount / 20000000) * 100
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
        $.each($('#earned-revenue-channels .channel-amount'), function(index, item){
            if($(this).html() !== '-'){
                $(this).parseNumber({format:"$#,###", locale:"us"});
                $(this).formatNumber({format:"$#,###", locale:"us"});
            }
        });
        $.each($('#earned-revenue-channels .amount'), function(index, item){
            if($(this).html() !== '-'){
                $(this).parseNumber({format:"$#,###", locale:"us"});
                $(this).formatNumber({format:"$#,###", locale:"us"});
            }
        });
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
        /*
            var circleK = svgContainer.append("circle")
                .attr("r", 10)
                .attr("cx", 100)
                .attr("cy", 50)
                .attr("fill", "#ccebeb");
        */
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
                        <div className="dial-wrapper">
                            <Dial divID="div1" label="Box Office"
                                amount={this.state.boxoffice}
                                goal={this.state.goalBoxoffice}
                                status={this.state.statusBoxoffice}
                                statusClass={this.state.statusClassBoxoffice} />
                            <Dial divID="div2" label="Cafe"
                                amount={this.state.cafe}
                                goal={this.state.goalCafe}
                                status={this.state.statusCafe}
                                statusClass={this.state.statusClassCafe} />
                            <Dial divID="div3" label="Gift Store"
                                amount={this.state.giftstore}
                                goal={this.state.goalGiftstore}
                                status={this.state.statusGiftstore}
                                statusClass={this.state.statusClassGiftstore} />
                            <Dial divID="div4" label="Membership"
                                amount={this.state.membership}
                                goal={this.state.goalMembership}
                                status={this.state.statusMembership}
                                statusClass={this.state.statusClassMembership} />
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
