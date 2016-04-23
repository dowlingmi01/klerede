/*********************************/
/******** SALES GOALS ROW ********/
/*********************************/

var SalesGoals = React.createClass({
    getInitialState: function() {
        return {
            goal: 0,   // TEMP STATIC GOAL (OTHER GOALS ARE STATIC IN HANDLECHANGE)
            goalBoxoffice: 4000000,
            goalCafe: 4000000,
            goalGiftstore: 4000000,
            goalMembership: 4000000,

            boxoffice: 0,
            cafe: 0,
            giftstore: 0,
            membership: 0,

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
            >50 <75     = Orange            = Behind            = rgba(235,164,9,1)
            >75 <90     = Yellow            = Slightly Behind   = rgba(255,254,19,1)
            >90 <110    = Yellowish-green   = On Track          = rgba(170,202,55,1)
            >110        = Green             = Ahead             = rgba(72,126,3,1)

            halfBlocksToMiddleOfCurrent = [1, 3, 5, 7, 9]
            Each block counts as 2 so the marker is centered in the color
            (current / halfBlocksToMiddleOfCurrent) * 2HalvesEach 
            The % stops in the gradient are where to start the next color, not the color's width

            Passing in marker position and % complete ... ((amount/goal) * 100)

            linear-gradient(to right, darkgrey 50%, lightgrey 50%)
        */
        var gradient = ['Red', 'Orange', 'Yellow', 'YellowGreen', 'Green'];
        var diff = (current / expected) * 100;
        var band;

        // LEFT OFF HERE: TEMP:
        //return 'darkgrey 78%, lightgrey 78%';
        var actual = parseInt(wnt.sales.filterPeriod[wnt.sales.filterNumType]);
        var target = parseInt(wnt.salesGoals.selected);
        var completed = Math.round((actual/target)*10000)/100;
        console.log('SALES PERCENTAGE', completed);   // Default  LEFT OFF HERE
        if(completed < 100){
            this.setState({ status: 'Behind', statusClass: 'behind' });
            band = Math.round((current / 1) * 2);
            return 'darkgrey '+completed+'%, lightgrey '+completed+'%';
        } else {
            return 'darkgrey';
        }
        
        // TO DO:  MAY NEED TO LEVERAGE FOLLOWING CODE STILL FOR STATUS LABELS
        if(diff < 50) {
            // Behind: Marker (expected) should be in the 'middle' of red
            this.setState({ status: 'Behind', statusClass: 'behind' });
            band = Math.round((current / 1) * 2);
            return 'Red '+(expected)+'%, Orange, Yellow, YellowGreen, Green';
        } else if(diff < 75) {
            // Behind: Marker should be in the 'middle' of orange
            this.setState({ status: 'Behind', statusClass: 'behind' });
            band = Math.round((current / 3) * 2);
            return 'Red, Orange '+(expected)+'%, Yellow, YellowGreen, Green';
        } else if(diff < 90) {
            // Slightly Behind: Marker should be in the 'middle' of yellow
            this.setState({ status: 'Slightly Behind', statusClass: 'slightly-behind' });
            band = Math.round((current / 5) * 2);
            return 'Red, Orange, Yellow '+(expected)+'%, YellowGreen, Green';
        } else if(diff < 110) {
            // On Track: Marker should be in the 'middle' of Yellowish-green
            this.setState({ status: 'On Track', statusClass: 'on-track' });
            band = Math.round((current / 7) * 2);
            return 'Red, Orange, Yellow, YellowGreen '+(expected)+'%, Green';
        } else {
            // Ahead: Marker (expected) should be in the 'middle' of green (expected is % left position 0-100)
            this.setState({ status: 'Ahead', statusClass: 'ahead' });
            band = Math.round((current / 9) * 2);
            return 'Red, Orange, Yellow, YellowGreen, Green '+(expected)+'%';
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
                    sales_year: { specs: { type: 'sales' }, periods: { from: wnt.yearStart, to: wnt.yesterday, kind: 'sum' } },
                    sales_quarter: { specs: { type: 'sales' }, periods: { from: wnt.quarterStart, to: wnt.yesterday, kind: 'sum' } },
                    sales_month: { specs: { type: 'sales' }, periods: { from: wnt.monthStart, to: wnt.yesterday, kind: 'sum' } },

                    boxoffice_year: { specs: { type: 'sales', channel: 'gate' }, periods: { from: wnt.yearStart, to: wnt.yesterday, kind: 'sum' } },
                    boxoffice_quarter: { specs: { type: 'sales', channel: 'gate' }, periods: { from: wnt.quarterStart, to: wnt.yesterday, kind: 'sum' } },
                    boxoffice_month: { specs: { type: 'sales', channel: 'gate' }, periods: { from: wnt.monthStart, to: wnt.yesterday, kind: 'sum' } },
                    
                    cafe_year: { specs: { type: 'sales', channel: 'cafe' }, periods: { from: wnt.yearStart, to: wnt.yesterday, kind: 'sum' } },
                    cafe_quarter: { specs: { type: 'sales', channel: 'cafe' }, periods: { from: wnt.quarterStart, to: wnt.yesterday, kind: 'sum' } },
                    cafe_month: { specs: { type: 'sales', channel: 'cafe' }, periods: { from: wnt.monthStart, to: wnt.yesterday, kind: 'sum' } },
                    
                    giftstore_year: { specs: { type: 'sales', channel: 'store' }, periods: { from: wnt.yearStart, to: wnt.yesterday, kind: 'sum' } },
                    giftstore_quarter: { specs: { type: 'sales', channel: 'store' }, periods: { from: wnt.quarterStart, to: wnt.yesterday, kind: 'sum' } },
                    giftstore_month: { specs: { type: 'sales', channel: 'store' }, periods: { from: wnt.monthStart, to: wnt.yesterday, kind: 'sum' } },
                    
                    membership_year: { specs: { type: 'sales', channel: 'membership' }, periods: { from: wnt.yearStart, to: wnt.yesterday, kind: 'sum' } },
                    membership_quarter: { specs: { type: 'sales', channel: 'membership' }, periods: { from: wnt.quarterStart, to: wnt.yesterday, kind: 'sum' } },
                    membership_month: { specs: { type: 'sales', channel: 'membership' }, periods: { from: wnt.monthStart, to: wnt.yesterday, kind: 'sum' } },

                    visits_year: { specs: { type: 'visits' }, periods: { from: wnt.yearStart, to: wnt.yesterday, kind: 'sum' } },
                    visits_quarter: { specs: { type: 'visits' }, periods: { from: wnt.quarterStart, to: wnt.yesterday, kind: 'sum' } },
                    visits_month: { specs: { type: 'visits' }, periods: { from: wnt.monthStart, to: wnt.yesterday, kind: 'sum' } }
                }
            }
        )
        .done(function(result) {
            console.log('Sales Goals data loaded...');
            wnt.sales = result;
            wnt.sales.filterNumType = 'amount';   // Assume default filter of dollars
            wnt.sales.filterPeriod = wnt.sales.sales_year;   // Default
            wnt.gettingSalesGoalsData = $.Deferred();
            wnt.getGoals(wnt.thisYear, wnt.gettingSalesGoalsData);
            $.when(wnt.gettingSalesGoalsData).done(function(goals) {
                // Set global for easy reuse
                wnt.salesGoals = goals;
                // Initialize goal totals
                var goalBoxoffice = 0;
                var goalCafe = 0;
                var goalGiftstore = 0;
                var goalMembership = 0;
                // Loop through months to calculate goal totals
                for(i=1; i<13; i++){
                    var key = i;
                    goalBoxoffice += goals['gate/amount'].months[key.toString()];
                    goalCafe += goals['cafe/amount'].months[key.toString()];
                    goalGiftstore += goals['store/amount'].months[key.toString()];
                    goalMembership += goals['membership/amount'].sub_channels.family.months[key.toString()];
                    goalMembership += goals['membership/amount'].sub_channels.individual.months[key.toString()];
                }
                // Set globals for easy access
                wnt.salesGoals.total = goalBoxoffice + goalCafe + goalGiftstore + goalMembership;
                wnt.salesGoals.selected = wnt.salesGoals.total;
                wnt.salesGoals.boxoffice = goalBoxoffice;
                wnt.salesGoals.cafe = goalCafe;
                wnt.salesGoals.store = goalGiftstore;
                wnt.salesGoals.membership = goalMembership;
                // Loop through array of months in quarter, matching to cooresponding month in the goals, and totalling the amount for the quarter 
                wnt.salesGoals.boxofficeQuarter = 0;
                wnt.salesGoals.cafeQuarter = 0;
                wnt.salesGoals.storeQuarter = 0;
                wnt.salesGoals.membershipQuarter = 0;
                for(i=0; i<3; i++){
                    var month = wnt.thisQuarterMonths[i];
                    // Gate / Box Office
                    var goal = wnt.salesGoals['gate/amount'].months[month];
                    wnt.salesGoals.boxofficeQuarter += goal;
                    // Cafe
                    goal = wnt.salesGoals['cafe/amount'].months[month];
                    wnt.salesGoals.cafeQuarter += goal;
                    // Store
                    goal = wnt.salesGoals['store/amount'].months[month];
                    wnt.salesGoals.storeQuarter += goal;
                    // Membership
                    goal = wnt.salesGoals['membership/amount'].sub_channels.family.months[month];
                    goal += wnt.salesGoals['membership/amount'].sub_channels.individual.months[month];
                    wnt.salesGoals.membershipQuarter += goal;
                }
                wnt.salesGoals.totalQuarter = wnt.salesGoals.boxofficeQuarter + wnt.salesGoals.cafeQuarter + wnt.salesGoals.storeQuarter + wnt.salesGoals.membershipQuarter;
                var monthNum = wnt.thisMonthNum + 1;
                wnt.salesGoals.totalMonth = wnt.salesGoals['gate/amount'].months[monthNum] + wnt.salesGoals['cafe/amount'].months[monthNum] + wnt.salesGoals['store/amount'].months[monthNum] + wnt.salesGoals['membership/amount'].sub_channels.family.months[monthNum] + wnt.salesGoals['membership/amount'].sub_channels.individual.months[monthNum];
                if(self.isMounted()) {
                    self.setState({
                        goal: wnt.salesGoals.total,
                        goalBoxoffice: wnt.salesGoals.boxoffice,
                        goalCafe: wnt.salesGoals.cafe,
                        goalGiftstore: wnt.salesGoals.store,
                        goalMembership: wnt.salesGoals.membership,
                        sales: result.sales_year.amount,
                        barGradient: self.barGradient(
                                self.markerPosition(wnt.yearStart, wnt.yesterday, 365),
                                (result.sales_year.amount / wnt.salesGoals.total) * 100
                            ),
                        boxoffice: result.boxoffice_year.amount,
                        cafe: result.cafe_year.amount,
                        giftstore: result.giftstore_year.amount,
                        membership: result.membership_year.amount,
                        statusBoxoffice: self.dialStatus(
                                self.markerPosition(wnt.yearStart, wnt.yesterday, 365),
                                (wnt.sales.boxoffice_year.amount / wnt.salesGoals.boxoffice) * 100,
                                'label'
                            ),
                        statusClassBoxoffice: self.dialStatus(
                                self.markerPosition(wnt.yearStart, wnt.yesterday, 365),
                                (wnt.sales.boxoffice_year.amount / wnt.salesGoals.boxoffice) * 100,
                                'class'
                            ),
                        statusCafe: self.dialStatus(
                                self.markerPosition(wnt.yearStart, wnt.yesterday, 365),
                                (wnt.sales.cafe_year.amount / wnt.salesGoals.cafe) * 100,
                                'label'
                            ),
                        statusClassCafe: self.dialStatus(
                                self.markerPosition(wnt.yearStart, wnt.yesterday, 365),
                                (wnt.sales.cafe_year.amount / wnt.salesGoals.cafe) * 100,
                                'class'
                            ),
                        statusGiftstore: self.dialStatus(
                                self.markerPosition(wnt.yearStart, wnt.yesterday, 365),
                                (wnt.sales.giftstore_year.amount / wnt.salesGoals.store) * 100,
                                'label'
                            ),
                        statusClassGiftstore: self.dialStatus(
                                self.markerPosition(wnt.yearStart, wnt.yesterday, 365),
                                (wnt.sales.giftstore_year.amount / wnt.salesGoals.store) * 100,
                                'class'
                            ),
                        statusMembership: self.dialStatus(
                                self.markerPosition(wnt.yearStart, wnt.yesterday, 365),
                                (wnt.sales.membership_year.amount / wnt.salesGoals.membership) * 100,
                                'label'
                            ),
                        statusClassMembership: self.dialStatus(
                                self.markerPosition(wnt.yearStart, wnt.yesterday, 365),
                                (wnt.sales.membership_year.amount / wnt.salesGoals.membership) * 100,
                                'class'
                            )
                    });
                    self.formatNumbers();
                }
            });
        }.bind(this))   // .bind() gives context to 'this'
        .fail(function(result) {
            console.log('SALES GOALS DATA ERROR! ... ' + result.statusText);
        });
        window.addEventListener("resize", this.drawDials);
    },
    componentWillUnmount: function() {
        //
        window.removeEventListener("resize", this.drawDials);
    },
    handleChange: function(event) {
        var filter = event.target.value;
        if(filter === 'year'){
            wnt.sales.filterPeriod = wnt.sales.sales_year;
            wnt.salesGoals.selected = wnt.salesGoals.total;
            this.setState({
                barSegments: wnt.period(0, 12, true),
                goal: wnt.salesGoals.total,
                sales: wnt.sales.sales_year.amount,
                markerPosition: this.markerPosition(wnt.yearStart, wnt.yesterday, 365),
                barGradient: this.barGradient(
                            this.markerPosition(wnt.yearStart, wnt.yesterday, 365),
                            (wnt.sales.sales_year.amount / wnt.salesGoals.total) * 100
                        ),
                boxoffice: wnt.sales.boxoffice_year.amount,
                cafe: wnt.sales.cafe_year.amount,
                giftstore: wnt.sales.giftstore_year.amount,
                membership: wnt.sales.membership_year.amount,
                goalBoxoffice: wnt.salesGoals.boxoffice,
                goalCafe: wnt.salesGoals.cafe,
                goalGiftstore: wnt.salesGoals.store,
                goalMembership: wnt.salesGoals.membership,
                statusBoxoffice: this.dialStatus(
                        this.markerPosition(wnt.yearStart, wnt.yesterday, 365),
                        (wnt.sales.boxoffice_year.amount / wnt.salesGoals.boxoffice) * 100,
                        'label'
                    ),
                statusClassBoxoffice: this.dialStatus(
                        this.markerPosition(wnt.yearStart, wnt.yesterday, 365),
                        (wnt.sales.boxoffice_year.amount / wnt.salesGoals.boxoffice) * 100,
                        'class'
                    ),
                statusCafe: this.dialStatus(
                        this.markerPosition(wnt.yearStart, wnt.yesterday, 365),
                        (wnt.sales.cafe_year.amount / wnt.salesGoals.cafe) * 100,
                        'label'
                    ),
                statusClassCafe: this.dialStatus(
                        this.markerPosition(wnt.yearStart, wnt.yesterday, 365),
                        (wnt.sales.cafe_year.amount / wnt.salesGoals.cafe) * 100,
                        'class'
                    ),
                statusGiftstore: this.dialStatus(
                        this.markerPosition(wnt.yearStart, wnt.yesterday, 365),
                        (wnt.sales.giftstore_year.amount / wnt.salesGoals.store) * 100,
                        'label'
                    ),
                statusClassGiftstore: this.dialStatus(
                        this.markerPosition(wnt.yearStart, wnt.yesterday, 365),
                        (wnt.sales.giftstore_year.amount / wnt.salesGoals.store) * 100,
                        'class'
                    ),
                statusMembership: this.dialStatus(
                        this.markerPosition(wnt.yearStart, wnt.yesterday, 365),
                        (wnt.sales.membership_year.amount / wnt.salesGoals.membership) * 100,
                        'label'
                    ),
                statusClassMembership: this.dialStatus(
                        this.markerPosition(wnt.yearStart, wnt.yesterday, 365),
                        (wnt.sales.membership_year.amount / wnt.salesGoals.membership) * 100,
                        'class'
                    )
            });
        } else if(filter === 'quarter'){
            wnt.sales.filterPeriod = wnt.sales.sales_quarter;
            wnt.salesGoals.selected = wnt.salesGoals.totalQuarter;
            this.setState({
                barSegments: wnt.period(wnt.thisQuarterNum[0], wnt.thisQuarterNum[1], true),
                goal: wnt.salesGoals.totalQuarter,
                sales: wnt.sales.sales_quarter.amount,
                markerPosition: this.markerPosition(wnt.quarterStart, wnt.yesterday, 91),
                barGradient: this.barGradient(
                            this.markerPosition(wnt.quarterStart, wnt.yesterday, 91),
                            (wnt.sales.sales_quarter.amount / wnt.salesGoals.totalQuarter) * 100
                        ),
                boxoffice: wnt.sales.boxoffice_quarter.amount,
                cafe: wnt.sales.cafe_quarter.amount,
                giftstore: wnt.sales.giftstore_quarter.amount,
                membership: wnt.sales.membership_quarter.amount,
                goalBoxoffice: wnt.salesGoals.boxofficeQuarter,
                goalCafe: wnt.salesGoals.cafeQuarter,
                goalGiftstore: wnt.salesGoals.storeQuarter,
                goalMembership: wnt.salesGoals.membershipQuarter,
                statusBoxoffice: this.dialStatus(
                        this.markerPosition(wnt.quarterStart, wnt.yesterday, 91),
                        (wnt.sales.boxoffice_quarter.amount / wnt.salesGoals.boxofficeQuarter) * 100,
                        'label'
                    ),
                statusClassBoxoffice: this.dialStatus(
                        this.markerPosition(wnt.quarterStart, wnt.yesterday, 91),
                        (wnt.sales.boxoffice_quarter.amount / wnt.salesGoals.boxofficeQuarter) * 100,
                        'class'
                    ),
                statusCafe: this.dialStatus(
                        this.markerPosition(wnt.quarterStart, wnt.yesterday, 91),
                        (wnt.sales.cafe_quarter.amount / wnt.salesGoals.cafeQuarter) * 100,
                        'label'
                    ),
                statusClassCafe: this.dialStatus(
                        this.markerPosition(wnt.quarterStart, wnt.yesterday, 91),
                        (wnt.sales.cafe_quarter.amount / wnt.salesGoals.cafeQuarter) * 100,
                        'class'
                    ),
                statusGiftstore: this.dialStatus(
                        this.markerPosition(wnt.quarterStart, wnt.yesterday, 91),
                        (wnt.sales.giftstore_quarter.amount / wnt.salesGoals.storeQuarter) * 100,
                        'label'
                    ),
                statusClassGiftstore: this.dialStatus(
                        this.markerPosition(wnt.quarterStart, wnt.yesterday, 91),
                        (wnt.sales.giftstore_quarter.amount / wnt.salesGoals.storeQuarter) * 100,
                        'class'
                    ),
                statusMembership: this.dialStatus(
                        this.markerPosition(wnt.quarterStart, wnt.yesterday, 91),
                        (wnt.sales.membership_quarter.amount / wnt.salesGoals.membershipQuarter) * 100,
                        'label'
                    ),
                statusClassMembership: this.dialStatus(
                        this.markerPosition(wnt.quarterStart, wnt.yesterday, 91),
                        (wnt.sales.membership_quarter.amount / wnt.salesGoals.membershipQuarter) * 100,
                        'class'
                    )
            });
        }  else if(filter === 'month'){
            wnt.sales.filterPeriod = wnt.sales.sales_month;
            wnt.salesGoals.selected = wnt.salesGoals.totalMonth;
            // TO DO: Allow for units too in membership goal
            var membershipMonth = wnt.salesGoals['membership/amount'].sub_channels.family.months[wnt.thisMonthNum + 1] + wnt.salesGoals['membership/amount'].sub_channels.individual.months[wnt.thisMonthNum + 1];
            this.setState({
                barSegments: wnt.period(wnt.thisMonthNum, wnt.thisMonthNum, true),
                goal: wnt.salesGoals.totalMonth,
                sales: wnt.sales.sales_month.amount,
                markerPosition: this.markerPosition(wnt.monthStart, wnt.yesterday, 30),
                barGradient: this.barGradient(
                            this.markerPosition(wnt.monthStart, wnt.yesterday, 30),
                            (wnt.sales.sales_month.amount / wnt.salesGoals.totalMonth) * 100
                        ),
                boxoffice: wnt.sales.boxoffice_month.amount,
                cafe: wnt.sales.cafe_month.amount,
                giftstore: wnt.sales.giftstore_month.amount,
                membership: wnt.sales.membership_month.amount,
                goalBoxoffice: wnt.salesGoals['gate/amount'].months[wnt.thisMonthNum + 1],
                goalCafe: wnt.salesGoals['cafe/amount'].months[wnt.thisMonthNum + 1],
                goalGiftstore: wnt.salesGoals['store/amount'].months[wnt.thisMonthNum + 1],
                goalMembership: membershipMonth,
                statusBoxoffice: this.dialStatus(
                        this.markerPosition(wnt.monthStart, wnt.yesterday, 30),
                        (wnt.sales.boxoffice_month.amount / wnt.salesGoals['gate/amount'].months[wnt.thisMonthNum + 1]) * 100,
                        'label'
                    ),
                statusClassBoxoffice: this.dialStatus(
                        this.markerPosition(wnt.monthStart, wnt.yesterday, 30),
                        (wnt.sales.boxoffice_month.amount / wnt.salesGoals['gate/amount'].months[wnt.thisMonthNum + 1]) * 100,
                        'class'
                    ),
                statusCafe: this.dialStatus(
                        this.markerPosition(wnt.monthStart, wnt.yesterday, 30),
                        (wnt.sales.cafe_month.amount / wnt.salesGoals['cafe/amount'].months[wnt.thisMonthNum + 1]) * 100,
                        'label'
                    ),
                statusClassCafe: this.dialStatus(
                        this.markerPosition(wnt.monthStart, wnt.yesterday, 30),
                        (wnt.sales.cafe_month.amount / wnt.salesGoals['cafe/amount'].months[wnt.thisMonthNum + 1]) * 100,
                        'class'
                    ),
                statusGiftstore: this.dialStatus(
                        this.markerPosition(wnt.monthStart, wnt.yesterday, 30),
                        (wnt.sales.giftstore_month.amount / wnt.salesGoals['store/amount'].months[wnt.thisMonthNum + 1]) * 100,
                        'label'
                    ),
                statusClassGiftstore: this.dialStatus(
                        this.markerPosition(wnt.monthStart, wnt.yesterday, 30),
                        (wnt.sales.giftstore_month.amount / wnt.salesGoals['store/amount'].months[wnt.thisMonthNum + 1]) * 100,
                        'class'
                    ),
                statusMembership: this.dialStatus(
                        this.markerPosition(wnt.monthStart, wnt.yesterday, 30),
                        (wnt.sales.membership_month.amount / membershipMonth) * 100,
                        'label'
                    ),
                statusClassMembership: this.dialStatus(
                        this.markerPosition(wnt.monthStart, wnt.yesterday, 30),
                        (wnt.sales.membership_month.amount / membershipMonth) * 100,
                        'class'
                    )
            });
        } else {
            wnt.sales.filterPeriod = wnt.sales.sales_year;
            wnt.salesGoals.selected = wnt.salesGoals.total;
            this.setState({
                barSegments: wnt.period(0, 12, true),
                goal: wnt.salesGoals.total,
                sales: wnt.sales.sales_year.amount,
                markerPosition: this.markerPosition(wnt.yearStart, wnt.yesterday, 365),
                barGradient: this.barGradient(
                            this.markerPosition(wnt.yearStart, wnt.yesterday, 365),
                            (wnt.sales.sales_year.amount / wnt.salesGoals.total) * 100
                        ),
                boxoffice: wnt.sales.boxoffice_year.amount,
                cafe: wnt.sales.cafe_year.amount,
                giftstore: wnt.sales.giftstore_year.amount,
                membership: wnt.sales.membership_year.amount,
                goalBoxoffice: wnt.salesGoals.boxoffice,
                goalCafe: wnt.salesGoals.cafe,
                goalGiftstore: wnt.salesGoals.store,
                goalMembership: wnt.salesGoals.membership,
                statusBoxoffice: this.dialStatus(
                        this.markerPosition(wnt.yearStart, wnt.yesterday, 365),
                        (wnt.sales.boxoffice_year.amount / wnt.salesGoals.boxoffice) * 100,
                        'label'
                    ),
                statusClassBoxoffice: this.dialStatus(
                        this.markerPosition(wnt.yearStart, wnt.yesterday, 365),
                        (wnt.sales.boxoffice_year.amount / wnt.salesGoals.boxoffice) * 100,
                        'class'
                    ),
                statusCafe: this.dialStatus(
                        this.markerPosition(wnt.yearStart, wnt.yesterday, 365),
                        (wnt.sales.cafe_year.amount / wnt.salesGoals.cafe) * 100,
                        'label'
                    ),
                statusClassCafe: this.dialStatus(
                        this.markerPosition(wnt.yearStart, wnt.yesterday, 365),
                        (wnt.sales.cafe_year.amount / wnt.salesGoals.cafe) * 100,
                        'class'
                    ),
                statusGiftstore: this.dialStatus(
                        this.markerPosition(wnt.yearStart, wnt.yesterday, 365),
                        (wnt.sales.giftstore_year.amount / wnt.salesGoals.store) * 100,
                        'label'
                    ),
                statusClassGiftstore: this.dialStatus(
                        this.markerPosition(wnt.yearStart, wnt.yesterday, 365),
                        (wnt.sales.giftstore_year.amount / wnt.salesGoals.store) * 100,
                        'class'
                    ),
                statusMembership: this.dialStatus(
                        this.markerPosition(wnt.yearStart, wnt.yesterday, 365),
                        (wnt.sales.membership_year.amount / wnt.salesGoals.membership) * 100,
                        'label'
                    ),
                statusClassMembership: this.dialStatus(
                        this.markerPosition(wnt.yearStart, wnt.yesterday, 365),
                        (wnt.sales.membership_year.amount / wnt.salesGoals.membership) * 100,
                        'class'
                    )
            });
        }
        event.target.blur();
    },
    formatNumbers: function(){
        $('#total-sales-goals .goal-amount').parseNumber({format:"$#,###", locale:"us"});
        $('#total-sales-goals .goal-amount').formatNumber({format:"$#,###", locale:"us"});
        $('#total-sales-goals .current-amount').parseNumber({format:"$#,###", locale:"us"});
        $('#total-sales-goals .current-amount').formatNumber({format:"$#,###", locale:"us"});
        // Fix for 0 (null) values
        if($('#total-sales-goals .current-amount').html() === '$'){
            $('#total-sales-goals .current-amount').html('$0');
        }
        $.each($('#earned-revenue-channels .channel-amount'), function(index, item){
            if($(this).html() !== '-'){
                $(this).parseNumber({format:"$#,###", locale:"us"});
                $(this).formatNumber({format:"$#,###", locale:"us"});
                if($(this).html() === '$'){
                    $(this).html('$0');
                }
            }
        });
        $.each($('#earned-revenue-channels .amount'), function(index, item){
            if($(this).html() !== '-'){
                $(this).parseNumber({format:"$#,###", locale:"us"});
                $(this).formatNumber({format:"$#,###", locale:"us"});
                if($(this).html() === '$'){
                    $(this).html('$0');
                }
            }
        });
    },
    drawDials: function() {
        var diameter = 145;
        //var screenSize = window.innerWidth;
        //var dialWidth = $('.dial-wrapper').width() / 4;
        //diameter = screenSize <= 1024 ? dialWidth : 145;   // Set diameter if the screen size is tablet or smaller
        //$('.dial-wrapper .dial').css('width',dialWidth-5);
        
        d3.select('#earned-revenue-channels .dial-wrapper').selectAll('svg').remove();

        var rp1 = radialProgress(document.getElementById('div1'))
            .label('')
            .diameter(diameter)
            .value((this.state.boxoffice / this.state.goalBoxoffice) * 100)
            .render();

        var rp2 = radialProgress(document.getElementById('div2'))
            .label('')
            .diameter(diameter)
            .value((this.state.cafe / this.state.goalCafe) * 100)
            .render();

        var rp3 = radialProgress(document.getElementById('div3'))
            .label('')
            .diameter(diameter)
            .value((this.state.giftstore / this.state.goalGiftstore) * 100)
            .render();

        var rp4 = radialProgress(document.getElementById('div4'))
            .label('')
            .diameter(diameter)
            .value((this.state.membership / this.state.goalMembership) * 100)
            .render();

        // Generate the starting point markers
        for(i=1; i<5; i++){
            var startMark = d3.select('#div'+i).selectAll('svg').append("line")
                .attr("x1", 58)
                .attr("y1", -2)
                .attr("x2", 58)
                .attr("y2", 11)
                .attr("stroke-width", "3");
        }

        // Show the details
        $('#earned-revenue-channels .channel-info').css('opacity','0')
            .animate({
                opacity: '1'
            },
            1500,
            'easeInSine'
        );

        // Equalize the row height
        // $('#total-sales-goals').height($('#earned-revenue-channels').height())

        // Set the goal dots
        this.setDots();
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
        d3.select('#earned-revenue-channels').selectAll('circle').remove();
        d3.select('#earned-revenue-channels').selectAll('svg').append("circle")
            .attr("r", 8)
            .attr("cx", dotX)
            .attr("cy", dotY)
            .attr("fill", "rgba(66,66,66,1)")
            .attr("data-toggle", "popover")
            .attr("data-html", "true")
            .attr("data-content", this.state.boxoffice)
            .attr("data-placement", "top");
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
        this.drawDials();
    },
    render: function() {
        var gradient = {
            background: 'linear-gradient(to right, '+this.state.barGradient+')'
        };
        return (
            <div>
                <div className="widget" id="total-sales-goals">
                    <h2>Sales Goals</h2>
                    <form>
                        <select className="form-control" onChange={this.handleChange}>
                            <option value="year">Current Year ({wnt.thisYear})</option>
                            <option value="quarter">Current Quarter ({wnt.thisQuarterText})</option>
                            <option value="month">Current Month ({wnt.thisMonthText.substring(0,3)})</option>
                            <option value="custom">Custom</option>
                        </select>
                        <Caret className="filter-caret" />
                    </form>
                    <div id="sg-units">
                        <div data-value="dollars" className="filter-units selected">
                            Dollars
                            <div className="filter-highlight"></div>
                        </div>
                    </div>

                    <div className="meter-group clear">
                        <div className="meter-label">Total Sales</div>
                        <div className="meter-status">{this.state.status}</div>
                        <div className="bar-meter clear" style={gradient}>
                            <div className="bar-meter-marker"></div>
                        </div>
                        <div className="meter-reading">
                            (<span className="current-amount">{this.state.sales}</span> of <span className="goal-amount">{this.state.goal}</span>)
                        </div>
                    </div>



                </div>
                <div className="widget" id="earned-revenue-channels">
                    <h3>By Channel</h3>
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
        );
    }
});

if(document.getElementById('sales-goals-widget')){
    React.render(
        <SalesGoals />,
        document.getElementById('sales-goals-widget')
    );
    console.log('Sales Goals row loaded...');
}
