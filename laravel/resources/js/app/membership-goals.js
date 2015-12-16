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
        // Needed to switch date format for cross-browser parsing
        startDate = startDate.split('-');
        startDate = startDate[1]+'/'+startDate[2]+'/'+startDate[0];
        endDate = endDate.split('-');
        endDate = endDate[1]+'/'+endDate[2]+'/'+endDate[0];
        // Now it can be parsed in Firefox and Safari too
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
        var self = this;
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
            wnt.membershipSales = result;
            wnt.gettingMembershipGoalsData = $.Deferred();
            wnt.getGoals(wnt.thisYear, wnt.gettingMembershipGoalsData);
            $.when(wnt.gettingMembershipGoalsData).done(function(goals) {
                // Set global for easy reuse
                wnt.membershipGoals = goals;
                // Initialize goal totals
                var goalFamily = 0;
                var goalIndividual = 0;
                var goalDonor = 0;
                // Loop through months to calculate goal totals
                for(i=1; i<13; i++){
                    var key = i;
                    goalFamily += wnt.membershipGoals['membership/units'].sub_channels.family.months[key.toString()];
                    goalIndividual += wnt.membershipGoals['membership/units'].sub_channels.individual.months[key.toString()];
                }
                // Set globals for easy access
                wnt.membershipGoals.totalMembership = goalFamily + goalIndividual;
                wnt.membershipGoals.family = goalFamily;
                wnt.membershipGoals.individual = goalIndividual;
                // Loop through array of months in quarter, matching to cooresponding month in the goals, and totalling the amount for the quarter 
                wnt.membershipGoals.familyQuarter = 0;
                wnt.membershipGoals.individualQuarter = 0;
                for(i=0; i<3; i++){
                    var month = wnt.thisQuarterMonths[i];
                    // Family
                    var goal = wnt.membershipGoals['membership/units'].sub_channels.family.months[month];
                    wnt.membershipGoals.familyQuarter += goal;
                    // Individual
                    goal = wnt.membershipGoals['membership/units'].sub_channels.individual.months[month];
                    wnt.membershipGoals.individualQuarter += goal;
                }
                wnt.membershipGoals.totalMembershipQuarter = wnt.membershipGoals.familyQuarter + wnt.membershipGoals.individualQuarter;
                var monthNum = wnt.thisMonthNum + 1;
                wnt.membershipGoals.totalMembershipMonth = wnt.membershipGoals['membership/units'].sub_channels.family.months[monthNum] + wnt.membershipGoals['membership/units'].sub_channels.individual.months[monthNum];
                if(self.isMounted()) {
                    self.setState({
                        goal: wnt.membershipGoals.totalMembership,
                        goalFamily: wnt.membershipGoals.family,
                        goalIndividual: wnt.membershipGoals.individual,
                        goalDonor: self.state.goalDonor,
                        memberships: result.memberships_year.units,
                        barGradient: self.barGradient(
                                self.markerPosition(wnt.yearStart, wnt.yesterday, 365),
                                (result.memberships_year.units / wnt.membershipGoals.totalMembership) * 100
                            ),
                        individual: result.individual_year.units,
                        family: result.family_year.units,
                        donor: result.donor_year.units,
                        statusIndividual: self.dialStatus(
                                self.markerPosition(wnt.yearStart, wnt.yesterday, 365),
                                (wnt.membershipSales.individual_year.units / wnt.membershipGoals.individual) * 100,
                                'label'
                            ),
                        statusClassIndividual: self.dialStatus(
                                self.markerPosition(wnt.yearStart, wnt.yesterday, 365),
                                (wnt.membershipSales.individual_year.units / wnt.membershipGoals.individual) * 100,
                                'class'
                            ),
                        statusFamily: self.dialStatus(
                                self.markerPosition(wnt.yearStart, wnt.yesterday, 365),
                                (wnt.membershipSales.family_year.units / wnt.membershipGoals.family) * 100,
                                'label'
                            ),
                        statusClassFamily: self.dialStatus(
                                self.markerPosition(wnt.yearStart, wnt.yesterday, 365),
                                (wnt.membershipSales.family_year.units / wnt.membershipGoals.family) * 100,
                                'class'
                            ),
                        statusDonor: self.dialStatus(
                                self.markerPosition(wnt.yearStart, wnt.yesterday, 365),
                                (wnt.membershipSales.donor_year.units / 10000) * 100,
                                'label'
                            ),
                        statusClassDonor: self.dialStatus(
                                self.markerPosition(wnt.yearStart, wnt.yesterday, 365),
                                (wnt.membershipSales.donor_year.units / 10000) * 100,
                                'class'
                            )
                    });
                    self.formatNumbers();
                }
            });
        }.bind(this))   // .bind() gives context to 'this'
        .fail(function(result) {
            console.log('MEMBERSHIP GOALS DATA ERROR! ... ' + result.statusText);
        });
        window.addEventListener("resize", this.drawDials);
    },
    componentWillUnmount: function() {
        window.removeEventListener("resize", this.drawDials);
    },
    handleChange: function(event) {
        var filter = event.target.value;
        if(filter === 'year'){
            this.setState({
                barSegments: wnt.period(0, 12, true),
                goal: wnt.membershipGoals.totalMembership,
                memberships: wnt.membershipSales.memberships_year.units,
                markerPosition: this.markerPosition(wnt.yearStart, wnt.yesterday, 365),
                barGradient: this.barGradient(
                            this.markerPosition(wnt.yearStart, wnt.yesterday, 365),
                            (wnt.membershipSales.memberships_year.units / wnt.membershipGoals.totalMembership) * 100
                        ),
                individual: wnt.membershipSales.individual_year.units,
                family: wnt.membershipSales.family_year.units,
                donor: wnt.membershipSales.donor_year.units,
                goalIndividual: wnt.membershipGoals.individual,
                goalFamily: wnt.membershipGoals.family,
                goalDonor: 10000,
                statusIndividual: this.dialStatus(
                        this.markerPosition(wnt.yearStart, wnt.yesterday, 365),
                        (wnt.membershipSales.individual_year.units / wnt.membershipGoals.individual) * 100,
                        'label'
                    ),
                statusClassIndividual: this.dialStatus(
                        this.markerPosition(wnt.yearStart, wnt.yesterday, 365),
                        (wnt.membershipSales.individual_year.units / wnt.membershipGoals.individual) * 100,
                        'class'
                    ),
                statusFamily: this.dialStatus(
                        this.markerPosition(wnt.yearStart, wnt.yesterday, 365),
                        (wnt.membershipSales.family_year.units / wnt.membershipGoals.family) * 100,
                        'label'
                    ),
                statusClassFamily: this.dialStatus(
                        this.markerPosition(wnt.yearStart, wnt.yesterday, 365),
                        (wnt.membershipSales.family_year.units / wnt.membershipGoals.family) * 100,
                        'class'
                    ),
                statusDonor: this.dialStatus(
                        this.markerPosition(wnt.yearStart, wnt.yesterday, 365),
                        (wnt.membershipSales.donor_year.units / 10000) * 100,
                        'label'
                    ),
                statusClassDonor: this.dialStatus(
                        this.markerPosition(wnt.yearStart, wnt.yesterday, 365),
                        (wnt.membershipSales.donor_year.units / 10000) * 100,
                        'class'
                    )
            });
        } else if(filter === 'quarter'){
            this.setState({
                barSegments: wnt.period(wnt.thisQuarterNum[0], wnt.thisQuarterNum[1], true),
                goal: wnt.membershipGoals.totalMembershipQuarter,
                memberships: wnt.membershipSales.memberships_quarter.units,
                markerPosition: this.markerPosition(wnt.quarterStart, wnt.yesterday, 91),
                barGradient: this.barGradient(
                            this.markerPosition(wnt.quarterStart, wnt.yesterday, 91),
                            (wnt.membershipSales.memberships_quarter.units / wnt.membershipGoals.totalMembershipQuarter) * 100
                        ),
                individual: wnt.membershipSales.individual_quarter.units,
                family: wnt.membershipSales.family_quarter.units,
                donor: wnt.membershipSales.donor_quarter.units,
                goalIndividual: wnt.membershipGoals.individualQuarter,
                goalFamily: wnt.membershipGoals.familyQuarter,
                goalDonor: 2500,
                statusIndividual: this.dialStatus(
                        this.markerPosition(wnt.quarterStart, wnt.yesterday, 91),
                        (wnt.membershipSales.individual_quarter.units / wnt.membershipGoals.individualQuarter) * 100,
                        'label'
                    ),
                statusClassIndividual: this.dialStatus(
                        this.markerPosition(wnt.quarterStart, wnt.yesterday, 91),
                        (wnt.membershipSales.individual_quarter.units / wnt.membershipGoals.individualQuarter) * 100,
                        'class'
                    ),
                statusFamily: this.dialStatus(
                        this.markerPosition(wnt.quarterStart, wnt.yesterday, 91),
                        (wnt.membershipSales.family_quarter.units / wnt.membershipGoals.familyQuarter) * 100,
                        'label'
                    ),
                statusClassFamily: this.dialStatus(
                        this.markerPosition(wnt.quarterStart, wnt.yesterday, 91),
                        (wnt.membershipSales.family_quarter.units / wnt.membershipGoals.familyQuarter) * 100,
                        'class'
                    ),
                statusDonor: this.dialStatus(
                        this.markerPosition(wnt.quarterStart, wnt.yesterday, 91),
                        (wnt.membershipSales.donor_quarter.units / 2500) * 100,
                        'label'
                    ),
                statusClassDonor: this.dialStatus(
                        this.markerPosition(wnt.quarterStart, wnt.yesterday, 91),
                        (wnt.membershipSales.donor_quarter.units / 2500) * 100,
                        'class'
                    )
            });
        }  else if(filter === 'month'){
            this.setState({
                barSegments: wnt.period(wnt.thisMonthNum, wnt.thisMonthNum, true),
                goal: wnt.membershipGoals.totalMembershipMonth,
                memberships: wnt.membershipSales.memberships_month.units,
                markerPosition: this.markerPosition(wnt.monthStart, wnt.yesterday, 30),
                barGradient: this.barGradient(
                            this.markerPosition(wnt.monthStart, wnt.yesterday, 30),
                            (wnt.membershipSales.memberships_month.units / wnt.membershipGoals.totalMembershipMonth) * 100
                        ),
                individual: wnt.membershipSales.individual_month.units,
                family: wnt.membershipSales.family_month.units,
                donor: wnt.membershipSales.donor_month.units,
                goalIndividual: wnt.membershipGoals['membership/units'].sub_channels.individual.months[wnt.thisMonthNum + 1],
                goalFamily: wnt.membershipGoals['membership/units'].sub_channels.family.months[wnt.thisMonthNum + 1],
                goalDonor: 875,
                statusIndividual: this.dialStatus(
                        this.markerPosition(wnt.monthStart, wnt.yesterday, 30),
                        (wnt.membershipSales.individual_month.units / wnt.membershipGoals['membership/units'].sub_channels.individual.months[wnt.thisMonthNum + 1]) * 100,
                        'label'
                    ),
                statusClassIndividual: this.dialStatus(
                        this.markerPosition(wnt.monthStart, wnt.yesterday, 30),
                        (wnt.membershipSales.individual_month.units / wnt.membershipGoals['membership/units'].sub_channels.individual.months[wnt.thisMonthNum + 1]) * 100,
                        'class'
                    ),
                statusFamily: this.dialStatus(
                        this.markerPosition(wnt.monthStart, wnt.yesterday, 30),
                        (wnt.membershipSales.family_month.units / wnt.membershipGoals['membership/units'].sub_channels.family.months[wnt.thisMonthNum + 1]) * 100,
                        'label'
                    ),
                statusClassFamily: this.dialStatus(
                        this.markerPosition(wnt.monthStart, wnt.yesterday, 30),
                        (wnt.membershipSales.family_month.units / wnt.membershipGoals['membership/units'].sub_channels.family.months[wnt.thisMonthNum + 1]) * 100,
                        'class'
                    ),
                statusDonor: this.dialStatus(
                        this.markerPosition(wnt.monthStart, wnt.yesterday, 30),
                        (wnt.membershipSales.donor_month.units / 875) * 100,
                        'label'
                    ),
                statusClassDonor: this.dialStatus(
                        this.markerPosition(wnt.monthStart, wnt.yesterday, 30),
                        (wnt.membershipSales.donor_month.units / 875) * 100,
                        'class'
                    )
            });
        } else {
            this.setState({
                barSegments: wnt.period(0, 12, true),
                goal: wnt.membershipGoals.totalMembership,
                memberships: wnt.membershipSales.memberships_year.units,
                markerPosition: this.markerPosition(wnt.yearStart, wnt.yesterday, 365),
                barGradient: this.barGradient(
                            this.markerPosition(wnt.yearStart, wnt.yesterday, 365),
                            (wnt.membershipSales.memberships_year.units / wnt.membershipGoals.totalMembership) * 100
                        ),
                individual: wnt.membershipSales.individual_year.units,
                family: wnt.membershipSales.family_year.units,
                donor: wnt.membershipSales.donor_year.units,
                goalIndividual: wnt.membershipGoals.individual,
                goalFamily: wnt.membershipGoals.family,
                goalDonor: 10000,
                statusIndividual: this.dialStatus(
                        this.markerPosition(wnt.yearStart, wnt.yesterday, 365),
                        (wnt.membershipSales.individual_year.units / wnt.membershipGoals.individual) * 100,
                        'label'
                    ),
                statusClassIndividual: this.dialStatus(
                        this.markerPosition(wnt.yearStart, wnt.yesterday, 365),
                        (wnt.membershipSales.individual_year.units / wnt.membershipGoals.individual) * 100,
                        'class'
                    ),
                statusFamily: this.dialStatus(
                        this.markerPosition(wnt.yearStart, wnt.yesterday, 365),
                        (wnt.membershipSales.family_year.units / wnt.membershipGoals.family) * 100,
                        'label'
                    ),
                statusClassFamily: this.dialStatus(
                        this.markerPosition(wnt.yearStart, wnt.yesterday, 365),
                        (wnt.membershipSales.family_year.units / wnt.membershipGoals.family) * 100,
                        'class'
                    ),
                statusDonor: this.dialStatus(
                        this.markerPosition(wnt.yearStart, wnt.yesterday, 365),
                        (wnt.membershipSales.donor_year.units / 10000) * 100,
                        'label'
                    ),
                statusClassDonor: this.dialStatus(
                        this.markerPosition(wnt.yearStart, wnt.yesterday, 365),
                        (wnt.membershipSales.donor_year.units / 10000) * 100,
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
        var diameter = 145;

        d3.select('#membership').selectAll('svg').remove();

        var rp5 = radialProgress(document.getElementById('div5'))
            .label('')
            .diameter(diameter)
            .value((this.state.individual / this.state.goalIndividual) * 100)
            .render();

        var rp6 = radialProgress(document.getElementById('div6'))
            .label('')
            .diameter(diameter)
            .value((this.state.family / this.state.goalFamily) * 100)
            .render();

        var rp7 = radialProgress(document.getElementById('div7'))
            .label('')
            .diameter(diameter)
            .value((this.state.donor / this.state.goalDonor) * 100)
            .render();

        // Generate the starting point markers
        for(i=5; i<8; i++){
            var startMark = d3.select('#div'+i).selectAll('svg').append("line")
                .attr("x1", 58)
                .attr("y1", -2)
                .attr("x2", 58)
                .attr("y2", 11)
                .attr("stroke-width", "3");
        }

        // Show the details
        $('#membership .channel-info').css('opacity','0')
            .animate({
                opacity: '1'
            },
            1500,
            'easeInSine'
        );

        // Equalize the row height
        $('#total-membership-goals').height($('#membership').height())

        // Set the goal dots

        this.setDots();
    },
    setDots: function(){
        diameter = $('#div5').width() -2;   // Tweaked via console
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

if(document.getElementById('membership-goals-widget')){
    React.render(
        <MembershipGoals />,
        document.getElementById('membership-goals-widget')
    );
    console.log('Membership Goals row loaded...');
}
