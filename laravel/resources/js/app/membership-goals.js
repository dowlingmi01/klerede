/**************************************/
/******** MEMBERSHIP GOALS ROW ********/
/**************************************/

var MembershipGoals = React.createClass({
    getInitialState: function() {
        return {
            goal: 0,   // TEMP STATIC GOAL (OTHER GOALS ARE STATIC IN filterPeriod)
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
            barSegments: wnt.period(0,12,true)
        };
    },
    callAPI: function(){
        var self = this;
        var periodStart = wnt.yearStart;
        var periodEnd = wnt.yesterday;
        if(wnt.filter.mgPeriod === 'quarter'){
            periodStart = wnt.quarterStart;
        } else if(wnt.filter.mgPeriod === 'month'){
            periodStart = wnt.monthStart;
        }
        console.log('MEMBERSHIP PERIOD', periodStart, periodEnd);
        /*
        var currentPeriod = wnt.getDateRange(wnt.filter.bgDates, 'this '+wnt.filter.bgPeriod);
        var priorPeriod = wnt.getDateRange(wnt.filter.bgDates, wnt.filter.bgCompare+' '+wnt.filter.bgPeriod);
        wnt.barScope = 'date';
        // Get week numbers for quarter data retrieval
        if(wnt.filter.bgPeriod === 'quarter'){
            currentPeriod[0] = wnt.getWeekNumber(currentPeriod[0], 'format');
            currentPeriod[1] = wnt.getWeekNumber(currentPeriod[1], 'format');
            priorPeriod[0] = wnt.getWeekNumber(priorPeriod[0], 'format');
            priorPeriod[1] = wnt.getWeekNumber(priorPeriod[1], 'format');
            wnt.barScope = 'week';
        }
        var totalBars = { type: 'sales' };
        if(wnt.filter.bgVisitors === 'members'){
            totalBars = { type: 'sales', members: true };
        } else if(wnt.filter.bgVisitors === 'nonmembers'){
            totalBars = { type: 'sales', members: false };
        }
        $.post(
            wnt.apiMain,
            {
                venue_id: wnt.venueID,
                queries: {
                    // Bar graph data ...
                    box_bars: { specs: { type: 'sales', channel: 'gate' }, 
                        periods: { type: wnt.barScope, from: currentPeriod[0], to: currentPeriod[1] } },
        */
        $.post(
            wnt.apiMain,
            {
                venue_id: wnt.venueID,
                queries: {
                    memberships: { specs: { type: 'sales', channel: 'membership' }, periods: { from: periodStart, to: periodEnd, kind: 'sum' } },
                    memberships_year: { specs: { type: 'sales', channel: 'membership' }, periods: { from: wnt.yearStart, to: wnt.yesterday, kind: 'sum' } },
                    memberships_quarter: { specs: { type: 'sales', channel: 'membership' }, periods: { from: wnt.quarterStart, to: wnt.yesterday, kind: 'sum' } },
                    memberships_month: { specs: { type: 'sales', channel: 'membership' }, periods: { from: wnt.monthStart, to: wnt.yesterday, kind: 'sum' } },

                    individual: { specs: { type: 'sales', channel: 'membership', membership_type: 'individual' }, periods: { from: periodStart, to: periodEnd, kind: 'sum' } },
                    individual_year: { specs: { type: 'sales', channel: 'membership', membership_type: 'individual' }, periods: { from: wnt.yearStart, to: wnt.yesterday, kind: 'sum' } },
                    individual_quarter: { specs: { type: 'sales', channel: 'membership', membership_type: 'individual' }, periods: { from: wnt.quarterStart, to: wnt.yesterday, kind: 'sum' } },
                    individual_month: { specs: { type: 'sales', channel: 'membership', membership_type: 'individual' }, periods: { from: wnt.monthStart, to: wnt.yesterday, kind: 'sum' } },


                    family: { specs: { type: 'sales', channel: 'membership', membership_type: 'family' }, periods: { from: periodStart, to: periodEnd, kind: 'sum' } },
                    family_year: { specs: { type: 'sales', channel: 'membership', membership_type: 'family' }, periods: { from: wnt.yearStart, to: wnt.yesterday, kind: 'sum' } },
                    family_quarter: { specs: { type: 'sales', channel: 'membership', membership_type: 'family' }, periods: { from: wnt.quarterStart, to: wnt.yesterday, kind: 'sum' } },
                    family_month: { specs: { type: 'sales', channel: 'membership', membership_type: 'family' }, periods: { from: wnt.monthStart, to: wnt.yesterday, kind: 'sum' } },

                    donor: { specs: { type: 'sales', kinds: ['donation'] }, periods: { from: periodStart, to: periodEnd, kind: 'sum' } },
                    donor_year: { specs: { type: 'sales', kinds: ['donation'] }, periods: { from: wnt.yearStart, to: wnt.yesterday, kind: 'sum' } },
                    donor_quarter: { specs: { type: 'sales', kinds: ['donation'] }, periods: { from: wnt.quarterStart, to: wnt.yesterday, kind: 'sum' } },
                    donor_month: { specs: { type: 'sales', kinds: ['donation'] }, periods: { from: wnt.monthStart, to: wnt.yesterday, kind: 'sum' } },

                    visits: { specs: { type: 'visits' }, periods: { from: periodStart, to: periodEnd, kind: 'sum' } },
                    visits_year: { specs: { type: 'visits' }, periods: { from: wnt.yearStart, to: wnt.yesterday, kind: 'sum' } },
                    visits_quarter: { specs: { type: 'visits' }, periods: { from: wnt.quarterStart, to: wnt.yesterday, kind: 'sum' } },
                    visits_month: { specs: { type: 'visits' }, periods: { from: wnt.monthStart, to: wnt.yesterday, kind: 'sum' } }
                }
            }
        )
        .done(function(result) {
            console.log('Membership Goals data loaded...');
            wnt.membershipSales = result;
            wnt.membershipSales.filterUnits = 'amount';   // Assume default filter of dollars
            wnt.membershipSales.filterPeriod = wnt.membershipSales.memberships_year;   // Default
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
                    goalFamily += wnt.membershipGoals['membership/amount'].sub_channels.family.months[key.toString()];
                    goalIndividual += wnt.membershipGoals['membership/amount'].sub_channels.individual.months[key.toString()];
                }
                // Set globals for easy access
                wnt.membershipGoals.totalMembership = goalFamily + goalIndividual;
                wnt.filter.mgGoal = wnt.membershipGoals.totalMembership;
                // LEFT OFF HERE: Create global for period to be used when unit filter changes?... wnt.filter.bgPeriod
                wnt.membershipGoals.family = goalFamily;
                wnt.membershipGoals.individual = goalIndividual;
                // Loop through array of months in quarter, matching to cooresponding month in the goals, and totalling the amount for the quarter 
                wnt.membershipGoals.familyQuarter = 0;
                wnt.membershipGoals.individualQuarter = 0;
                for(i=0; i<3; i++){
                    var month = wnt.thisQuarterMonths[i];
                    // Family
                    var goal = wnt.membershipGoals['membership/amount'].sub_channels.family.months[month];
                    wnt.membershipGoals.familyQuarter += goal;
                    // Individual
                    goal = wnt.membershipGoals['membership/amount'].sub_channels.individual.months[month];
                    wnt.membershipGoals.individualQuarter += goal;
                }
                wnt.membershipGoals.totalMembershipQuarter = wnt.membershipGoals.familyQuarter + wnt.membershipGoals.individualQuarter;
                var monthNum = wnt.thisMonthNum + 1;
                wnt.membershipGoals.totalMembershipMonth = wnt.membershipGoals['membership/amount'].sub_channels.family.months[monthNum] + wnt.membershipGoals['membership/amount'].sub_channels.individual.months[monthNum];
                if(self.isMounted()) {
                    self.setState({
                        goal: wnt.membershipGoals.totalMembership,
                        goalFamily: wnt.membershipGoals.family,
                        goalIndividual: wnt.membershipGoals.individual,
                        goalDonor: self.state.goalDonor,
                        memberships: result.memberships_year.amount,
                        individual: result.individual_year.amount,
                        family: result.family_year.amount,
                        donor: result.donor_year.amount,
                        statusIndividual: self.meterStatus(
                                self.markerPosition(wnt.yearStart, wnt.yesterday, 365),
                                (wnt.membershipSales.individual_year.amount / wnt.membershipGoals.individual) * 100,
                                'label'
                            ),
                        statusClassIndividual: self.meterStatus(
                                self.markerPosition(wnt.yearStart, wnt.yesterday, 365),
                                (wnt.membershipSales.individual_year.amount / wnt.membershipGoals.individual) * 100,
                                'class'
                            ),
                        statusFamily: self.meterStatus(
                                self.markerPosition(wnt.yearStart, wnt.yesterday, 365),
                                (wnt.membershipSales.family_year.amount / wnt.membershipGoals.family) * 100,
                                'label'
                            ),
                        statusClassFamily: self.meterStatus(
                                self.markerPosition(wnt.yearStart, wnt.yesterday, 365),
                                (wnt.membershipSales.family_year.amount / wnt.membershipGoals.family) * 100,
                                'class'
                            ),
                        statusDonor: self.meterStatus(
                                self.markerPosition(wnt.yearStart, wnt.yesterday, 365),
                                (wnt.membershipSales.donor_year.amount / 10000) * 100,
                                'label'
                            ),
                        statusClassDonor: self.meterStatus(
                                self.markerPosition(wnt.yearStart, wnt.yesterday, 365),
                                (wnt.membershipSales.donor_year.amount / 10000) * 100,
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
        console.log('MEMBERSHIP CALL API', wnt.filter.mgUnits, wnt.filter.mgPeriod);
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
    meterStatus: function(expected, current, type) {   // type = return CLASS or LABEL
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
        // Set filter defaults as globals
        wnt.filter.mgUnits = 'amount';   // amount, units
        wnt.filter.mgPeriod = 'year';   // year, month, quarter
        this.callAPI();
    },
    filterPeriod: function(event) {
        // week, month, quarter
        wnt.filter.mgPeriod = event.target.value;


        var filter = event.target.value;
        var numType = $('#mg-units .selected').data('value') === 'dollars' ? 'amount' : 'units';
        if(filter === 'year'){
            wnt.filter.mgGoal = wnt.membershipGoals.totalMembership;
            wnt.membershipSales.filterPeriod = wnt.membershipSales.memberships_year;
            this.setState({
                barSegments: wnt.period(0, 12, true),
                goal: wnt.membershipGoals.totalMembership,
                memberships: wnt.membershipSales.memberships_year[numType],
                markerPosition: this.markerPosition(wnt.yearStart, wnt.yesterday, 365),
                individual: wnt.membershipSales.individual_year[numType],
                family: wnt.membershipSales.family_year[numType],
                donor: wnt.membershipSales.donor_year[numType],
                goalIndividual: wnt.membershipGoals.individual,
                goalFamily: wnt.membershipGoals.family,
                goalDonor: 10000,
                statusIndividual: this.meterStatus(
                        this.markerPosition(wnt.yearStart, wnt.yesterday, 365),
                        (wnt.membershipSales.individual_year[numType] / wnt.membershipGoals.individual) * 100,
                        'label'
                    ),
                statusClassIndividual: this.meterStatus(
                        this.markerPosition(wnt.yearStart, wnt.yesterday, 365),
                        (wnt.membershipSales.individual_year[numType] / wnt.membershipGoals.individual) * 100,
                        'class'
                    ),
                statusFamily: this.meterStatus(
                        this.markerPosition(wnt.yearStart, wnt.yesterday, 365),
                        (wnt.membershipSales.family_year[numType] / wnt.membershipGoals.family) * 100,
                        'label'
                    ),
                statusClassFamily: this.meterStatus(
                        this.markerPosition(wnt.yearStart, wnt.yesterday, 365),
                        (wnt.membershipSales.family_year[numType] / wnt.membershipGoals.family) * 100,
                        'class'
                    ),
                statusDonor: this.meterStatus(
                        this.markerPosition(wnt.yearStart, wnt.yesterday, 365),
                        (wnt.membershipSales.donor_year[numType] / 10000) * 100,
                        'label'
                    ),
                statusClassDonor: this.meterStatus(
                        this.markerPosition(wnt.yearStart, wnt.yesterday, 365),
                        (wnt.membershipSales.donor_year[numType] / 10000) * 100,
                        'class'
                    )
            });
        } else if(filter === 'quarter'){
            wnt.filter.mgGoal = wnt.membershipGoals.totalMembershipQuarter;
            wnt.membershipSales.filterPeriod = wnt.membershipSales.memberships_quarter;
            this.setState({
                barSegments: wnt.period(wnt.thisQuarterNum[0], wnt.thisQuarterNum[1], true),
                goal: wnt.membershipGoals.totalMembershipQuarter,
                memberships: wnt.membershipSales.memberships_quarter[numType],
                markerPosition: this.markerPosition(wnt.quarterStart, wnt.yesterday, 91),
                individual: wnt.membershipSales.individual_quarter[numType],
                family: wnt.membershipSales.family_quarter[numType],
                donor: wnt.membershipSales.donor_quarter[numType],
                goalIndividual: wnt.membershipGoals.individualQuarter,
                goalFamily: wnt.membershipGoals.familyQuarter,
                goalDonor: 2500,
                statusIndividual: this.meterStatus(
                        this.markerPosition(wnt.quarterStart, wnt.yesterday, 91),
                        (wnt.membershipSales.individual_quarter[numType] / wnt.membershipGoals.individualQuarter) * 100,
                        'label'
                    ),
                statusClassIndividual: this.meterStatus(
                        this.markerPosition(wnt.quarterStart, wnt.yesterday, 91),
                        (wnt.membershipSales.individual_quarter[numType] / wnt.membershipGoals.individualQuarter) * 100,
                        'class'
                    ),
                statusFamily: this.meterStatus(
                        this.markerPosition(wnt.quarterStart, wnt.yesterday, 91),
                        (wnt.membershipSales.family_quarter[numType] / wnt.membershipGoals.familyQuarter) * 100,
                        'label'
                    ),
                statusClassFamily: this.meterStatus(
                        this.markerPosition(wnt.quarterStart, wnt.yesterday, 91),
                        (wnt.membershipSales.family_quarter[numType] / wnt.membershipGoals.familyQuarter) * 100,
                        'class'
                    ),
                statusDonor: this.meterStatus(
                        this.markerPosition(wnt.quarterStart, wnt.yesterday, 91),
                        (wnt.membershipSales.donor_quarter[numType] / 2500) * 100,
                        'label'
                    ),
                statusClassDonor: this.meterStatus(
                        this.markerPosition(wnt.quarterStart, wnt.yesterday, 91),
                        (wnt.membershipSales.donor_quarter[numType] / 2500) * 100,
                        'class'
                    )
            });
        }  else if(filter === 'month'){
            wnt.filter.mgGoal = wnt.membershipGoals.totalMembershipMonth;
            wnt.membershipSales.filterPeriod = wnt.membershipSales.memberships_month;
            this.setState({
                barSegments: wnt.period(wnt.thisMonthNum, wnt.thisMonthNum, true),
                goal: wnt.membershipGoals.totalMembershipMonth,
                memberships: wnt.membershipSales.memberships_month[numType],
                markerPosition: this.markerPosition(wnt.monthStart, wnt.yesterday, 30),
                individual: wnt.membershipSales.individual_month[numType],
                family: wnt.membershipSales.family_month[numType],
                donor: wnt.membershipSales.donor_month[numType],
                goalIndividual: wnt.membershipGoals['membership/units'].sub_channels.individual.months[wnt.thisMonthNum + 1],
                goalFamily: wnt.membershipGoals['membership/units'].sub_channels.family.months[wnt.thisMonthNum + 1],
                goalDonor: 875,
                statusIndividual: this.meterStatus(
                        this.markerPosition(wnt.monthStart, wnt.yesterday, 30),
                        (wnt.membershipSales.individual_month[numType] / wnt.membershipGoals['membership/units'].sub_channels.individual.months[wnt.thisMonthNum + 1]) * 100,
                        'label'
                    ),
                statusClassIndividual: this.meterStatus(
                        this.markerPosition(wnt.monthStart, wnt.yesterday, 30),
                        (wnt.membershipSales.individual_month[numType] / wnt.membershipGoals['membership/units'].sub_channels.individual.months[wnt.thisMonthNum + 1]) * 100,
                        'class'
                    ),
                statusFamily: this.meterStatus(
                        this.markerPosition(wnt.monthStart, wnt.yesterday, 30),
                        (wnt.membershipSales.family_month[numType] / wnt.membershipGoals['membership/units'].sub_channels.family.months[wnt.thisMonthNum + 1]) * 100,
                        'label'
                    ),
                statusClassFamily: this.meterStatus(
                        this.markerPosition(wnt.monthStart, wnt.yesterday, 30),
                        (wnt.membershipSales.family_month[numType] / wnt.membershipGoals['membership/units'].sub_channels.family.months[wnt.thisMonthNum + 1]) * 100,
                        'class'
                    ),
                statusDonor: this.meterStatus(
                        this.markerPosition(wnt.monthStart, wnt.yesterday, 30),
                        (wnt.membershipSales.donor_month[numType] / 875) * 100,
                        'label'
                    ),
                statusClassDonor: this.meterStatus(
                        this.markerPosition(wnt.monthStart, wnt.yesterday, 30),
                        (wnt.membershipSales.donor_month[numType] / 875) * 100,
                        'class'
                    )
            });
        } else {
            wnt.filter.mgGoal = wnt.membershipGoals.totalMembership;
            wnt.membershipSales.filterPeriod = wnt.membershipSales.memberships_year;
            this.setState({
                barSegments: wnt.period(0, 12, true),
                goal: wnt.membershipGoals.totalMembership,
                memberships: wnt.membershipSales.memberships_year[numType],
                markerPosition: this.markerPosition(wnt.yearStart, wnt.yesterday, 365),
                individual: wnt.membershipSales.individual_year[numType],
                family: wnt.membershipSales.family_year[numType],
                donor: wnt.membershipSales.donor_year[numType],
                goalIndividual: wnt.membershipGoals.individual,
                goalFamily: wnt.membershipGoals.family,
                goalDonor: 10000,
                statusIndividual: this.meterStatus(
                        this.markerPosition(wnt.yearStart, wnt.yesterday, 365),
                        (wnt.membershipSales.individual_year[numType] / wnt.membershipGoals.individual) * 100,
                        'label'
                    ),
                statusClassIndividual: this.meterStatus(
                        this.markerPosition(wnt.yearStart, wnt.yesterday, 365),
                        (wnt.membershipSales.individual_year[numType] / wnt.membershipGoals.individual) * 100,
                        'class'
                    ),
                statusFamily: this.meterStatus(
                        this.markerPosition(wnt.yearStart, wnt.yesterday, 365),
                        (wnt.membershipSales.family_year[numType] / wnt.membershipGoals.family) * 100,
                        'label'
                    ),
                statusClassFamily: this.meterStatus(
                        this.markerPosition(wnt.yearStart, wnt.yesterday, 365),
                        (wnt.membershipSales.family_year[numType] / wnt.membershipGoals.family) * 100,
                        'class'
                    ),
                statusDonor: this.meterStatus(
                        this.markerPosition(wnt.yearStart, wnt.yesterday, 365),
                        (wnt.membershipSales.donor_year[numType] / 10000) * 100,
                        'label'
                    ),
                statusClassDonor: this.meterStatus(
                        this.markerPosition(wnt.yearStart, wnt.yesterday, 365),
                        (wnt.membershipSales.donor_year[numType] / 10000) * 100,
                        'class'
                    )
            });
        }
        event.target.blur();
    },
    filterUnits: function(event){
        // week, month, quarter
        wnt.filter.mgUnits = $(event.target).closest('.filter-units').data('value');


        // var numType = event.target.value;
        var numType = $(event.target).closest('.filter-units').data('value') === 'dollars' ? 'amount' : 'units';
        wnt.membershipSales.filterUnits = numType;
        // LEFT OFF HERE
        console.log('DEBUGGING UNITS', wnt.membershipGoals, wnt.membershipGoals.totalMembershipMonth);
        console.log('DEBUGGING UNITS', wnt.membershipGoals.totalMembershipMonth);
        // When it's units it's dollars and vice versa?
        // How the hell is wnt.membershipGoals different from wnt.membershipGoals.totalMembershipMonth at the same time?!?!?!?!
        $.each($('#mg-units .filter-units'), function(index, item){
            $(item).toggleClass('selected');
        });
        // Initialize goal totals
        var goalFamily = 0;
        var goalIndividual = 0;
        var goalDonor = 0;
        // Loop through months to calculate goal totals
        for(i=1; i<13; i++){
            var key = i;
            goalFamily += wnt.membershipGoals['membership/'+numType].sub_channels.family.months[key.toString()];
            goalIndividual += wnt.membershipGoals['membership/'+numType].sub_channels.individual.months[key.toString()];
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
            var goal = wnt.membershipGoals['membership/'+numType].sub_channels.family.months[month];
            wnt.membershipGoals.familyQuarter += goal;
            // Individual
            goal = wnt.membershipGoals['membership/'+numType].sub_channels.individual.months[month];
            wnt.membershipGoals.individualQuarter += goal;
        }
        wnt.membershipGoals.totalMembershipQuarter = wnt.membershipGoals.familyQuarter + wnt.membershipGoals.individualQuarter;
        var monthNum = wnt.thisMonthNum + 1;
        wnt.membershipGoals.totalMembershipMonth = wnt.membershipGoals['membership/'+numType].sub_channels.family.months[monthNum] + wnt.membershipGoals['membership/'+numType].sub_channels.individual.months[monthNum];
        this.setState({
            goal: wnt.membershipGoals.totalMembership,
            goalFamily: wnt.membershipGoals.family,
            goalIndividual: wnt.membershipGoals.individual,
            goalDonor: this.state.goalDonor,
            memberships: wnt.membershipSales.memberships_year[numType],
            individual: wnt.membershipSales.individual_year[numType],
            family: wnt.membershipSales.family_year[numType],
            donor: wnt.membershipSales.donor_year[numType],
            statusIndividual: this.meterStatus(
                    this.markerPosition(wnt.yearStart, wnt.yesterday, 365),
                    (wnt.membershipSales.individual_year[numType] / wnt.membershipGoals.individual) * 100,
                    'label'
                ),
            statusClassIndividual: this.meterStatus(
                    this.markerPosition(wnt.yearStart, wnt.yesterday, 365),
                    (wnt.membershipSales.individual_year[numType] / wnt.membershipGoals.individual) * 100,
                    'class'
                ),
            statusFamily: this.meterStatus(
                    this.markerPosition(wnt.yearStart, wnt.yesterday, 365),
                    (wnt.membershipSales.family_year[numType] / wnt.membershipGoals.family) * 100,
                    'label'
                ),
            statusClassFamily: this.meterStatus(
                    this.markerPosition(wnt.yearStart, wnt.yesterday, 365),
                    (wnt.membershipSales.family_year[numType] / wnt.membershipGoals.family) * 100,
                    'class'
                ),
            statusDonor: this.meterStatus(
                    this.markerPosition(wnt.yearStart, wnt.yesterday, 365),
                    (wnt.membershipSales.donor_year[numType] / 10000) * 100,
                    'label'
                ),
            statusClassDonor: this.meterStatus(
                    this.markerPosition(wnt.yearStart, wnt.yesterday, 365),
                    (wnt.membershipSales.donor_year[numType] / 10000) * 100,
                    'class'
                )
        });
        this.formatNumbers();
    },
    formatNumbers: function(){
        var symbol = $('#mg-units .selected').data('value') === 'amount' ? '$' : '';
        $('#meter-membership-total .goal-amount').parseNumber({format:symbol+"#,###", locale:"us"});
        $('#meter-membership-total .goal-amount').formatNumber({format:symbol+"#,###", locale:"us"});
        $('#meter-membership-total .current-amount').parseNumber({format:symbol+"#,###", locale:"us"});
        $('#meter-membership-total .current-amount').formatNumber({format:symbol+"#,###", locale:"us"});
        if($('#meter-membership-total .current-amount').html() === '$'){
            $('#meter-membership-total .current-amount').html('$0');
        }
        if($('#meter-membership-total .current-amount').html() === ''){
            $('#meter-membership-total .current-amount').html('0');
        }
        $.each($('#membership-goals .channels .current-amount'), function(index, item){
            if($(this).html() !== '-'){
                $(this).parseNumber({format:symbol+"#,###", locale:"us"});
                $(this).formatNumber({format:symbol+"#,###", locale:"us"});
                if($(this).html() === '$'){
                    $(this).html('$0');
                } else if($(this).html() === ''){
                    $(this).html('0');
                }
            }
        });
        $.each($('#membership-goals .channels .goal-amount'), function(index, item){
            if($(this).html() !== '-'){
                $(this).parseNumber({format:symbol+"#,###", locale:"us"});
                $(this).formatNumber({format:symbol+"#,###", locale:"us"});
                if($(this).html() === '$'){
                    $(this).html('$0');
                } else if($(this).html() === ''){
                    $(this).html('0');
                }
            }
        });
    },
    fillMeters: function(){
        /*
        wnt.filter.sgUnits = 'amount';   // amount
        wnt.filter.sgPeriod = 'year';   // year, month, quarter
        wnt.filter.sgGoal = '###$$$';   //
        */
        var actual = parseInt(wnt.membershipSales.memberships[wnt.filter.mgUnits]);
        var target = parseInt(wnt.filter.mgGoal);
        var completed = Math.round((actual/target)*10000)/100;
        console.log('MEM PERCENTAGE (FILL)', actual, target, completed);   // Default  LEFT OFF HERE
        if(completed < 50) {
            $('#meter-membership-total .meter-status').text('Behind');
        } else if(completed < 75) {
            $('#meter-membership-total .meter-status').text('Behind');
        } else if(completed < 90) {
            $('#meter-membership-total .meter-status').text('Slightly Behind');
        } else if(completed < 110) {
            $('#meter-membership-total .meter-status').text('On Track');
        } else {
            $('#meter-membership-total .meter-status').text('Ahead');
        }
        $('#membership-goals .bar-meter-fill')
            .animate({
                width: completed+'%'
            },
            2000,
            'easeOutElastic'   // easeOutSine
        );
    },
    componentDidUpdate: function(){
        this.formatNumbers();
        $('#membership-goals .bar-meter-marker')
            .animate({
                left: this.state.markerPosition+'%'
            },
            2000,
            'easeOutElastic'
        );
        this.fillMeters();
        $('#membership-goals').height($('#sales-goals').height());
    },
    render: function() {
        return (
            <div>
                <div className="widget" id="membership-goals">
                    <h2>Membership Goals</h2>
                    <ActionMenu />
                    <form>
                        <select className="form-control" onChange={this.filterPeriod}>
                            <option value="year">Current Year ({wnt.thisYear})</option>
                            <option value="quarter">Current Quarter ({wnt.thisQuarterText})</option>
                            <option value="month">Current Month ({wnt.thisMonthText.substring(0,3)})</option>
                        </select>
                        <Caret className="filter-caret" />
                    </form>
                    <div id="mg-units" onClick={this.filterUnits}>
                        <div data-value="amount" className="filter-units selected">
                            Dollars
                            <div className="filter-highlight"></div>
                        </div>
                        <div data-value="units" className="filter-units">
                            Units
                            <div className="filter-highlight"></div>
                        </div>
                    </div>
                    <Meter label="Total Membership Sales" divID="meter-membership-total" amount={this.state.memberships} goal={this.state.goal} />
                    <h3>By Membership Type</h3>
                    <div className="channels">
                        <Meter label="Individual" divID="meter-membership-ind" amount={this.state.individual} goal={this.state.goalIndividual} />
                        <Meter label="Family" divID="meter-membership-fam" amount={this.state.family} goal={this.state.goalFamily} />
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
