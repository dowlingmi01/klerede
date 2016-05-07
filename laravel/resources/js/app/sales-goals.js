/*********************************/
/******** SALES GOALS ROW ********/
/*********************************/

var SalesGoals = React.createClass({
    getInitialState: function() {
        return {
            goalTotal: 0,   // TEMP STATIC GOAL (OTHER GOALS ARE STATIC IN filterPeriod)
            goalBox: 0,
            goalCafe: 0,
            goalGift: 0,

            boxoffice: 0,
            cafe: 0,
            giftstore: 0,

            markerPosition: this.markerPosition(wnt.yearStart, wnt.yesterday, 365)
        };
    },
    callAPI: function(){
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
        $.post(
            wnt.apiMain,
            {
                venue_id: wnt.venueID,
                queries: {
                    sales: { specs: { type: 'sales' }, periods: { from: periodStart, to: periodEnd, kind: 'sum' } },
                    boxoffice: { specs: { type: 'sales', channel: 'gate' }, periods: { from: periodStart, to: periodEnd, kind: 'sum' } },
                    cafe: { specs: { type: 'sales', channel: 'cafe' }, periods: { from: periodStart, to: periodEnd, kind: 'sum' } },
                    giftstore: { specs: { type: 'sales', channel: 'store' }, periods: { from: periodStart, to: periodEnd, kind: 'sum' } },
                    visits: { specs: { type: 'visits' }, periods: { from: periodStart, to: periodEnd, kind: 'sum' } }
                }
            }
        )
        .done(function(result) {
            console.log('Sales Goals data loaded...');
            wnt.sales = result;
            wnt.gettingSalesGoalsData = $.Deferred();
            wnt.getGoals(wnt.thisYear, wnt.gettingSalesGoalsData);
            $.when(wnt.gettingSalesGoalsData).done(function(goals) {
                // Set globals for easy reuse
                wnt.filter.sgGoalTotal = 0;
                wnt.filter.sgGoalBox = 0;
                wnt.filter.sgGoalCafe = 0;
                wnt.filter.sgGoalGift = 0;
                if(wnt.filter.sgPeriod === 'quarter'){
                    // Loop through array of months in quarter, matching to cooresponding month in the goals, and totalling the amount for the quarter 
                    goals.boxofficeQuarter = 0;
                    goals.cafeQuarter = 0;
                    goals.storeQuarter = 0;
                    for(i=0; i<3; i++){
                        var month = wnt.thisQuarterMonths[i];
                        // Gate / Box Office
                        var goalTotal = goals['gate/amount'].months[month];
                        goals.boxofficeQuarter += goalTotal;
                        // Cafe
                        goalTotal = goals['cafe/amount'].months[month];
                        goals.cafeQuarter += goalTotal;
                        // Store
                        goalTotal = goals['store/amount'].months[month];
                        goals.storeQuarter += goalTotal;
                    }
                    wnt.filter.sgGoalTotal = goals.boxofficeQuarter + goals.cafeQuarter + goals.storeQuarter;
                    wnt.filter.sgGoalBox = goals.boxofficeQuarter;
                    wnt.filter.sgGoalCafe = goals.cafeQuarter;
                    wnt.filter.sgGoalGift = goals.storeQuarter;
                } else if(wnt.filter.sgPeriod === 'month'){
                    var monthNum = wnt.thisMonthNum + 1;
                    wnt.filter.sgGoalTotal = goals['gate/amount'].months[monthNum] + goals['cafe/amount'].months[monthNum] + goals['store/amount'].months[monthNum];
                    wnt.filter.sgGoalBox = goals['gate/amount'].months[monthNum];
                    wnt.filter.sgGoalCafe = goals['cafe/amount'].months[monthNum];
                    wnt.filter.sgGoalGift = goals['store/amount'].months[monthNum];
                } else {
                    // ELSE: Set goals to year totals
                    // Initialize goal totals
                    var goalBox = 0;
                    var goalCafe = 0;
                    var goalGift = 0;
                    // Loop through months to calculate goal totals
                    for(i=1; i<13; i++){
                        var key = i;
                        goalBox += goals['gate/amount'].months[key.toString()];
                        goalCafe += goals['cafe/amount'].months[key.toString()];
                        goalGift += goals['store/amount'].months[key.toString()];
                    }
                    wnt.filter.sgGoalTotal = goalBox + goalCafe + goalGift;
                    wnt.filter.sgGoalBox = goalBox;
                    wnt.filter.sgGoalCafe = goalCafe;
                    wnt.filter.sgGoalGift = goalGift;
                }
                wnt.filter.sgGoalTotalComplete = Math.round((result.sales.amount / wnt.filter.sgGoalTotal) * 100);
                wnt.filter.sgGoalBoxComplete = Math.round((result.boxoffice.amount / wnt.filter.sgGoalBox) * 100);
                wnt.filter.sgGoalCafeComplete = Math.round((result.cafe.amount / wnt.filter.sgGoalCafe) * 100);
                wnt.filter.sgGoalGiftComplete = Math.round((result.giftstore.amount / wnt.filter.sgGoalGift) * 100);
                if(self.isMounted()) {
                    self.setState({
                        goalTotal: wnt.filter.sgGoalTotal,
                        goalBox: wnt.filter.sgGoalBox,
                        goalCafe: wnt.filter.sgGoalCafe,
                        goalGift: wnt.filter.sgGoalGift,
                        sales: result.sales.amount,
                        boxoffice: result.boxoffice.amount,
                        cafe: result.cafe.amount,
                        giftstore: result.giftstore.amount,
                        markerPosition: self.markerPosition(periodStart, wnt.yesterday, periodDays)
                    });
                    self.formatNumbers();
                }
            });
        }.bind(this))   // .bind() gives context to 'this'
        .fail(function(result) {
            console.log('SALES GOALS DATA ERROR! ... ' + result.statusText);
        });
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
    componentDidMount: function() {
        wnt.filter.sgUnits = 'amount';   // amount
        wnt.filter.sgPeriod = 'year';   // year, month, quarter
        this.callAPI();
    },
    filterPeriod: function(event) {
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
        $.each($('#sales-goals .meter-group'), function(index, item){
            var completed = wnt.filter[$(item).data('completed')];
            if(completed < 50) {
                $(item).find('.meter-status').text('Behind');
            } else if(completed < 75) {
                $(item).find('.meter-status').text('Behind');
            } else if(completed < 90) {
                $(item).find('.meter-status').text('Slightly Behind');
            } else if(completed < 110) {
                $(item).find('.meter-status').text('On Track');
            } else {
                $(item).find('.meter-status').text('Ahead');
            }
            $(item).find('.bar-meter-fill').css('width','0')
                .animate({
                    width: completed+'%'
                },
                2000,
                'easeOutElastic'   // easeOutSine
            );
        });
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
                    <Meter label="Total Sales" divID="meter-sales-total" amount={this.state.sales} goal={this.state.goalTotal} completed='sgGoalTotalComplete' />
                    <h3>By Channel</h3>
                    <div className="channels">
                        <Meter label="Box Office" divID="meter-sales-box" amount={this.state.boxoffice} goal={this.state.goalBox} completed='sgGoalBoxComplete' />
                        <Meter label="Gift Store" divID="meter-sales-gift" amount={this.state.giftstore} goal={this.state.goalGift} completed='sgGoalGiftComplete' />
                        <Meter label="Cafe" divID="meter-sales-cafe" amount={this.state.cafe} goal={this.state.goalCafe} completed='sgGoalCafeComplete' />
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
