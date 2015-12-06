/**************************************/
/******** REUSABLE PARTS ICONS ********/
/**************************************/

var GoalsMonths = React.createClass({
    monthChange: function(event){
        var channel = $(event.target).closest('.goal-section').find('.total').attr('id').split('-')[1];
        var data = {};
        data.months = {};
        var total = 0;
        $(event.target).closest('.goal-section').find('.month-total').each(function(index, month){
            var monthNumber = parseInt($(month).attr('id').split('-')[1]);
            var monthVal = Number($(month).val().replace(/[^0-9\.]+/g,""));
            // Populate correct month in object and process value to make it an integer
            data.months[monthNumber] = monthVal;
            // Increment total for updating
            total += monthVal;
        });
        // Convert total to formatted number for display
        total = parseInt(total).toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
        // Update section total when a month is changed
        $(event.target).closest('.goal-section').find('.total').val(total);
        wnt.setGoals(data, wnt.thisYear, channel, 'amount');
        // Convert the number back to a string and format it for display
        $(event.target).val(parseInt($(event.target).val()).toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }));
    },
    render: function() {
        return (
            <div className="collapse" id={this.props.id}>
                <div className="form-group">
                    <div className="col-sm-8 collapse-title">
                        By Month:
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="goal-1" className="col-sm-2 control-label">Jan:</label>
                    <div className="col-sm-4">
                        <input type="text" id="goal-1" placeholder={this.props.placeholder} className="form-control month-total" onBlur={this.monthChange} />
                    </div>
                    <label htmlFor="goal-7" className="col-sm-2 control-label">Jul:</label>
                    <div className="col-sm-4">
                        <input type="text" id="goal-7" placeholder={this.props.placeholder} className="form-control month-total" onBlur={this.monthChange} />
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="goal-2" className="col-sm-2 control-label">Feb:</label>
                    <div className="col-sm-4">
                        <input type="text" id="goal-2" placeholder={this.props.placeholder} className="form-control month-total" onBlur={this.monthChange} />
                    </div>
                    <label htmlFor="goal-8" className="col-sm-2 control-label">Aug:</label>
                    <div className="col-sm-4">
                        <input type="text" id="goal-8" placeholder={this.props.placeholder} className="form-control month-total" onBlur={this.monthChange} />
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="goal-3" className="col-sm-2 control-label">Mar:</label>
                    <div className="col-sm-4">
                        <input type="text" id="goal-3" placeholder={this.props.placeholder} className="form-control month-total" onBlur={this.monthChange} />
                    </div>
                    <label htmlFor="goal-9" className="col-sm-2 control-label">Sep:</label>
                    <div className="col-sm-4">
                        <input type="text" id="goal-9" placeholder={this.props.placeholder} className="form-control month-total" onBlur={this.monthChange} />
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="goal-4" className="col-sm-2 control-label">Apr:</label>
                    <div className="col-sm-4">
                        <input type="text" id="goal-4" placeholder={this.props.placeholder} className="form-control month-total" onBlur={this.monthChange} />
                    </div>
                    <label htmlFor="goal-10" className="col-sm-2 control-label">Oct:</label>
                    <div className="col-sm-4">
                        <input type="text" id="goal-10" placeholder={this.props.placeholder} className="form-control month-total" onBlur={this.monthChange} />
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="goal-5" className="col-sm-2 control-label">May:</label>
                    <div className="col-sm-4">
                        <input type="text" id="goal-5" placeholder={this.props.placeholder} className="form-control month-total" onBlur={this.monthChange} />
                    </div>
                    <label htmlFor="goal-11" className="col-sm-2 control-label">Nov:</label>
                    <div className="col-sm-4">
                        <input type="text" id="goal-11" placeholder={this.props.placeholder} className="form-control month-total" onBlur={this.monthChange} />
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="goal-6" className="col-sm-2 control-label">Jun:</label>
                    <div className="col-sm-4">
                        <input type="text" id="goal-6" placeholder={this.props.placeholder} className="form-control month-total" onBlur={this.monthChange} />
                    </div>
                    <label htmlFor="goal-12" className="col-sm-2 control-label">Dec:</label>
                    <div className="col-sm-4">
                        <input type="text" id="goal-12" placeholder={this.props.placeholder} className="form-control month-total" onBlur={this.monthChange} />
                    </div>
                </div>
            </div>
        );
    }
});

