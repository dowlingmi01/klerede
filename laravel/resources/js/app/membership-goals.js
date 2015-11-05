/**************************************/
/******** MEMBERSHIP GOALS ROW ********/
/**************************************/

var MembershipGoals = React.createClass({
    getInitialState: function() {
        return {
            goal: 20000,   // TEMP STATIC GOAL (OTHER GOALS ARE STATIC IN HANDLECHANGE)
            goalIndividual: 10000,
            goalFamily: 10000,
            goalDonor: 10000,

            individual: 0,
            family: 0,
            donor: 0,

            status: 'On Track',
            statusIndividual: 'On Track',
            statusFamily: 'On Track',
            statusDonor: 'On Track',

            statusClass: 'on-track',
            statusClassIndividual: 'on-track',
            statusClassFamily: 'on-track',
            statusClassDonor: 'on-track',

            markerPosition: this.markerPosition(wnt.yearStart, wnt.yesterday, 365),
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
    dialStatus: function(expected, current, type) {   // type = return CLASS or LABEL
        var diff = (current / expected) * 100;
        if(diff < 50) {
            return type === 'label' ? 'Behind' : 'behind';
        } else if(diff < 75) {
            return type === 'label' ? 'Behind' : 'behind';
        } else if(diff < 90) {
            return type === 'label' ? 'Slightly Behind' : 'slightly-behind';
        } else if(diff < 110) {
            return type === 'label' ? 'On Track' : 'on-track';
        } else {
            return type === 'label' ? 'Ahead' : 'ahead';
        }
    },
    componentDidMount: function() {
        $.post(
            wnt.apiMain,
            {
                venue_id: wnt.venueID,
                queries: {
                    memberships_year: { specs: { type: 'sales', channel: 'membership' }, periods: { from: wnt.yearStart, to: wnt.yesterday, kind: 'sum' } },
                    memberships_quarter: { specs: { type: 'sales', channel: 'membership' }, periods: { from: wnt.quarterStart, to: wnt.yesterday, kind: 'sum' } },
                    memberships_month: { specs: { type: 'sales', channel: 'membership' }, periods: { from: wnt.monthStart, to: wnt.yesterday, kind: 'sum' } },

                    individual_year: { specs: { type: 'sales', channel: 'membership', membership_type: 'individual' }, periods: { from: wnt.yearStart, to: wnt.yesterday, kind: 'sum' } },
                    individual_quarter: { specs: { type: 'sales', channel: 'membership', membership_type: 'individual' }, periods: { from: wnt.quarterStart, to: wnt.yesterday, kind: 'sum' } },
                    individual_month: { specs: { type: 'sales', channel: 'membership', membership_type: 'individual' }, periods: { from: wnt.monthStart, to: wnt.yesterday, kind: 'sum' } },


                    family_year: { specs: { type: 'sales', channel: 'membership', membership_type: 'family' }, periods: { from: wnt.yearStart, to: wnt.yesterday, kind: 'sum' } },
                    family_quarter: { specs: { type: 'sales', channel: 'membership', membership_type: 'family' }, periods: { from: wnt.quarterStart, to: wnt.yesterday, kind: 'sum' } },
                    family_month: { specs: { type: 'sales', channel: 'membership', membership_type: 'family' }, periods: { from: wnt.monthStart, to: wnt.yesterday, kind: 'sum' } },

                    donor_year: { specs: { type: 'sales', kinds: ['donation'] }, periods: { from: wnt.yearStart, to: wnt.yesterday, kind: 'sum' } },
                    donor_quarter: { specs: { type: 'sales', kinds: ['donation'] }, periods: { from: wnt.quarterStart, to: wnt.yesterday, kind: 'sum' } },
                    donor_month: { specs: { type: 'sales', kinds: ['donation'] }, periods: { from: wnt.monthStart, to: wnt.yesterday, kind: 'sum' } },

                    visits_year: { specs: { type: 'visits' }, periods: { from: wnt.yearStart, to: wnt.yesterday, kind: 'sum' } },
                    visits_quarter: { specs: { type: 'visits' }, periods: { from: wnt.quarterStart, to: wnt.yesterday, kind: 'sum' } },
                    visits_month: { specs: { type: 'visits' }, periods: { from: wnt.monthStart, to: wnt.yesterday, kind: 'sum' } }
                }
            }
        )
        .done(function(result) {
            console.log('Membership Goals data loaded...');
            wnt.membersGoals = result;
            if(this.isMounted()) {
                this.setState({
                    memberships: result.memberships_year.units,
                    barGradient: this.barGradient(
                            this.markerPosition(wnt.yearStart, wnt.yesterday, 365),
                            (result.memberships_year.units / this.state.goal) * 100
                        ),
                    individual: result.individual_year.units,
                    family: result.family_year.units,
                    donor: result.donor_year.units,
                    statusIndividual: this.dialStatus(
                            this.markerPosition(wnt.yearStart, wnt.yesterday, 365),
                            (wnt.membersGoals.individual_year.units / 10000) * 100,
                            'label'
                        ),
                    statusClassIndividual: this.dialStatus(
                            this.markerPosition(wnt.yearStart, wnt.yesterday, 365),
                            (wnt.membersGoals.individual_year.units / 10000) * 100,
                            'class'
                        ),
                    statusFamily: this.dialStatus(
                            this.markerPosition(wnt.yearStart, wnt.yesterday, 365),
                            (wnt.membersGoals.family_year.units / 10000) * 100,
                            'label'
                        ),
                    statusClassFamily: this.dialStatus(
                            this.markerPosition(wnt.yearStart, wnt.yesterday, 365),
                            (wnt.membersGoals.family_year.units / 10000) * 100,
                            'class'
                        ),
                    statusDonor: this.dialStatus(
                            this.markerPosition(wnt.yearStart, wnt.yesterday, 365),
                            (wnt.membersGoals.donor_year.units / 10000) * 100,
                            'label'
                        ),
                    statusClassDonor: this.dialStatus(
                            this.markerPosition(wnt.yearStart, wnt.yesterday, 365),
                            (wnt.membersGoals.donor_year.units / 10000) * 100,
                            'class'
                        )
                });
                this.formatNumbers();
            }
        }.bind(this))   // .bind() gives context to 'this'
        .fail(function(result) {
            console.log('MEMBERSHIP GOALS DATA ERROR! ... ' + result.statusText);
        });
    },
    handleChange: function(event) {
        var filter = event.target.value;
        if(filter === 'year'){
            this.setState({
                barSegments: wnt.period(0, 12, true),
                goal: 20000,
                memberships: wnt.membersGoals.memberships_year.units,
                markerPosition: this.markerPosition(wnt.yearStart, wnt.yesterday, 365),
                barGradient: this.barGradient(
                            this.markerPosition(wnt.yearStart, wnt.yesterday, 365),
                            (wnt.membersGoals.memberships_year.units / 20000) * 100
                        ),
                individual: wnt.membersGoals.individual_year.units,
                family: wnt.membersGoals.family_year.units,
                donor: wnt.membersGoals.donor_year.units,
                goalIndividual: 10000,
                goalFamily: 10000,
                goalDonor: 10000,
                statusIndividual: this.dialStatus(
                        this.markerPosition(wnt.yearStart, wnt.yesterday, 365),
                        (wnt.membersGoals.individual_year.units / 10000) * 100,
                        'label'
                    ),
                statusClassIndividual: this.dialStatus(
                        this.markerPosition(wnt.yearStart, wnt.yesterday, 365),
                        (wnt.membersGoals.individual_year.units / 10000) * 100,
                        'class'
                    ),
                statusFamily: this.dialStatus(
                        this.markerPosition(wnt.yearStart, wnt.yesterday, 365),
                        (wnt.membersGoals.family_year.units / 10000) * 100,
                        'label'
                    ),
                statusClassFamily: this.dialStatus(
                        this.markerPosition(wnt.yearStart, wnt.yesterday, 365),
                        (wnt.membersGoals.family_year.units / 10000) * 100,
                        'class'
                    ),
                statusDonor: this.dialStatus(
                        this.markerPosition(wnt.yearStart, wnt.yesterday, 365),
                        (wnt.membersGoals.donor_year.units / 10000) * 100,
                        'label'
                    ),
                statusClassDonor: this.dialStatus(
                        this.markerPosition(wnt.yearStart, wnt.yesterday, 365),
                        (wnt.membersGoals.donor_year.units / 10000) * 100,
                        'class'
                    )
            });
        } else if(filter === 'quarter'){
            this.setState({
                barSegments: wnt.period(wnt.thisQuarterNum[0], wnt.thisQuarterNum[1], true),
                goal: 5000,
                memberships: wnt.membersGoals.memberships_quarter.units,
                markerPosition: this.markerPosition(wnt.quarterStart, wnt.yesterday, 91),
                barGradient: this.barGradient(
                            this.markerPosition(wnt.quarterStart, wnt.yesterday, 91),
                            (wnt.membersGoals.memberships_quarter.units / 5000) * 100
                        ),
                individual: wnt.membersGoals.individual_quarter.units,
                family: wnt.membersGoals.family_quarter.units,
                donor: wnt.membersGoals.donor_quarter.units,
                goalIndividual: 2500,
                goalFamily: 2500,
                goalDonor: 2500,
                statusIndividual: this.dialStatus(
                        this.markerPosition(wnt.quarterStart, wnt.yesterday, 91),
                        (wnt.membersGoals.individual_quarter.units / 2500) * 100,
                        'label'
                    ),
                statusClassIndividual: this.dialStatus(
                        this.markerPosition(wnt.quarterStart, wnt.yesterday, 91),
                        (wnt.membersGoals.individual_quarter.units / 2500) * 100,
                        'class'
                    ),
                statusFamily: this.dialStatus(
                        this.markerPosition(wnt.quarterStart, wnt.yesterday, 91),
                        (wnt.membersGoals.family_quarter.units / 2500) * 100,
                        'label'
                    ),
                statusClassFamily: this.dialStatus(
                        this.markerPosition(wnt.quarterStart, wnt.yesterday, 91),
                        (wnt.membersGoals.family_quarter.units / 2500) * 100,
                        'class'
                    ),
                statusDonor: this.dialStatus(
                        this.markerPosition(wnt.quarterStart, wnt.yesterday, 91),
                        (wnt.membersGoals.donor_quarter.units / 2500) * 100,
                        'label'
                    ),
                statusClassDonor: this.dialStatus(
                        this.markerPosition(wnt.quarterStart, wnt.yesterday, 91),
                        (wnt.membersGoals.donor_quarter.units / 2500) * 100,
                        'class'
                    )
            });
        }  else if(filter === 'month'){
            this.setState({
                barSegments: wnt.period(wnt.thisMonthNum, wnt.thisMonthNum, true),
                goal: 1750,
                memberships: wnt.membersGoals.memberships_month.units,
                markerPosition: this.markerPosition(wnt.monthStart, wnt.yesterday, 30),
                barGradient: this.barGradient(
                            this.markerPosition(wnt.monthStart, wnt.yesterday, 30),
                            (wnt.membersGoals.memberships_month.units / 1750) * 100
                        ),
                individual: wnt.membersGoals.individual_month.units,
                family: wnt.membersGoals.family_month.units,
                donor: wnt.membersGoals.donor_month.units,
                goalIndividual: 875,
                goalFamily: 875,
                goalDonor: 875,
                statusIndividual: this.dialStatus(
                        this.markerPosition(wnt.monthStart, wnt.yesterday, 30),
                        (wnt.membersGoals.individual_month.units / 875) * 100,
                        'label'
                    ),
                statusClassIndividual: this.dialStatus(
                        this.markerPosition(wnt.monthStart, wnt.yesterday, 30),
                        (wnt.membersGoals.individual_month.units / 875) * 100,
                        'class'
                    ),
                statusFamily: this.dialStatus(
                        this.markerPosition(wnt.monthStart, wnt.yesterday, 30),
                        (wnt.membersGoals.family_month.units / 875) * 100,
                        'label'
                    ),
                statusClassFamily: this.dialStatus(
                        this.markerPosition(wnt.monthStart, wnt.yesterday, 30),
                        (wnt.membersGoals.family_month.units / 875) * 100,
                        'class'
                    ),
                statusDonor: this.dialStatus(
                        this.markerPosition(wnt.monthStart, wnt.yesterday, 30),
                        (wnt.membersGoals.donor_month.units / 875) * 100,
                        'label'
                    ),
                statusClassDonor: this.dialStatus(
                        this.markerPosition(wnt.monthStart, wnt.yesterday, 30),
                        (wnt.membersGoals.donor_month.units / 875) * 100,
                        'class'
                    )
            });
        } else {
            this.setState({
                barSegments: wnt.period(0, 12, true),
                goal: 20000,
                memberships: wnt.membersGoals.memberships_year.units,
                markerPosition: this.markerPosition(wnt.yearStart, wnt.yesterday, 365),
                barGradient: this.barGradient(
                            this.markerPosition(wnt.yearStart, wnt.yesterday, 365),
                            (wnt.membersGoals.memberships_year.units / 20000) * 100
                        ),
                individual: wnt.membersGoals.individual_year.units,
                family: wnt.membersGoals.family_year.units,
                donor: wnt.membersGoals.donor_year.units,
                goalIndividual: 10000,
                goalFamily: 10000,
                goalDonor: 10000,
                statusIndividual: this.dialStatus(
                        this.markerPosition(wnt.yearStart, wnt.yesterday, 365),
                        (wnt.membersGoals.individual_year.units / 10000) * 100,
                        'label'
                    ),
                statusClassIndividual: this.dialStatus(
                        this.markerPosition(wnt.yearStart, wnt.yesterday, 365),
                        (wnt.membersGoals.individual_year.units / 10000) * 100,
                        'class'
                    ),
                statusFamily: this.dialStatus(
                        this.markerPosition(wnt.yearStart, wnt.yesterday, 365),
                        (wnt.membersGoals.family_year.units / 10000) * 100,
                        'label'
                    ),
                statusClassFamily: this.dialStatus(
                        this.markerPosition(wnt.yearStart, wnt.yesterday, 365),
                        (wnt.membersGoals.family_year.units / 10000) * 100,
                        'class'
                    ),
                statusDonor: this.dialStatus(
                        this.markerPosition(wnt.yearStart, wnt.yesterday, 365),
                        (wnt.membersGoals.donor_year.units / 10000) * 100,
                        'label'
                    ),
                statusClassDonor: this.dialStatus(
                        this.markerPosition(wnt.yearStart, wnt.yesterday, 365),
                        (wnt.membersGoals.donor_year.units / 10000) * 100,
                        'class'
                    )
            });
        }
        event.target.blur();
    },
    formatNumbers: function(){
        $('#total-membership-goals .goalAmount').parseNumber({format:"#,###", locale:"us"});
        $('#total-membership-goals .goalAmount').formatNumber({format:"#,###", locale:"us"});
        $('#total-membership-goals .bar-meter-marker').parseNumber({format:"#,###", locale:"us"});
        $('#total-membership-goals .bar-meter-marker').formatNumber({format:"#,###", locale:"us"});
        $.each($('#membership .channel-amount'), function(index, item){
            if($(this).html() !== '-'){
                $(this).parseNumber({format:"#,###", locale:"us"});
                $(this).formatNumber({format:"#,###", locale:"us"});
            }
        });
        $.each($('#membership .amount'), function(index, item){
            if($(this).html() !== '-'){
                $(this).parseNumber({format:"#,###", locale:"us"});
                $(this).formatNumber({format:"#,###", locale:"us"});
            }
        });
    },
    drawDials: function() {
        d3.select('#membership').selectAll('svg').remove();
        var rp5 = radialProgress(document.getElementById('div5'))
            .label('')
            .diameter(145)
            .value((this.state.individual / this.state.goalIndividual) * 100)
            .render();

        var rp6 = radialProgress(document.getElementById('div6'))
            .label('')
            .diameter(145)
            .value((this.state.family / this.state.goalFamily) * 100)
            .render();

        var rp7 = radialProgress(document.getElementById('div7'))
            .label('')
            .diameter(145)
            .value((this.state.donor / this.state.goalDonor) * 100)
            .render();
    },
    setDots: function(){
        diameter = $('#div1').width() -2;   // Tweaked via console
        radius = diameter / 2;
        centerX = radius;
        centerY = radius;
        // Angle is calculated as % of 360 based on spot in timeframe
        angle = Math.round((Math.round(this.state.markerPosition) / 100) * 360) - 90;   // -90 to match dial start/stop   
        dotOffset = 0;   // Tweaked via console
        radian = (angle) * (Math.PI/180);
        dotX = (centerX + (radius * Math.cos(radian))) - dotOffset;
        dotY = (centerY + (radius * Math.sin(radian))) - dotOffset;
        d3.select('#membership').selectAll('circle').remove();
        d3.select('#membership').selectAll('svg').append("circle")
            .attr("r", 8)
            .attr("cx", dotX)
            .attr("cy", dotY)
            .attr("fill", "rgba(66,66,66,1)");
    },
    componentDidUpdate: function(){
        this.formatNumbers();
        $('#total-membership-goals .bar-meter-marker')
            .animate({
                left: this.state.markerPosition+'%'
            },
            2000,
            'easeOutElastic'
        );
        this.drawDials();
        this.setDots();
    },
    render: function() {
        var gradient = {
            background: 'linear-gradient(to right, '+this.state.barGradient+')'
        };
        return (
            <div className="row">
                <div className="col-xs-6 col-md-6 arrow-connector-right">
                    <div className="widget" id="total-membership-goals">
                        <h2>Total Membership Goals</h2>
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
                        <div className="clear goal">Membership Goal: <span className="goalAmount">{this.state.goal}</span></div>
                        <div className="goalStatus">Status: <span className={"goalStatusText " + this.state.statusClass}>{this.state.status}</span></div>
                        <div className="bar-meter clear" style={gradient}>
                            <div className="bar-meter-marker">{this.state.memberships}</div>
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
                    <div className="widget" id="membership">
                        <h2>Membership / Donors</h2>
                        <ActionMenu />
                        <form>
                            <select className="form-control">
                                <option value="units">Units</option>
                            </select>
                            <Caret className="filter-caret" />
                        </form>
                        <div className="dial-wrapper">
                            <Dial divID="div5" label="Individual"
                                amount={this.state.individual}
                                goal={this.state.goalIndividual}
                                status={this.state.statusIndividual}
                                statusClass={this.state.statusClassIndividual} />
                            <Dial divID="div6" label="Family"
                                amount={this.state.family}
                                goal={this.state.goalFamily}
                                status={this.state.statusFamily}
                                statusClass={this.state.statusClassFamily} />
                            <Dial divID="div7" label="Donor"
                                amount={this.state.donor}
                                goal={this.state.goalDonor}
                                status={this.state.statusDonor}
                                statusClass={this.state.statusClassDonor} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});

React.render(
    <MembershipGoals />,   // TEMP STATIC VENUE ID
    document.getElementById('membership-goals-widget')
);

console.log('Membership Goals row loaded...');
