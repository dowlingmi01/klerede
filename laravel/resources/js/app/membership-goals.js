/**************************************/
/******** MEMBERSHIP GOALS ROW ********/
/**************************************/

var MembershipGoals = React.createClass({
    getInitialState: function() {
        return {
            permissions:KAPI.auth.getUserPermissions(),
            
            goalTotal: 0,
            goalIndividual: 0,
            goalFamily: 0,

            individual: 0,
            family: 0,

            markerPosition: this.markerPosition(wnt.yearStart, wnt.yesterday, 365)
        };
    },
	onGoalsResult:function(goals) {
   		console.log('Membership Goals onGoalsResult using KAPI...');
		
        var periodStart = wnt.yearStart;
        var periodEnd = wnt.yesterday;
        var periodDays = 365;
        if(wnt.filter.sgPeriod === 'quarter'){
            periodStart = wnt.quarterStart;
            periodDays = 91;
        } else if(wnt.filter.sgPeriod === 'month'){
            periodStart = wnt.monthStart;
            periodDays = wnt.daysInMonth(wnt.monthStart.split('-')[1], wnt.monthStart.split('-')[0]);
        }

		var result = wnt.membershipSales;
		
        // Set globals for easy reuse
        wnt.filter.mgGoalTotal = 0;
        wnt.filter.mgGoalIndividual = 0;
        wnt.filter.mgGoalFamily = 0;
        if(wnt.filter.mgPeriod === 'quarter'){
            // Loop through array of months in quarter, matching to cooresponding month in the goals, and totalling the amount for the quarter 
            for(i=0; i<3; i++){
                var month = wnt.thisQuarterMonths[i];
                var monthTotal;
                // Individual
                monthTotal = goals['membership/'+wnt.filter.mgUnits].sub_channels.individual.months[month];
                wnt.filter.mgGoalIndividual += monthTotal;
                // Family
                monthTotal = goals['membership/'+wnt.filter.mgUnits].sub_channels.family.months[month];
                wnt.filter.mgGoalFamily += monthTotal;
            }
            wnt.filter.mgGoalTotal = wnt.filter.mgGoalIndividual + wnt.filter.mgGoalFamily;
        } else if(wnt.filter.mgPeriod === 'month'){
            var month = wnt.thisMonthNum + 1;
            wnt.filter.mgGoalTotal = goals['membership/'+wnt.filter.mgUnits].sub_channels.individual.months[month] + goals['membership/'+wnt.filter.mgUnits].sub_channels.family.months[month];
            wnt.filter.mgGoalIndividual = goals['membership/'+wnt.filter.mgUnits].sub_channels.individual.months[month];
            wnt.filter.mgGoalFamily = goals['membership/'+wnt.filter.mgUnits].sub_channels.family.months[month];
        } else {
            // ELSE: Set goals to year totals
            // Loop through months to calculate goal totals
            for(i=1; i<13; i++){
                var month = i;
                wnt.filter.mgGoalIndividual += goals['membership/'+wnt.filter.mgUnits].sub_channels.individual.months[month];
                wnt.filter.mgGoalFamily += goals['membership/'+wnt.filter.mgUnits].sub_channels.family.months[month];
            }
            wnt.filter.mgGoalTotal = wnt.filter.mgGoalIndividual + wnt.filter.mgGoalFamily;
        }
		
        wnt.filter.mgGoalTotalComplete = Math.round((parseInt(result.memberships[wnt.filter.mgUnits]) / wnt.filter.mgGoalTotal) * 100);
        wnt.filter.mgGoalIndividualComplete = Math.round((parseInt(result.individual[wnt.filter.mgUnits]) / wnt.filter.mgGoalIndividual) * 100);
        wnt.filter.mgGoalFamilyComplete = Math.round((parseInt(result.family[wnt.filter.mgUnits]) / wnt.filter.mgGoalFamily) * 100);
        if(this.isMounted()) {
            this.setState({
                goalTotal: wnt.filter.mgGoalTotal,
                goalIndividual: wnt.filter.mgGoalIndividual,
                goalFamily: wnt.filter.mgGoalFamily,
                memberships: result.memberships[wnt.filter.mgUnits],
                individual: result.individual[wnt.filter.mgUnits],
                family: result.family[wnt.filter.mgUnits],
                markerPosition: this.markerPosition(periodStart, wnt.yesterday, periodDays)
            });
            this.formatNumbers();
        }
	},
	onStatsResult:function(result) {
        console.log('Membership Goals onStatsResult using KAPI...');
        wnt.membershipSales = result;
		KAPI.goals.sales.get(wnt.venueID,wnt.thisYear,this.onGoalsResult);
    },
	callAPI:function () {
        var periodStart = wnt.yearStart;
        var periodEnd = wnt.yesterday;
        var periodDays = 365;
        if(wnt.filter.mgPeriod === 'quarter'){
            periodStart = wnt.quarterStart;
            periodDays = 91;
        } else if(wnt.filter.mgPeriod === 'month'){
            periodStart = wnt.monthStart;
            periodDays = wnt.daysInMonth(wnt.monthStart.split('-')[1], wnt.monthStart.split('-')[0]);
        }
		var queries = {
	        memberships: { specs: { type: 'sales', channel: 'membership' }, periods: { from: periodStart, to: periodEnd, kind: 'sum' } },
	        individual: { specs: { type: 'sales', channel: 'membership', membership_type: 'individual' }, periods: { from: periodStart, to: periodEnd, kind: 'sum' } },
	        family: { specs: { type: 'sales', channel: 'membership', membership_type: 'family' }, periods: { from: periodStart, to: periodEnd, kind: 'sum' } },
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
        wnt.filter.mgPeriodComplete = (days / periodLength) * 100;
        return wnt.filter.mgPeriodComplete;
    },
    componentDidMount: function() {
        // Set filter defaults as globals
        wnt.filter.mgUnits = 'amount';   // amount, units
        wnt.filter.mgPeriod = 'year';   // year, quarter, month
        this.callAPI();
    },
    filterPeriod: function(event) {
        // year, quarter, month
        wnt.filter.mgPeriod = event.target.value;
        this.callAPI();
        event.target.blur();
    },
    filterUnits: function(event){
        // amount, units
        wnt.filter.mgUnits = $(event.target).closest('.filter-units').data('value');
        $.each($('#mg-units .filter-units'), function(index, item){
            $(item).toggleClass('selected');
        });
        this.callAPI();
        event.target.blur();
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
        $.each($('#membership-goals .meter-group'), function(index, item){
            var completed = wnt.filter[$(item).data('completed')];
            var differenceCompleted = Math.round((wnt.filter[$(item).data('completed')] / wnt.filter.mgPeriodComplete) * 100);
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
        
        var actionEdit = "";
        if (this.state.permissions["goals-set"]) {
            actionEdit = <ActionMenu />;
        }
        
        return (
            <div>
                <div className="widget" id="membership-goals">
                    <h2>Membership Goals</h2>
                    {actionEdit}
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
                    <Meter label="Total Membership Sales" divID="meter-membership-total" amount={this.state.memberships} goal={this.state.goalTotal} completed='mgGoalTotalComplete' />
                    <h3>By Membership Type</h3>
                    <div className="channels">
                        <Meter label="Individual" divID="meter-membership-ind" amount={this.state.individual} goal={this.state.goalIndividual} completed='mgGoalIndividualComplete' />
                        <Meter label="Family" divID="meter-membership-fam" amount={this.state.family} goal={this.state.goalFamily} completed='mgGoalFamilyComplete' />
                    </div>
                </div>
            </div>
        );
    }
});

if(document.getElementById('membership-goals-widget')){
    $.when(wnt.gettingVenueData).done(function(data) {    
        React.render(
            <MembershipGoals />,
            document.getElementById('membership-goals-widget')
        );
        console.log('2) Membership Goals row loaded...');
    });
}
