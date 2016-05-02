/*********************************/
/******** SALES GOALS ROW ********/
/*********************************/

var SalesGoals = React.createClass({
    getInitialState: function() {
        return {
            goal: 0,   // TEMP STATIC GOAL (OTHER GOALS ARE STATIC IN filterPeriod)
            goalBoxoffice: 4000000,
            goalCafe: 4000000,
            goalGiftstore: 4000000,
            goalMembership: 4000000,

            boxoffice: 0,
            cafe: 0,
            giftstore: 0,
            membership: 0,

            statusBoxoffice: 'On Track',
            statusCafe: 'On Track',
            statusGiftstore: 'On Track',
            statusMembership: 'On Track',

            statusClassBoxoffice: 'on-track',
            statusClassCafe: 'on-track',
            statusClassGiftstore: 'on-track',
            statusClassMembership: 'on-track',

            markerPosition: this.markerPosition(wnt.yearStart, wnt.yesterday, 365),
        };
    },
    callAPI: function(){
        // LEFT OFF HERE: TO DO: Remove membership calculations from totals
        var self = this;
        var periodStart = wnt.yearStart;
        var periodEnd = wnt.yesterday;
        var periodDays = 365;
        if(wnt.filter.sgPeriod === 'quarter'){
            periodStart = wnt.quarterStart;
            periodDays = 91;
        } else if(wnt.filter.sgPeriod === 'month'){
            periodStart = wnt.monthStart;
            periodDays = 30;
        }
        console.log('SALES PERIOD', periodStart, periodEnd);
        $.post(
            wnt.apiMain,
            {
                venue_id: wnt.venueID,
                queries: {
                    sales: { specs: { type: 'sales' }, periods: { from: periodStart, to: periodEnd, kind: 'sum' } },
                    sales_year: { specs: { type: 'sales' }, periods: { from: wnt.yearStart, to: wnt.yesterday, kind: 'sum' } },
                    sales_quarter: { specs: { type: 'sales' }, periods: { from: wnt.quarterStart, to: wnt.yesterday, kind: 'sum' } },
                    sales_month: { specs: { type: 'sales' }, periods: { from: wnt.monthStart, to: wnt.yesterday, kind: 'sum' } },

                    boxoffice: { specs: { type: 'sales', channel: 'gate' }, periods: { from: periodStart, to: periodEnd, kind: 'sum' } },
                    boxoffice_year: { specs: { type: 'sales', channel: 'gate' }, periods: { from: wnt.yearStart, to: wnt.yesterday, kind: 'sum' } },
                    boxoffice_quarter: { specs: { type: 'sales', channel: 'gate' }, periods: { from: wnt.quarterStart, to: wnt.yesterday, kind: 'sum' } },
                    boxoffice_month: { specs: { type: 'sales', channel: 'gate' }, periods: { from: wnt.monthStart, to: wnt.yesterday, kind: 'sum' } },
                    
                    cafe: { specs: { type: 'sales', channel: 'cafe' }, periods: { from: periodStart, to: periodEnd, kind: 'sum' } },
                    cafe_year: { specs: { type: 'sales', channel: 'cafe' }, periods: { from: wnt.yearStart, to: wnt.yesterday, kind: 'sum' } },
                    cafe_quarter: { specs: { type: 'sales', channel: 'cafe' }, periods: { from: wnt.quarterStart, to: wnt.yesterday, kind: 'sum' } },
                    cafe_month: { specs: { type: 'sales', channel: 'cafe' }, periods: { from: wnt.monthStart, to: wnt.yesterday, kind: 'sum' } },
                    
                    giftstore: { specs: { type: 'sales', channel: 'store' }, periods: { from: periodStart, to: periodEnd, kind: 'sum' } },
                    giftstore_year: { specs: { type: 'sales', channel: 'store' }, periods: { from: wnt.yearStart, to: wnt.yesterday, kind: 'sum' } },
                    giftstore_quarter: { specs: { type: 'sales', channel: 'store' }, periods: { from: wnt.quarterStart, to: wnt.yesterday, kind: 'sum' } },
                    giftstore_month: { specs: { type: 'sales', channel: 'store' }, periods: { from: wnt.monthStart, to: wnt.yesterday, kind: 'sum' } },
                    
                    membership: { specs: { type: 'sales', channel: 'membership' }, periods: { from: periodStart, to: periodEnd, kind: 'sum' } },
                    membership_year: { specs: { type: 'sales', channel: 'membership' }, periods: { from: wnt.yearStart, to: wnt.yesterday, kind: 'sum' } },
                    membership_quarter: { specs: { type: 'sales', channel: 'membership' }, periods: { from: wnt.quarterStart, to: wnt.yesterday, kind: 'sum' } },
                    membership_month: { specs: { type: 'sales', channel: 'membership' }, periods: { from: wnt.monthStart, to: wnt.yesterday, kind: 'sum' } },

                    visits: { specs: { type: 'visits' }, periods: { from: periodStart, to: periodEnd, kind: 'sum' } },
                    visits_year: { specs: { type: 'visits' }, periods: { from: wnt.yearStart, to: wnt.yesterday, kind: 'sum' } },
                    visits_quarter: { specs: { type: 'visits' }, periods: { from: wnt.quarterStart, to: wnt.yesterday, kind: 'sum' } },
                    visits_month: { specs: { type: 'visits' }, periods: { from: wnt.monthStart, to: wnt.yesterday, kind: 'sum' } }
                }
            }
        )
        .done(function(result) {
            console.log('Sales Goals data loaded...');
            wnt.sales = result;
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
                wnt.filter.sgGoal = wnt.salesGoals.total;
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
                        sales: result.sales.amount,
                        boxoffice: result.boxoffice.amount,
                        cafe: result.cafe.amount,
                        giftstore: result.giftstore.amount,
                        membership: result.membership.amount,
                        statusBoxoffice: self.meterStatus(
                                self.markerPosition(wnt.yearStart, wnt.yesterday, periodDays),
                                (wnt.sales.boxoffice.amount / wnt.salesGoals.boxoffice) * 100,
                                'label'
                            ),
                        statusClassBoxoffice: self.meterStatus(
                                self.markerPosition(wnt.yearStart, wnt.yesterday, periodDays),
                                (wnt.sales.boxoffice.amount / wnt.salesGoals.boxoffice) * 100,
                                'class'
                            ),
                        statusCafe: self.meterStatus(
                                self.markerPosition(wnt.yearStart, wnt.yesterday, periodDays),
                                (wnt.sales.cafe.amount / wnt.salesGoals.cafe) * 100,
                                'label'
                            ),
                        statusClassCafe: self.meterStatus(
                                self.markerPosition(wnt.yearStart, wnt.yesterday, periodDays),
                                (wnt.sales.cafe.amount / wnt.salesGoals.cafe) * 100,
                                'class'
                            ),
                        statusGiftstore: self.meterStatus(
                                self.markerPosition(wnt.yearStart, wnt.yesterday, periodDays),
                                (wnt.sales.giftstore.amount / wnt.salesGoals.store) * 100,
                                'label'
                            ),
                        statusClassGiftstore: self.meterStatus(
                                self.markerPosition(wnt.yearStart, wnt.yesterday, periodDays),
                                (wnt.sales.giftstore.amount / wnt.salesGoals.store) * 100,
                                'class'
                            ),
                        statusMembership: self.meterStatus(
                                self.markerPosition(wnt.yearStart, wnt.yesterday, periodDays),
                                (wnt.sales.membership.amount / wnt.salesGoals.membership) * 100,
                                'label'
                            ),
                        statusClassMembership: self.meterStatus(
                                self.markerPosition(wnt.yearStart, wnt.yesterday, periodDays),
                                (wnt.sales.membership.amount / wnt.salesGoals.membership) * 100,
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
        console.log('SALES CALL API', wnt.filter.sgUnits, wnt.filter.sgPeriod);
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
        wnt.filter.sgUnits = 'amount';   // amount
        wnt.filter.sgPeriod = 'year';   // year, month, quarter
        this.callAPI();
    },
    filterPeriod: function(event) {   // LEFT OFF HERE: changing method names and working on callAPI
        // week, month, quarter
        wnt.filter.sgPeriod = event.target.value;
        this.callAPI();
        event.target.blur();
    },
    formatNumbers: function(){
        $('#meter-sales-total .goal-amount').parseNumber({format:"$#,###", locale:"us"});
        $('#meter-sales-total .goal-amount').formatNumber({format:"$#,###", locale:"us"});
        $('#meter-sales-total .current-amount').parseNumber({format:"$#,###", locale:"us"});
        $('#meter-sales-total .current-amount').formatNumber({format:"$#,###", locale:"us"});
        // Fix for 0 (null) values
        if($('#meter-sales-total .current-amount').html() === '$'){
            $('#meter-sales-total .current-amount').html('$0');
        }
        $.each($('#sales-goals .channels .current-amount'), function(index, item){
            if($(this).html() !== '-'){
                $(this).parseNumber({format:"$#,###", locale:"us"});
                $(this).formatNumber({format:"$#,###", locale:"us"});
                if($(this).html() === '$'){
                    $(this).html('$0');
                }
            }
        });
        $.each($('#sales-goals .channels .goal-amount'), function(index, item){
            if($(this).html() !== '-'){
                $(this).parseNumber({format:"$#,###", locale:"us"});
                $(this).formatNumber({format:"$#,###", locale:"us"});
                if($(this).html() === '$'){
                    $(this).html('$0');
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
        var actual = parseInt(wnt.sales.sales[wnt.filter.sgUnits]);
        var target = parseInt(wnt.filter.sgGoal);
        var completed = Math.round((actual/target)*10000)/100;
        console.log('SALES PERCENTAGE (FILL)', completed);   // Default  LEFT OFF HERE
        if(completed < 50) {
            $('#meter-sales-total .meter-status').text('Behind');
        } else if(completed < 75) {
            $('#meter-sales-total .meter-status').text('Behind');
        } else if(completed < 90) {
            $('#meter-sales-total .meter-status').text('Slightly Behind');
        } else if(completed < 110) {
            $('#meter-sales-total .meter-status').text('On Track');
        } else {
            $('#meter-sales-total .meter-status').text('Ahead');
        }
        $('#sales-goals .bar-meter-fill')
            .animate({
                width: completed+'%'
            },
            2000,
            'easeOutElastic'   // easeOutSine
        );
    },
    componentDidUpdate: function(){
        this.formatNumbers();
        $('#sales-goals .bar-meter-marker')
            .animate({
                left: this.state.markerPosition+'%'
            },
            2000,
            'easeOutElastic'
        );
        this.fillMeters();
    },
    render: function() {
        return (
            <div>
                <div className="widget" id="sales-goals">
                    <h2>Sales Goals</h2>                    
                    <ActionMenu />
                    <form>
                        <select className="form-control" onChange={this.filterPeriod}>
                            <option value="year">Current Year ({wnt.thisYear})</option>
                            <option value="quarter">Current Quarter ({wnt.thisQuarterText})</option>
                            <option value="month">Current Month ({wnt.thisMonthText.substring(0,3)})</option>
                        </select>
                        <Caret className="filter-caret" />
                    </form>
                    <div id="sg-units">
                        <div data-value="amount" className="filter-units selected">
                            Dollars
                            <div className="filter-highlight"></div>
                        </div>
                    </div>
                    <Meter label="Total Sales" divID="meter-sales-total" amount={this.state.sales} goal={this.state.goal} />
                    <h3>By Channel</h3>
                    <div className="channels">
                        <Meter label="Box Office" divID="meter-sales-box" amount={this.state.boxoffice} goal={this.state.goalBoxoffice} />
                        <Meter label="Gift Store" divID="meter-sales-gift" amount={this.state.giftstore} goal={this.state.goalGiftstore} />
                        <Meter label="Cafe" divID="meter-sales-cafe" amount={this.state.cafe} goal={this.state.goalCafe} />
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
