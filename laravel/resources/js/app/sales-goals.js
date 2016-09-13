/*********************************/
/******** SALES GOALS ROW ********/
/*********************************/

var SalesGoals = React.createClass({
    getInitialState: function() {
        return {
            permissions:KAPI.auth.getUserPermissions(),
            
            goalTotal: 0,
            goalBox: 0,
            goalCafe: 0,
            goalGift: 0,

            boxoffice: 0,
            cafe: 0,
            giftstore: 0,

            markerPosition: this.markerPosition(wnt.yearStart, wnt.today, 365)
        };
    },
	onGoalsResult:function(goals) {
        console.log('Sales Goals onGoalsResult using KAPI...');
		
        var periodStart = wnt.yearStart;
        var periodEnd = wnt.today;
        var periodDays = 365;
        if(wnt.filter.sgPeriod === 'quarter'){
            periodStart = wnt.quarterStart;
            periodDays = 91;
        } else if(wnt.filter.sgPeriod === 'month'){
            periodStart = wnt.monthStart;
            periodDays = wnt.daysInMonth(wnt.monthStart.split('-')[1], wnt.monthStart.split('-')[0]);
        }

		var result = wnt.sales;
        // Set globals for easy reuse
        wnt.filter.sgGoalTotal = 0;
        wnt.filter.sgGoalBox = 0;
        wnt.filter.sgGoalCafe = 0;
        wnt.filter.sgGoalGift = 0;
        if(wnt.filter.sgPeriod === 'quarter'){
            // Loop through array of months in quarter, matching to cooresponding month in the goals, and totalling the amount for the quarter 
            for(i=0; i<3; i++){
                var month = wnt.thisQuarterMonths[i];
                var monthTotal;
                // Gate / Box Office
                monthTotal = goals['gate/amount'].months[month];
                wnt.filter.sgGoalBox += monthTotal;
                // Cafe
                monthTotal = goals['cafe/amount'].months[month];
                wnt.filter.sgGoalCafe += monthTotal;
                // Store
                monthTotal = goals['store/amount'].months[month];
                wnt.filter.sgGoalGift += monthTotal;
            }
            wnt.filter.sgGoalTotal = wnt.filter.sgGoalBox + wnt.filter.sgGoalCafe + wnt.filter.sgGoalGift;
        } else if(wnt.filter.sgPeriod === 'month'){
            var month = wnt.thisMonthNum + 1;
            wnt.filter.sgGoalTotal = goals['gate/amount'].months[month] + goals['cafe/amount'].months[month] + goals['store/amount'].months[month];
            wnt.filter.sgGoalBox = goals['gate/amount'].months[month];
            wnt.filter.sgGoalCafe = goals['cafe/amount'].months[month];
            wnt.filter.sgGoalGift = goals['store/amount'].months[month];
        } else {
            // ELSE: Set goals to year totals
            // Loop through months to calculate goal totals
            for(i=1; i<13; i++){
                var month = i;
                wnt.filter.sgGoalBox += goals['gate/amount'].months[month];
                wnt.filter.sgGoalCafe += goals['cafe/amount'].months[month];
                wnt.filter.sgGoalGift += goals['store/amount'].months[month];
            }
            wnt.filter.sgGoalTotal = wnt.filter.sgGoalBox + wnt.filter.sgGoalCafe + wnt.filter.sgGoalGift;
        }
        wnt.filter.sgGoalTotalComplete = Math.round((result.sales.amount / wnt.filter.sgGoalTotal) * 100);
        wnt.filter.sgGoalBoxComplete = Math.round((result.boxoffice.amount / wnt.filter.sgGoalBox) * 100);
        wnt.filter.sgGoalCafeComplete = Math.round((result.cafe.amount / wnt.filter.sgGoalCafe) * 100);
        wnt.filter.sgGoalGiftComplete = Math.round((result.giftstore.amount / wnt.filter.sgGoalGift) * 100);
        if(this.isMounted()) {
            this.setState({
                goalTotal: wnt.filter.sgGoalTotal,
                goalBox: wnt.filter.sgGoalBox,
                goalCafe: wnt.filter.sgGoalCafe,
                goalGift: wnt.filter.sgGoalGift,
                sales: result.sales.amount,
                boxoffice: result.boxoffice.amount,
                cafe: result.cafe.amount,
                giftstore: result.giftstore.amount,
                markerPosition: this.markerPosition(periodStart, wnt.today, periodDays)
            });
            this.formatNumbers();
        }
    },
	onStatsResult:function (result) {
        console.log('Sales Goals onStatsResult using KAPI...');
        wnt.sales = result;
		KAPI.goals.sales.get(wnt.venueID,wnt.thisYear,this.onGoalsResult);
	},
    callAPI: function(){
        var self = this;
        var periodStart = wnt.yearStart;
        var periodEnd = wnt.today;
        var periodDays = 365;
        if(wnt.filter.sgPeriod === 'quarter'){
            periodStart = wnt.quarterStart;
            periodDays = 91;
        } else if(wnt.filter.sgPeriod === 'month'){
            periodStart = wnt.monthStart;
            periodDays = wnt.daysInMonth(wnt.monthStart.split('-')[1], wnt.monthStart.split('-')[0]);
        }
		var queries = {
	        sales: { specs: { type: 'sales' }, periods: { from: periodStart, to: periodEnd, kind: 'sum' } },
	        boxoffice: { specs: { type: 'sales', channel: 'gate' }, periods: { from: periodStart, to: periodEnd, kind: 'sum' } },
	        cafe: { specs: { type: 'sales', channel: 'cafe' }, periods: { from: periodStart, to: periodEnd, kind: 'sum' } },
	        giftstore: { specs: { type: 'sales', channel: 'store' }, periods: { from: periodStart, to: periodEnd, kind: 'sum' } },
	        visits: { specs: { type: 'visits' }, periods: { from: periodStart, to: periodEnd, kind: 'sum' } }
		};
				
		KAPI.stats.query(wnt.venueID, queries, this.onStatsResult);
		
    },
    markerPosition: function(startDate, endDate, periodLength) {
        // Needed to switch date format for cross-browser parsing
        startDate = startDate.split('-');
        startDate = startDate[1]+'/'+startDate[2]+'/'+startDate[0];
        endDate = endDate.split('-');
        endDate = endDate[1]+'/'+endDate[2]+'/'+endDate[0];
        // Now it can be parsed in Firefox and Safari too
        var days = Math.floor(( Date.parse(endDate) - Date.parse(startDate) ) / 86400000);
        days += 1;  // Fix for miscalculation
        wnt.filter.sgPeriodComplete = (days / periodLength) * 100;
        return wnt.filter.sgPeriodComplete;
    },
    componentDidMount: function() {
        wnt.filter.sgUnits = 'amount';   // amount
        wnt.filter.sgPeriod = 'year';   // year, quarter, month
        this.callAPI();
    },
    filterPeriod: function(event) {
        // year, quarter, month
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
            var differenceCompleted = Math.round((wnt.filter[$(item).data('completed')] / wnt.filter.sgPeriodComplete) * 100);
            if(differenceCompleted < 50) {
                $(item).find('.meter-status').text('Behind');
            } else if(differenceCompleted < 75) {
                $(item).find('.meter-status').text('Behind');
            } else if(differenceCompleted < 90) {
                $(item).find('.meter-status').text('Slightly Behind');
            } else if(differenceCompleted < 110) {
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

        var actionEdit = "";
        if (this.state.permissions["goals-set"]) {
            actionEdit = <ActionMenu />;
        }
        
        return (
            <div>
                <div className="widget" id="sales-goals">
                    <h2>Sales Goals</h2>                    
                    {actionEdit}
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
    $.when(wnt.gettingVenueData).done(function(data) {
        React.render(
            <SalesGoals />,
            document.getElementById('sales-goals-widget')
        );
        console.log('2) Sales Goals row loaded...');
    });
}