var GoalSetting = React.createClass({
    componentDidMount: function(){
        wnt.gettingGoalsData = $.Deferred();
        wnt.getGoals(wnt.thisYear);
        // Set fields with goals data from server
        $.when(wnt.gettingGoalsData).done(function(goals) {
            // Format = wnt.goals['gate/amount'].months['1']
            var goalBoxoffice = 0;
            var goalCafe = 0;
            var goalGiftstore = 0;
            // Add up months to get totals for display
            for(i=1; i<13; i++){
                var key = i;
                // Grab single month amount...
                var goalBoxofficeMonth = goals['gate/amount'].months[key.toString()];
                var goalCafeMonth = goals['cafe/amount'].months[key.toString()];
                var goalGiftstoreMonth = goals['store/amount'].months[key.toString()];
                // Set corresponding month display...
                $('#goal-gate').parent().find('#goal-'+i).val(goalBoxofficeMonth.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }));
                $('#goal-cafe').parent().find('#goal-'+i).val(goalCafeMonth.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }));
                $('#goal-store').parent().find('#goal-'+i).val(goalGiftstoreMonth.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }));
                // Increment totals
                goalBoxoffice += goalBoxofficeMonth;
                goalCafe += goals['cafe/amount'].months[key.toString()];
                goalGiftstore += goals['store/amount'].months[key.toString()];
            }
            // Set totals
            $('#goal-gate').val(goalBoxoffice.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }));
            $('#goal-cafe').val(goalCafe.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }));
            $('#goal-store').val(goalGiftstore.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }));
            // Set individual months ... $('#goal-gate').parent().find('input').length
        });
        // When 'Enter' key is pressed ...
        $('form').keypress(function(e) {
            if(e.which == 13) {
                console.log('The enter key was pressed.');
                $('input').blur();
            }
        });
        // When input field is selected, convert string to number
        $('input').on('focus', function() {
            $(this).val(Number($(this).val().replace(/[^0-9\.]+/g,"")));
            // If the value is 0, clear the field for input
            if($(this).val() === '0'){ $(this).val(''); }
        });
        // Auto-expand months when total is clicked
        $('.total').focus(function(){
            $(this).parent().find('.collapsed').click();
        });
    },
    totalChange: function(event){
        // When a total is changed, equalize the goal across the months
        var total = $(event.target).val();
        var monthTotal = Math.round(total / 12);
        $.each($(event.target).parent().find('.month-total'), function(index, month){
            $(month).val(monthTotal);
        });
        // Then set the goals on the server
        var channel = $(event.target).attr('id').split('-')[1];
        var data = {
            'months': {
                1: monthTotal,
                2: monthTotal,
                3: monthTotal,
                4: monthTotal,
                5: monthTotal,
                6: monthTotal,
                7: monthTotal,
                8: monthTotal,
                9: monthTotal,
                10: monthTotal,
                11: monthTotal,
                12: monthTotal
            }
        };
        wnt.setGoals(data, wnt.thisYear, channel, 'amount');
        // Convert the number back to a string and format it for display
        $(event.target).val(parseInt($(event.target).val()).toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }));
    },
    render: function() {
        return (
            <form className="form-horizontal">
                <div className="form-group">
                    <div className="col-sm-offset-2 col-sm-4">
                        Goal in Dollars
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="goal-gate" className="col-sm-2 control-label">Box Office:</label>
                    <div className="col-sm-4 goal-section">
                        <input type="text" id="goal-gate" placeholder="$000,000" className="form-control total" onBlur={this.totalChange} /><ButtonExpand target="#months-gate" />
                        <GoalsMonths id="months-gate" placeholder="$0" />
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="goal-cafe" className="col-sm-2 control-label">Cafe:</label>
                    <div className="col-sm-4 goal-section">
                        <input type="text" id="goal-cafe" placeholder="$000,000" className="form-control total" onBlur={this.totalChange} /><ButtonExpand target="#months-cafe" />
                        <GoalsMonths id="months-cafe" placeholder="$0" />
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="goal-store" className="col-sm-2 control-label">Gift Store:</label>
                    <div className="col-sm-4 goal-section">
                        <input type="text" id="goal-store" placeholder="$000,000" className="form-control total" onBlur={this.totalChange} /><ButtonExpand target="#months-store" />
                        <GoalsMonths id="months-store" placeholder="$0" />
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="goal-mem-num" className="col-sm-2 control-label">Total Membership #:</label>
                    <div className="col-sm-4">
                        <input type="text" id="goal-mem-num" placeholder="000,000" className="form-control super-total" onBlur={this.totalChange} />
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="goal-mem-num-fam" className="col-sm-3 control-label">Family #:</label>
                    <div className="col-sm-3 goal-section">
                        <input type="text" id="goal-mem-num-fam" placeholder="000,000" className="form-control total" /><ButtonExpand target="#months-mem-num-fam" />
                        <GoalsMonths id="months-mem-num-fam" placeholder="0" />
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="goal-mem-num-ind" className="col-sm-3 control-label">Individual #:</label>
                    <div className="col-sm-3 goal-section">
                        <input type="text" id="goal-mem-num-ind" placeholder="000,000" className="form-control total" /><ButtonExpand target="#months-mem-num-ind" />
                        <GoalsMonths id="months-mem-num-ind" placeholder="0" />
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="goal-mem-num-don" className="col-sm-3 control-label">Donor #:</label>
                    <div className="col-sm-3 goal-section">
                        <input type="text" id="goal-mem-num-don" placeholder="000,000" className="form-control total" /><ButtonExpand target="#months-mem-num-don" />
                        <GoalsMonths id="months-mem-num-don" placeholder="0" />
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="goal-mem-dol" className="col-sm-2 control-label">Total Membership $:</label>
                    <div className="col-sm-4">
                        <input type="text" id="goal-mem-dol" placeholder="$000,000" className="form-control super-total" onBlur={this.totalChange} />
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="goal-mem-dol-fam" className="col-sm-3 control-label">Family $:</label>
                    <div className="col-sm-3 goal-section">
                        <input type="text" id="goal-mem-dol-fam" placeholder="000,000" className="form-control total" /><ButtonExpand target="#months-mem-dol-fam" />
                        <GoalsMonths id="months-mem-dol-fam" placeholder="$0" />
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="goal-mem-dol-ind" className="col-sm-3 control-label">Individual $:</label>
                    <div className="col-sm-3 goal-section">
                        <input type="text" id="goal-mem-dol-ind" placeholder="000,000" className="form-control total" /><ButtonExpand target="#months-mem-dol-ind" />
                        <GoalsMonths id="months-mem-dol-ind" placeholder="$0" />
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="goal-mem-dol-don" className="col-sm-3 control-label">Donor $:</label>
                    <div className="col-sm-3 goal-section">
                        <input type="text" id="goal-mem-dol-don" placeholder="000,000" className="form-control total" /><ButtonExpand target="#months-mem-dol-don" />
                        <GoalsMonths id="months-mem-dol-don" placeholder="$0" />
                    </div>
                </div>
            </form>
        );
    }
});

if(document.getElementById('goal-setting')){
    React.render(
        <GoalSetting />,
        document.getElementById('goal-setting')
    );
    console.log('Goal setting loaded...');
}
