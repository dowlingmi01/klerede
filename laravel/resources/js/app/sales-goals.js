/*********************************/
/******** SALES GOALS ROW ********/
/*********************************/

var SalesGoals = React.createClass({
    getInitialState: function() {
        return {
            goal: 16000000,   // TEMP STATIC GOAL (OTHER GOALS ARE STATIC IN HANDLECHANGE)
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
            wnt.salesGoals = result;
            wnt.gettingGoalsData = $.Deferred();
            wnt.getGoals(wnt.thisYear);
            $.when(wnt.gettingGoalsData).done(function(goals) {
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
                    // goalMembership += goals['membership/amount'].months[key.toString()];
                }
                // Set globals for easy access
                wnt.goals.total = goalBoxoffice + goalCafe + goalGiftstore + self.state.goalMembership;
                wnt.goals.boxoffice = goalBoxoffice;
                wnt.goals.cafe = goalCafe;
                wnt.goals.store = goalGiftstore;
                // Loop through array of months in quarter, matching to cooresponding month in the goals, and totalling the amount for the quarter 
                wnt.goals.boxofficeQuarter = 0;
                wnt.goals.cafeQuarter = 0;
                wnt.goals.storeQuarter = 0;
                for(i=0; i<3; i++){
                    var month = wnt.thisQuarterMonths[i];
                    // Gate / Box Office
                    var goal = wnt.goals['gate/amount'].months[month];
                    wnt.goals.boxofficeQuarter += goal;
                    // Cafe
                    goal = wnt.goals['cafe/amount'].months[month];
                    wnt.goals.cafeQuarter += goal;
                    // Store
                    goal = wnt.goals['store/amount'].months[month];
                    wnt.goals.storeQuarter += goal;
                }
                wnt.goals.totalQuarter = wnt.goals.boxofficeQuarter + wnt.goals.cafeQuarter + wnt.goals.storeQuarter + 812500;
                var monthNum = wnt.thisMonthNum + 1;
                wnt.goals.totalMonth = wnt.goals['gate/amount'].months[monthNum] + wnt.goals['cafe/amount'].months[monthNum] + wnt.goals['store/amount'].months[monthNum] + 270833;
                if(self.isMounted()) {
                    self.setState({
                        goal: wnt.goals.total,
                        goalBoxoffice: wnt.goals.boxoffice,
                        goalCafe: wnt.goals.cafe,
                        goalGiftstore: wnt.goals.store,
                        goalMembership: self.state.goalMembership,   // TO DO: Pull from API
                        sales: result.sales_year.amount,
                        barGradient: self.barGradient(
                                self.markerPosition(wnt.yearStart, wnt.yesterday, 365),
                                (result.sales_year.amount / self.state.goal) * 100
                            ),
                        boxoffice: result.boxoffice_year.amount,
                        cafe: result.cafe_year.amount,
                        giftstore: result.giftstore_year.amount,
                        membership: result.membership_year.amount,
                        statusBoxoffice: self.dialStatus(
                                self.markerPosition(wnt.yearStart, wnt.yesterday, 365),
                                (wnt.salesGoals.boxoffice_year.amount / wnt.goals.boxoffice) * 100,
                                'label'
                            ),
                        statusClassBoxoffice: self.dialStatus(
                                self.markerPosition(wnt.yearStart, wnt.yesterday, 365),
                                (wnt.salesGoals.boxoffice_year.amount / wnt.goals.boxoffice) * 100,
                                'class'
                            ),
                        statusCafe: self.dialStatus(
                                self.markerPosition(wnt.yearStart, wnt.yesterday, 365),
                                (wnt.salesGoals.cafe_year.amount / wnt.goals.cafe) * 100,
                                'label'
                            ),
                        statusClassCafe: self.dialStatus(
                                self.markerPosition(wnt.yearStart, wnt.yesterday, 365),
                                (wnt.salesGoals.cafe_year.amount / wnt.goals.cafe) * 100,
                                'class'
                            ),
                        statusGiftstore: self.dialStatus(
                                self.markerPosition(wnt.yearStart, wnt.yesterday, 365),
                                (wnt.salesGoals.giftstore_year.amount / wnt.goals.store) * 100,
                                'label'
                            ),
                        statusClassGiftstore: self.dialStatus(
                                self.markerPosition(wnt.yearStart, wnt.yesterday, 365),
                                (wnt.salesGoals.giftstore_year.amount / wnt.goals.store) * 100,
                                'class'
                            ),
                        statusMembership: self.dialStatus(
                                self.markerPosition(wnt.yearStart, wnt.yesterday, 365),
                                (wnt.salesGoals.membership_year.amount / 3250000) * 100,
                                'label'
                            ),
                        statusClassMembership: self.dialStatus(
                                self.markerPosition(wnt.yearStart, wnt.yesterday, 365),
                                (wnt.salesGoals.membership_year.amount / 3250000) * 100,
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
        window.removeEventListener("resize", this.drawDials);
    },
    handleChange: function(event) {
        var filter = event.target.value;
        if(filter === 'year'){
            this.setState({
                barSegments: wnt.period(0, 12, true),
                goal: wnt.goals.total,
                sales: wnt.salesGoals.sales_year.amount,
                markerPosition: this.markerPosition(wnt.yearStart, wnt.yesterday, 365),
                barGradient: this.barGradient(
                            this.markerPosition(wnt.yearStart, wnt.yesterday, 365),
                            (wnt.salesGoals.sales_year.amount / wnt.goals.total) * 100
                        ),
                boxoffice: wnt.salesGoals.boxoffice_year.amount,
                cafe: wnt.salesGoals.cafe_year.amount,
                giftstore: wnt.salesGoals.giftstore_year.amount,
                membership: wnt.salesGoals.membership_year.amount,
                goalBoxoffice: wnt.goals.boxoffice,
                goalCafe: wnt.goals.cafe,
                goalGiftstore: wnt.goals.store,
                goalMembership: 3250000,
                statusBoxoffice: this.dialStatus(
                        this.markerPosition(wnt.yearStart, wnt.yesterday, 365),
                        (wnt.salesGoals.boxoffice_year.amount / wnt.goals.boxoffice) * 100,
                        'label'
                    ),
                statusClassBoxoffice: this.dialStatus(
                        this.markerPosition(wnt.yearStart, wnt.yesterday, 365),
                        (wnt.salesGoals.boxoffice_year.amount / wnt.goals.boxoffice) * 100,
                        'class'
                    ),
                statusCafe: this.dialStatus(
                        this.markerPosition(wnt.yearStart, wnt.yesterday, 365),
                        (wnt.salesGoals.cafe_year.amount / wnt.goals.cafe) * 100,
                        'label'
                    ),
                statusClassCafe: this.dialStatus(
                        this.markerPosition(wnt.yearStart, wnt.yesterday, 365),
                        (wnt.salesGoals.cafe_year.amount / wnt.goals.cafe) * 100,
                        'class'
                    ),
                statusGiftstore: this.dialStatus(
                        this.markerPosition(wnt.yearStart, wnt.yesterday, 365),
                        (wnt.salesGoals.giftstore_year.amount / wnt.goals.store) * 100,
                        'label'
                    ),
                statusClassGiftstore: this.dialStatus(
                        this.markerPosition(wnt.yearStart, wnt.yesterday, 365),
                        (wnt.salesGoals.giftstore_year.amount / wnt.goals.store) * 100,
                        'class'
                    ),
                statusMembership: this.dialStatus(
                        this.markerPosition(wnt.yearStart, wnt.yesterday, 365),
                        (wnt.salesGoals.membership_year.amount / 3250000) * 100,
                        'label'
                    ),
                statusClassMembership: this.dialStatus(
                        this.markerPosition(wnt.yearStart, wnt.yesterday, 365),
                        (wnt.salesGoals.membership_year.amount / 3250000) * 100,
                        'class'
                    )
            });
        } else if(filter === 'quarter'){
            this.setState({
                barSegments: wnt.period(wnt.thisQuarterNum[0], wnt.thisQuarterNum[1], true),
                goal: wnt.goals.totalQuarter,
                sales: wnt.salesGoals.sales_quarter.amount,
                markerPosition: this.markerPosition(wnt.quarterStart, wnt.yesterday, 91),
                barGradient: this.barGradient(
                            this.markerPosition(wnt.quarterStart, wnt.yesterday, 91),
                            (wnt.salesGoals.sales_quarter.amount / wnt.goals.totalQuarter) * 100
                        ),
                boxoffice: wnt.salesGoals.boxoffice_quarter.amount,
                cafe: wnt.salesGoals.cafe_quarter.amount,
                giftstore: wnt.salesGoals.giftstore_quarter.amount,
                membership: wnt.salesGoals.membership_quarter.amount,
                goalBoxoffice: wnt.goals.boxofficeQuarter,
                goalCafe: wnt.goals.cafeQuarter,
                goalGiftstore: wnt.goals.storeQuarter,
                goalMembership: 812500,
                statusBoxoffice: this.dialStatus(
                        this.markerPosition(wnt.quarterStart, wnt.yesterday, 91),
                        (wnt.salesGoals.boxoffice_quarter.amount / wnt.goals.boxofficeQuarter) * 100,
                        'label'
                    ),
                statusClassBoxoffice: this.dialStatus(
                        this.markerPosition(wnt.quarterStart, wnt.yesterday, 91),
                        (wnt.salesGoals.boxoffice_quarter.amount / wnt.goals.boxofficeQuarter) * 100,
                        'class'
                    ),
                statusCafe: this.dialStatus(
                        this.markerPosition(wnt.quarterStart, wnt.yesterday, 91),
                        (wnt.salesGoals.cafe_quarter.amount / wnt.goals.cafeQuarter) * 100,
                        'label'
                    ),
                statusClassCafe: this.dialStatus(
                        this.markerPosition(wnt.quarterStart, wnt.yesterday, 91),
                        (wnt.salesGoals.cafe_quarter.amount / wnt.goals.cafeQuarter) * 100,
                        'class'
                    ),
                statusGiftstore: this.dialStatus(
                        this.markerPosition(wnt.quarterStart, wnt.yesterday, 91),
                        (wnt.salesGoals.giftstore_quarter.amount / wnt.goals.storeQuarter) * 100,
                        'label'
                    ),
                statusClassGiftstore: this.dialStatus(
                        this.markerPosition(wnt.quarterStart, wnt.yesterday, 91),
                        (wnt.salesGoals.giftstore_quarter.amount / wnt.goals.storeQuarter) * 100,
                        'class'
                    ),
                statusMembership: this.dialStatus(
                        this.markerPosition(wnt.quarterStart, wnt.yesterday, 91),
                        (wnt.salesGoals.membership_quarter.amount / 812500) * 100,
                        'label'
                    ),
                statusClassMembership: this.dialStatus(
                        this.markerPosition(wnt.quarterStart, wnt.yesterday, 91),
                        (wnt.salesGoals.membership_quarter.amount / 812500) * 100,
                        'class'
                    )
            });
        }  else if(filter === 'month'){
            this.setState({
                barSegments: wnt.period(wnt.thisMonthNum, wnt.thisMonthNum, true),
                goal: wnt.goals.totalMonth,
                sales: wnt.salesGoals.sales_month.amount,
                markerPosition: this.markerPosition(wnt.monthStart, wnt.yesterday, 30),
                barGradient: this.barGradient(
                            this.markerPosition(wnt.monthStart, wnt.yesterday, 30),
                            (wnt.salesGoals.sales_month.amount / wnt.goals.totalMonth) * 100
                        ),
                boxoffice: wnt.salesGoals.boxoffice_month.amount,
                cafe: wnt.salesGoals.cafe_month.amount,
                giftstore: wnt.salesGoals.giftstore_month.amount,
                membership: wnt.salesGoals.membership_month.amount,
                goalBoxoffice: wnt.goals['gate/amount'].months[wnt.thisMonthNum + 1],
                goalCafe: wnt.goals['cafe/amount'].months[wnt.thisMonthNum + 1],
                goalGiftstore: wnt.goals['store/amount'].months[wnt.thisMonthNum + 1],
                goalMembership: 270833,
                statusBoxoffice: this.dialStatus(
                        this.markerPosition(wnt.monthStart, wnt.yesterday, 30),
                        (wnt.salesGoals.boxoffice_month.amount / wnt.goals['gate/amount'].months[wnt.thisMonthNum + 1]) * 100,
                        'label'
                    ),
                statusClassBoxoffice: this.dialStatus(
                        this.markerPosition(wnt.monthStart, wnt.yesterday, 30),
                        (wnt.salesGoals.boxoffice_month.amount / wnt.goals['gate/amount'].months[wnt.thisMonthNum + 1]) * 100,
                        'class'
                    ),
                statusCafe: this.dialStatus(
                        this.markerPosition(wnt.monthStart, wnt.yesterday, 30),
                        (wnt.salesGoals.cafe_month.amount / wnt.goals['cafe/amount'].months[wnt.thisMonthNum + 1]) * 100,
                        'label'
                    ),
                statusClassCafe: this.dialStatus(
                        this.markerPosition(wnt.monthStart, wnt.yesterday, 30),
                        (wnt.salesGoals.cafe_month.amount / wnt.goals['cafe/amount'].months[wnt.thisMonthNum + 1]) * 100,
                        'class'
                    ),
                statusGiftstore: this.dialStatus(
                        this.markerPosition(wnt.monthStart, wnt.yesterday, 30),
                        (wnt.salesGoals.giftstore_month.amount / wnt.goals['store/amount'].months[wnt.thisMonthNum + 1]) * 100,
                        'label'
                    ),
                statusClassGiftstore: this.dialStatus(
                        this.markerPosition(wnt.monthStart, wnt.yesterday, 30),
                        (wnt.salesGoals.giftstore_month.amount / wnt.goals['store/amount'].months[wnt.thisMonthNum + 1]) * 100,
                        'class'
                    ),
                statusMembership: this.dialStatus(
                        this.markerPosition(wnt.monthStart, wnt.yesterday, 30),
                        (wnt.salesGoals.membership_month.amount / 270833) * 100,
                        'label'
                    ),
                statusClassMembership: this.dialStatus(
                        this.markerPosition(wnt.monthStart, wnt.yesterday, 30),
                        (wnt.salesGoals.membership_month.amount / 270833) * 100,
                        'class'
                    )
            });
        } else {
            this.setState({
                barSegments: wnt.period(0, 12, true),
                goal: wnt.goals.total,
                sales: wnt.salesGoals.sales_year.amount,
                markerPosition: this.markerPosition(wnt.yearStart, wnt.yesterday, 365),
                barGradient: this.barGradient(
                            this.markerPosition(wnt.yearStart, wnt.yesterday, 365),
                            (wnt.salesGoals.sales_year.amount / wnt.goals.total) * 100
                        ),
                boxoffice: wnt.salesGoals.boxoffice_year.amount,
                cafe: wnt.salesGoals.cafe_year.amount,
                giftstore: wnt.salesGoals.giftstore_year.amount,
                membership: wnt.salesGoals.membership_year.amount,
                goalBoxoffice: wnt.goals.boxoffice,
                goalCafe: wnt.goals.cafe,
                goalGiftstore: wnt.goals.store,
                goalMembership: 3250000,
                statusBoxoffice: this.dialStatus(
                        this.markerPosition(wnt.yearStart, wnt.yesterday, 365),
                        (wnt.salesGoals.boxoffice_year.amount / wnt.goals.boxoffice) * 100,
                        'label'
                    ),
                statusClassBoxoffice: this.dialStatus(
                        this.markerPosition(wnt.yearStart, wnt.yesterday, 365),
                        (wnt.salesGoals.boxoffice_year.amount / wnt.goals.boxoffice) * 100,
                        'class'
                    ),
                statusCafe: this.dialStatus(
                        this.markerPosition(wnt.yearStart, wnt.yesterday, 365),
                        (wnt.salesGoals.cafe_year.amount / wnt.goals.cafe) * 100,
                        'label'
                    ),
                statusClassCafe: this.dialStatus(
                        this.markerPosition(wnt.yearStart, wnt.yesterday, 365),
                        (wnt.salesGoals.cafe_year.amount / wnt.goals.cafe) * 100,
                        'class'
                    ),
                statusGiftstore: this.dialStatus(
                        this.markerPosition(wnt.yearStart, wnt.yesterday, 365),
                        (wnt.salesGoals.giftstore_year.amount / wnt.goals.store) * 100,
                        'label'
                    ),
                statusClassGiftstore: this.dialStatus(
                        this.markerPosition(wnt.yearStart, wnt.yesterday, 365),
                        (wnt.salesGoals.giftstore_year.amount / wnt.goals.store) * 100,
                        'class'
                    ),
                statusMembership: this.dialStatus(
                        this.markerPosition(wnt.yearStart, wnt.yesterday, 365),
                        (wnt.salesGoals.membership_year.amount / 3250000) * 100,
                        'label'
                    ),
                statusClassMembership: this.dialStatus(
                        this.markerPosition(wnt.yearStart, wnt.yesterday, 365),
                        (wnt.salesGoals.membership_year.amount / 3250000) * 100,
                        'class'
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
    drawDials: function() {
        var diameter = 145;
        //var screenSize = window.innerWidth;
        //var dialWidth = $('.dial-wrapper').width() / 4;
        //diameter = screenSize <= 1024 ? dialWidth : 145;   // Set diameter if the screen size is tablet or smaller
        //$('.dial-wrapper .dial').css('width',dialWidth-5);
        
        d3.select('#earned-revenue-channels').selectAll('svg').remove();

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
        $('.channel-info').css('opacity','0')
            .animate({
                opacity: '1'
            },
            1500,
            'easeInSine'
        );

        // Equalize the row height
        $('#total-sales-goals').height($('#earned-revenue-channels').height())

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

if(document.getElementById('sales-goals-widget')){
    React.render(
        <SalesGoals />,
        document.getElementById('sales-goals-widget')
    );
    console.log('Sales Goals row loaded...');
}
