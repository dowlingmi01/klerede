/**************************************/
/******** REUSABLE PARTS ICONS ********/
/**************************************/

var GoalsMonths = React.createClass({
    monthChange: function(event){
        console.log(event.target);
        console.log('MONTH CHANGE');
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
                    <label htmlFor="goal-jan" className="col-sm-2 control-label">Jan:</label>
                    <div className="col-sm-4">
                        <input type="text" id="goal-jan" placeholder={this.props.placeholder} className="form-control" onBlur={this.monthChange} />
                    </div>
                    <label htmlFor="goal-jul" className="col-sm-2 control-label">Jul:</label>
                    <div className="col-sm-4">
                        <input type="text" id="goal-jul" placeholder={this.props.placeholder} className="form-control" onBlur={this.monthChange} />
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="goal-feb" className="col-sm-2 control-label">Feb:</label>
                    <div className="col-sm-4">
                        <input type="text" id="goal-feb" placeholder={this.props.placeholder} className="form-control" onBlur={this.monthChange} />
                    </div>
                    <label htmlFor="goal-aug" className="col-sm-2 control-label">Aug:</label>
                    <div className="col-sm-4">
                        <input type="text" id="goal-aug" placeholder={this.props.placeholder} className="form-control" onBlur={this.monthChange} />
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="goal-mar" className="col-sm-2 control-label">Mar:</label>
                    <div className="col-sm-4">
                        <input type="text" id="goal-mar" placeholder={this.props.placeholder} className="form-control" onBlur={this.monthChange} />
                    </div>
                    <label htmlFor="goal-sep" className="col-sm-2 control-label">Sep:</label>
                    <div className="col-sm-4">
                        <input type="text" id="goal-sep" placeholder={this.props.placeholder} className="form-control" onBlur={this.monthChange} />
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="goal-apr" className="col-sm-2 control-label">Apr:</label>
                    <div className="col-sm-4">
                        <input type="text" id="goal-apr" placeholder={this.props.placeholder} className="form-control" onBlur={this.monthChange} />
                    </div>
                    <label htmlFor="goal-oct" className="col-sm-2 control-label">Oct:</label>
                    <div className="col-sm-4">
                        <input type="text" id="goal-oct" placeholder={this.props.placeholder} className="form-control" onBlur={this.monthChange} />
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="goal-may" className="col-sm-2 control-label">May:</label>
                    <div className="col-sm-4">
                        <input type="text" id="goal-may" placeholder={this.props.placeholder} className="form-control" onBlur={this.monthChange} />
                    </div>
                    <label htmlFor="goal-nov" className="col-sm-2 control-label">Nov:</label>
                    <div className="col-sm-4">
                        <input type="text" id="goal-nov" placeholder={this.props.placeholder} className="form-control" onBlur={this.monthChange} />
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="goal-jun" className="col-sm-2 control-label">Jun:</label>
                    <div className="col-sm-4">
                        <input type="text" id="goal-jun" placeholder={this.props.placeholder} className="form-control" onBlur={this.monthChange} />
                    </div>
                    <label htmlFor="goal-dec" className="col-sm-2 control-label">Dec:</label>
                    <div className="col-sm-4">
                        <input type="text" id="goal-dec" placeholder={this.props.placeholder} className="form-control" onBlur={this.monthChange} />
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
        $.when(wnt.gettingGoalsData).done(function(goals) {
            // Format = wnt.goals['gate/amount'].months['1']
            var total = 0;
            for(i=1; i<13; i++){
                var key = i;
                total += goals['gate/amount'].months[key.toString()];
            }
            $('#goal-gate').val(total.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }));
        });
        // When 'Enter' key is pressed ...
        $('form').keypress(function(e) {
            if(e.which == 13) {
                console.log('The enter key was pressed.');
                $('input').blur();
            }
        });
        // When 'Save' button is clicked ...
        $('#button-save').on('click', function() {
            console.log('The save button was clicked.');
        });
        // When input field is deselected, convert number to string for display
        $('input').on('blur', function() {
            if($(this).val() !== ''){
                var channel = $(this).attr('id').split('-')[1];
                if($(this).hasClass('total')){
                    var month = $(this).val() / 12;
                };
                var data = {
                    'months': {
                        1: month,
                        2: month,
                        3: month,
                        4: month,
                        5: month,
                        6: month,
                        7: month,
                        8: month,
                        9: month,
                        10: month,
                        11: month,
                        12: month
                    }
                };
                wnt.setGoals(data, wnt.thisYear, channel, 'amount');
                $(this).val(parseInt($(this).val()).toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }));
            }
        });
        // When input field is selected, convert string to number
        $('input').on('focus', function() {
            $(this).val(Number($(this).val().replace(/[^0-9\.]+/g,"")));
            // If the value is 0, clear the field for input
            if($(this).val() === '0'){ $(this).val(''); }
        });
    },
    totalChange: function(){
        console.log('TOTAL CHANGE');
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
                    <div className="col-sm-4">
                        <input type="text" id="goal-gate" placeholder="$000,000" className="form-control total" onBlur={this.totalChange} /><ButtonExpand target="#months-gate" />
                        <GoalsMonths id="months-gate" placeholder="$0" />
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="goal-cafe" className="col-sm-2 control-label">Cafe:</label>
                    <div className="col-sm-4">
                        <input type="text" id="goal-cafe" placeholder="$000,000" className="form-control total" onBlur={this.totalChange} /><ButtonExpand target="#months-cafe" />
                        <GoalsMonths id="months-cafe" placeholder="$0" />
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="goal-store" className="col-sm-2 control-label">Gift Store:</label>
                    <div className="col-sm-4">
                        <input type="text" id="goal-store" placeholder="$000,000" className="form-control total" onBlur={this.totalChange} /><ButtonExpand target="#months-store" />
                        <GoalsMonths id="months-store" placeholder="$0" />
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="goal-mem-num" className="col-sm-2 control-label">Total Membership #:</label>
                    <div className="col-sm-4">
                        <input type="text" id="goal-mem-num" placeholder="000,000" className="form-control total" onBlur={this.totalChange} />
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="goal-mem-num-fam" className="col-sm-3 control-label">Family #:</label>
                    <div className="col-sm-3">
                        <input type="text" id="goal-mem-num-fam" placeholder="000,000" className="form-control" /><ButtonExpand target="#months-mem-num-fam" />
                        <GoalsMonths id="months-mem-num-fam" placeholder="0" />
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="goal-mem-num-ind" className="col-sm-3 control-label">Individual #:</label>
                    <div className="col-sm-3">
                        <input type="text" id="goal-mem-num-ind" placeholder="000,000" className="form-control" /><ButtonExpand target="#months-mem-num-ind" />
                        <GoalsMonths id="months-mem-num-ind" placeholder="0" />
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="goal-mem-num-don" className="col-sm-3 control-label">Donor #:</label>
                    <div className="col-sm-3">
                        <input type="text" id="goal-mem-num-don" placeholder="000,000" className="form-control" /><ButtonExpand target="#months-mem-num-don" />
                        <GoalsMonths id="months-mem-num-don" placeholder="0" />
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="goal-mem-dol" className="col-sm-2 control-label">Total Membership $:</label>
                    <div className="col-sm-4">
                        <input type="text" id="goal-mem-dol" placeholder="$000,000" className="form-control total" onBlur={this.totalChange} />
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="goal-mem-dol-fam" className="col-sm-3 control-label">Family $:</label>
                    <div className="col-sm-3">
                        <input type="text" id="goal-mem-dol-fam" placeholder="000,000" className="form-control" /><ButtonExpand target="#months-mem-dol-fam" />
                        <GoalsMonths id="months-mem-dol-fam" placeholder="$0" />
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="goal-mem-dol-ind" className="col-sm-3 control-label">Individual $:</label>
                    <div className="col-sm-3">
                        <input type="text" id="goal-mem-dol-ind" placeholder="000,000" className="form-control" /><ButtonExpand target="#months-mem-dol-ind" />
                        <GoalsMonths id="months-mem-dol-ind" placeholder="$0" />
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="goal-mem-dol-don" className="col-sm-3 control-label">Donor $:</label>
                    <div className="col-sm-3">
                        <input type="text" id="goal-mem-dol-don" placeholder="000,000" className="form-control" /><ButtonExpand target="#months-mem-dol-don" />
                        <GoalsMonths id="months-mem-dol-don" placeholder="$0" />
                    </div>
                </div>
                <div className="form-group">
                    <div className="col-sm-offset-2 col-sm-4 save-goals">
                        <button type="button" className="btn btn-default" id="button-save">Save</button>
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
