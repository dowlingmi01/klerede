/**************************************/
/******** REUSABLE PARTS ICONS ********/
/**************************************/

var GoalsMonths = React.createClass({
    monthChange: function(event){
        // Remove the special characters for processing
        $(event.target).val($(event.target).val().replace(/\D/g,''));
        var channel = $(event.target).data('channel');
        // Initialize subchannel to false
        var subchannel = ($(event.target).closest('.super-set').length > 0) ? true : false;
        var data = {};
        data.months = {};
        var total = 0;
        // TO DO: Create proper num format method for easier useage
        $(event.target).closest('.goal-section').find('.month-total').each(function(index, month){
            var monthNumber = parseInt($(month).attr('id').split('-')[1]);
            var monthVal = Number($(month).val().replace(/[^0-9\.]+/g,""));
            // Populate correct month in object and process value to make it an integer
            data.months[monthNumber] = monthVal;
            // Increment total for updating
            total += monthVal;
        });
        // Convert total to formatted number for display, based on class of units or dollars
        if($(event.target).closest('.goal-section').find('.total').hasClass('dollars')){
            total = parseInt(total).toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 });
        } else {
            total = parseInt(total).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
        }
        // Update section total when a month is changed
        $(event.target).closest('.goal-section').find('.total').val(total);
        // Calculate super-total if there is one
        if(subchannel){
            subchannel = $(event.target).data('subchannel');
            var superTotal = 0;
            $(event.target).closest('.super-set').find('.total').each(function(){
                superTotal += Number($(this).val().replace(/[^0-9\.]+/g,""));
            });
            if($(event.target).hasClass('dollars')){
                wnt.setGoals(data, wnt.thisYear, channel, 'amount', subchannel);
                $(event.target).closest('.super-set').find('.super-total').val(parseInt(superTotal).toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }));
            } else {
                wnt.setGoals(data, wnt.thisYear, channel, 'units', subchannel);
                $(event.target).closest('.super-set').find('.super-total').val(parseInt(superTotal).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 }));
            }
        }
        wnt.setGoals(data, wnt.thisYear, channel, 'amount', subchannel);
        // Convert the number back to a string and format it for display
        if($(event.target).hasClass('dollars')){
            $(event.target).val(parseInt($(event.target).val()).toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }));
        } else {
            $(event.target).val(parseInt($(event.target).val()).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 }));
        }
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
                        <input type="text" id="goal-1" data-channel={this.props.channel} data-subchannel={this.props.subchannel} placeholder={this.props.placeholder} className={"form-control month-total "+this.props.num} onBlur={this.monthChange} tabIndex="1" />
                    </div>
                    <label htmlFor="goal-7" className="col-sm-2 control-label">Jul:</label>
                    <div className="col-sm-4">
                        <input type="text" id="goal-7" data-channel={this.props.channel} data-subchannel={this.props.subchannel} placeholder={this.props.placeholder} className={"form-control month-total "+this.props.num} onBlur={this.monthChange} tabIndex="7" />
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="goal-2" className="col-sm-2 control-label">Feb:</label>
                    <div className="col-sm-4">
                        <input type="text" id="goal-2" data-channel={this.props.channel} data-subchannel={this.props.subchannel} placeholder={this.props.placeholder} className={"form-control month-total "+this.props.num} onBlur={this.monthChange} tabIndex="2" />
                    </div>
                    <label htmlFor="goal-8" className="col-sm-2 control-label">Aug:</label>
                    <div className="col-sm-4">
                        <input type="text" id="goal-8" data-channel={this.props.channel} data-subchannel={this.props.subchannel} placeholder={this.props.placeholder} className={"form-control month-total "+this.props.num} onBlur={this.monthChange} tabIndex="8" />
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="goal-3" className="col-sm-2 control-label">Mar:</label>
                    <div className="col-sm-4">
                        <input type="text" id="goal-3" data-channel={this.props.channel} data-subchannel={this.props.subchannel} placeholder={this.props.placeholder} className={"form-control month-total "+this.props.num} onBlur={this.monthChange} tabIndex="3" />
                    </div>
                    <label htmlFor="goal-9" className="col-sm-2 control-label">Sep:</label>
                    <div className="col-sm-4">
                        <input type="text" id="goal-9" data-channel={this.props.channel} data-subchannel={this.props.subchannel} placeholder={this.props.placeholder} className={"form-control month-total "+this.props.num} onBlur={this.monthChange} tabIndex="9" />
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="goal-4" className="col-sm-2 control-label">Apr:</label>
                    <div className="col-sm-4">
                        <input type="text" id="goal-4" data-channel={this.props.channel} data-subchannel={this.props.subchannel} placeholder={this.props.placeholder} className={"form-control month-total "+this.props.num} onBlur={this.monthChange} tabIndex="4" />
                    </div>
                    <label htmlFor="goal-10" className="col-sm-2 control-label">Oct:</label>
                    <div className="col-sm-4">
                        <input type="text" id="goal-10" data-channel={this.props.channel} data-subchannel={this.props.subchannel} placeholder={this.props.placeholder} className={"form-control month-total "+this.props.num} onBlur={this.monthChange} tabIndex="10" />
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="goal-5" className="col-sm-2 control-label">May:</label>
                    <div className="col-sm-4">
                        <input type="text" id="goal-5" data-channel={this.props.channel} data-subchannel={this.props.subchannel} placeholder={this.props.placeholder} className={"form-control month-total "+this.props.num} onBlur={this.monthChange} tabIndex="5" />
                    </div>
                    <label htmlFor="goal-11" className="col-sm-2 control-label">Nov:</label>
                    <div className="col-sm-4">
                        <input type="text" id="goal-11" data-channel={this.props.channel} data-subchannel={this.props.subchannel} placeholder={this.props.placeholder} className={"form-control month-total "+this.props.num} onBlur={this.monthChange} tabIndex="11" />
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="goal-6" className="col-sm-2 control-label">Jun:</label>
                    <div className="col-sm-4">
                        <input type="text" id="goal-6" data-channel={this.props.channel} data-subchannel={this.props.subchannel} placeholder={this.props.placeholder} className={"form-control month-total "+this.props.num} onBlur={this.monthChange} tabIndex="6" />
                    </div>
                    <label htmlFor="goal-12" className="col-sm-2 control-label">Dec:</label>
                    <div className="col-sm-4">
                        <input type="text" id="goal-12" data-channel={this.props.channel} data-subchannel={this.props.subchannel} placeholder={this.props.placeholder} className={"form-control month-total "+this.props.num} onBlur={this.monthChange} tabIndex="12" />
                    </div>
                </div>
            </div>
        );
    }
});

var GoalSetting = React.createClass({
	
	onGoalsGet:function (goals) {
        // Set global for easy reuse
        wnt.goals = goals;
        var goalBoxoffice = 0;
        var goalCafe = 0;
        var goalGiftstore = 0;
        var goalMemFamUni = 0;
        var goalMemFamDol = 0;
        var goalMemIndUni = 0;
        var goalMemIndDol = 0;
        // Add up months to get totals for display
        for(i=1; i<13; i++){
            var key = i;
            // Grab single month amount...
            var goalBoxofficeMonth = goals['gate/amount'].months[key.toString()];
            var goalCafeMonth = goals['cafe/amount'].months[key.toString()];
            var goalGiftstoreMonth = goals['store/amount'].months[key.toString()];
            var famUni = goals['membership/units'].sub_channels.family.months[key.toString()];
            var famDol = goals['membership/amount'].sub_channels.family.months[key.toString()];
            var indUni = goals['membership/units'].sub_channels.individual.months[key.toString()];
            var indDol = goals['membership/amount'].sub_channels.individual.months[key.toString()];
           // Set corresponding month display...
            $('#goal-gate').parent().find('#goal-'+i).val(goalBoxofficeMonth.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }));
            $('#goal-cafe').parent().find('#goal-'+i).val(goalCafeMonth.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }));
            $('#goal-store').parent().find('#goal-'+i).val(goalGiftstoreMonth.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }));
            $('#goal-membership-uni-fam').parent().find('#goal-'+i).val(famUni.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 }));
            $('#goal-membership-uni-ind').parent().find('#goal-'+i).val(indUni.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 }));
            $('#goal-membership-dol-fam').parent().find('#goal-'+i).val(famDol.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }));
            $('#goal-membership-dol-ind').parent().find('#goal-'+i).val(indDol.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }));
            // Increment totals
            goalBoxoffice += goalBoxofficeMonth;
            goalCafe += goalCafeMonth;
            goalGiftstore += goalGiftstoreMonth;
            goalMemFamUni += famUni;
            goalMemFamDol += famDol;
            goalMemIndUni += indUni;
            goalMemIndDol += indDol;
        }
        // Set totals
        $('#goal-gate').val(goalBoxoffice.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }));
        $('#goal-cafe').val(goalCafe.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }));
        $('#goal-store').val(goalGiftstore.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }));
        // Set membership sub-totals
        $('#goal-membership-uni-fam').val(goalMemFamUni.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 }));
        $('#goal-membership-uni-ind').val(goalMemIndUni.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 }));
        $('#goal-membership-dol-fam').val(goalMemFamDol.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }));
        $('#goal-membership-dol-ind').val(goalMemIndDol.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }));
        // Set Membership Super-totals
        var goalMemUni = goalMemFamUni + goalMemIndUni;
        var goalMemDol = goalMemFamDol + goalMemIndDol;
        $('#goal-membership-uni').val(goalMemUni.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 }));
        $('#goal-membership-dol').val(goalMemDol.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }));
        // Set individual months ... $('#goal-gate').parent().find('input').length
        // self.formatNumbers();   // Turning off Safari decimal fix since it's breaking goals #261
		
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
    componentDidMount: function(){
		KAPI.goals.sales(wnt.venueID, wnt.thisYear, this.onGoalsGet);
	},
    componentDidMountOLD: function(){
        var self = this;
        wnt.gettingGoalsData = $.Deferred();
        wnt.getGoals(wnt.thisYear, wnt.gettingGoalsData);
        // Set fields with goals data from server
        $.when(wnt.gettingGoalsData).done(function(goals) {
            // Set global for easy reuse
            wnt.goals = goals;
            var goalBoxoffice = 0;
            var goalCafe = 0;
            var goalGiftstore = 0;
            var goalMemFamUni = 0;
            var goalMemFamDol = 0;
            var goalMemIndUni = 0;
            var goalMemIndDol = 0;
            // Add up months to get totals for display
            for(i=1; i<13; i++){
                var key = i;
                // Grab single month amount...
                var goalBoxofficeMonth = goals['gate/amount'].months[key.toString()];
                var goalCafeMonth = goals['cafe/amount'].months[key.toString()];
                var goalGiftstoreMonth = goals['store/amount'].months[key.toString()];
                var famUni = goals['membership/units'].sub_channels.family.months[key.toString()];
                var famDol = goals['membership/amount'].sub_channels.family.months[key.toString()];
                var indUni = goals['membership/units'].sub_channels.individual.months[key.toString()];
                var indDol = goals['membership/amount'].sub_channels.individual.months[key.toString()];
               // Set corresponding month display...
                $('#goal-gate').parent().find('#goal-'+i).val(goalBoxofficeMonth.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }));
                $('#goal-cafe').parent().find('#goal-'+i).val(goalCafeMonth.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }));
                $('#goal-store').parent().find('#goal-'+i).val(goalGiftstoreMonth.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }));
                $('#goal-membership-uni-fam').parent().find('#goal-'+i).val(famUni.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 }));
                $('#goal-membership-uni-ind').parent().find('#goal-'+i).val(indUni.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 }));
                $('#goal-membership-dol-fam').parent().find('#goal-'+i).val(famDol.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }));
                $('#goal-membership-dol-ind').parent().find('#goal-'+i).val(indDol.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }));
                // Increment totals
                goalBoxoffice += goalBoxofficeMonth;
                goalCafe += goalCafeMonth;
                goalGiftstore += goalGiftstoreMonth;
                goalMemFamUni += famUni;
                goalMemFamDol += famDol;
                goalMemIndUni += indUni;
                goalMemIndDol += indDol;
            }
            // Set totals
            $('#goal-gate').val(goalBoxoffice.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }));
            $('#goal-cafe').val(goalCafe.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }));
            $('#goal-store').val(goalGiftstore.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }));
            // Set membership sub-totals
            $('#goal-membership-uni-fam').val(goalMemFamUni.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 }));
            $('#goal-membership-uni-ind').val(goalMemIndUni.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 }));
            $('#goal-membership-dol-fam').val(goalMemFamDol.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }));
            $('#goal-membership-dol-ind').val(goalMemIndDol.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }));
            // Set Membership Super-totals
            var goalMemUni = goalMemFamUni + goalMemIndUni;
            var goalMemDol = goalMemFamDol + goalMemIndDol;
            $('#goal-membership-uni').val(goalMemUni.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 }));
            $('#goal-membership-dol').val(goalMemDol.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }));
            // Set individual months ... $('#goal-gate').parent().find('input').length
            // self.formatNumbers();   // Turning off Safari decimal fix since it's breaking goals #261
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
    superTotalChange: function(event){
        var channel = $(event.target).data('channel');
        var subchannels = $(event.target).closest('.super-set').find('.total').length;
        var total = $(event.target).val() / subchannels;
        var monthTotal = total / 12;
        // Equalize across totals and months
        // Loop through subchannels
        $(event.target).closest('.super-set').find('.total').each(function(){
            var subchannel;
            var data = {};
            data.months = {};
            // Loop through months
            $(this).closest('.goal-section').find('.month-total').each(function(index, month){
                subchannel = $(month).data('subchannel');
                // Populate correct month in object
                var monthNumber = parseInt($(month).attr('id').split('-')[1]);
                data.months[monthNumber] = monthTotal;
                if($(event.target).hasClass('dollars')){
                    $(this).val(parseInt(monthTotal).toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }));
                } else {
                    $(this).val(parseInt(monthTotal).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 }));
                }
            });
            console.log(data);
            // Set goals on server and format number for display
            if($(event.target).hasClass('dollars')){
                wnt.setGoals(data, wnt.thisYear, channel, 'amount', subchannel);
                $(this).val(parseInt(total).toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }));
            } else {
                wnt.setGoals(data, wnt.thisYear, channel, 'units', subchannel);
                $(this).val(parseInt(total).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 }));
            }
        });
        if($(event.target).hasClass('dollars')){
            $(event.target).val(parseInt($(event.target).val()).toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }));
        } else {
            $(event.target).val(parseInt($(event.target).val()).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 }));
        }
    },
    totalChange: function(event){
        var channel = $(event.target).data('channel');
        var data = {};
        var subchannel = ($(event.target).closest('.super-set').length > 0) ? true : false;
        // When a total is changed, remove the special characters for processing and equalize the goal across the months
        var total = $(event.target).val().replace(/\D/g,'');
        $(event.target).val(total);
        var monthTotal = Math.round(total / 12);
        data.months = {
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
        };
        // Set the months in the display
        $.each($(event.target).parent().find('.month-total'), function(index, month){
            if($(month).hasClass('dollars')){
                $(month).val(parseInt(monthTotal).toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }));
            } else {
                $(month).val(parseInt(monthTotal).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 }));
            }
        });
        // Set the super-total if there is one, and set the goals on the API
        if(subchannel){
            subchannel = $(event.target).data('subchannel');
            var superTotal = 0;
            $(event.target).closest('.super-set').find('.total').each(function(){
                superTotal += Number($(this).val().replace(/[^0-9\.]+/g,""));
            });
            if($(event.target).hasClass('dollars')){
                wnt.setGoals(data, wnt.thisYear, channel, 'amount', subchannel);
                $(event.target).closest('.super-set').find('.super-total').val(parseInt(superTotal).toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }));
            } else {
                wnt.setGoals(data, wnt.thisYear, channel, 'units', subchannel);
                $(event.target).closest('.super-set').find('.super-total').val(parseInt(superTotal).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 }));
            }
        } else {
            wnt.setGoals(data, wnt.thisYear, channel, 'amount');
        }
        // Convert the number back to a string and format it for display
        if($(event.target).hasClass('dollars')){
            $(event.target).val(parseInt($(event.target).val()).toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }));
        } else {
            $(event.target).val(parseInt($(event.target).val()).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 }));
        }
    },
    componentDidUpdate: function(){
        // this.formatNumbers();   // Turning off Safari decimal fix since it's breaking goals #261
    },
    formatNumbers: function(){
        $('.dollars').parseNumber({format:"$#,###", locale:"us"});
        $('.dollars').formatNumber({format:"$#,###", locale:"us"});
        $('.units').parseNumber({format:"#,###", locale:"us"});
        $('.units').formatNumber({format:"#,###", locale:"us"});
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
                        <input type="text" id="goal-gate" data-channel="gate" placeholder="$000,000" className="form-control total dollars" onBlur={this.totalChange} /><ButtonExpand target="#months-gate" />
                        <GoalsMonths id="months-gate" placeholder="$0" num="dollars" channel="gate" />
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="goal-cafe" className="col-sm-2 control-label">Cafe:</label>
                    <div className="col-sm-4 goal-section">
                        <input type="text" id="goal-cafe" data-channel="cafe" placeholder="$000,000" className="form-control total dollars" onBlur={this.totalChange} /><ButtonExpand target="#months-cafe" />
                        <GoalsMonths id="months-cafe" placeholder="$0" num="dollars" channel="cafe" />
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="goal-store" className="col-sm-2 control-label">Gift Store:</label>
                    <div className="col-sm-4 goal-section">
                        <input type="text" id="goal-store" data-channel="store" placeholder="$000,000" className="form-control total dollars" onBlur={this.totalChange} /><ButtonExpand target="#months-store" />
                        <GoalsMonths id="months-store" placeholder="$0" num="dollars" channel="store" />
                    </div>
                </div>


                <div className="super-set memberships-units">
                    <div className="form-group">
                        <label htmlFor="goal-membership-uni" className="col-sm-2 control-label">Total Membership #:</label>
                        <div className="col-sm-4">
                            <input type="text" id="goal-membership-uni" data-channel="membership" placeholder="000,000" className="form-control super-total units" onBlur={this.superTotalChange} />
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="goal-membership-uni-fam" className="col-sm-3 control-label">Family #:</label>
                        <div className="col-sm-3 goal-section">
                            <input type="text" id="goal-membership-uni-fam" data-channel="membership" data-subchannel="family" placeholder="000,000" className="form-control total units" onBlur={this.totalChange} /><ButtonExpand target="#months-membership-uni-fam" />
                            <GoalsMonths id="months-membership-uni-fam" placeholder="0" num="units" channel="membership" subchannel="family" />
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="goal-membership-uni-ind" className="col-sm-3 control-label">Individual #:</label>
                        <div className="col-sm-3 goal-section">
                            <input type="text" id="goal-membership-uni-ind" data-channel="membership" data-subchannel="individual" placeholder="000,000" className="form-control total units" onBlur={this.totalChange} /><ButtonExpand target="#months-membership-uni-ind" />
                            <GoalsMonths id="months-membership-uni-ind" placeholder="0" num="units" channel="membership" subchannel="individual" />
                        </div>
                    </div>
                </div>


                <div className="super-set memberships-dollars">
                    <div className="form-group">
                        <label htmlFor="goal-membership-dol" className="col-sm-2 control-label">Total Membership $:</label>
                        <div className="col-sm-4">
                            <input type="text" id="goal-membership-dol" data-channel="membership" placeholder="$000,000" className="form-control super-total dollars" onBlur={this.superTotalChange} />
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="goal-membership-dol-fam" className="col-sm-3 control-label">Family $:</label>
                        <div className="col-sm-3 goal-section">
                            <input type="text" id="goal-membership-dol-fam" data-channel="membership" data-subchannel="family" placeholder="000,000" className="form-control total dollars" onBlur={this.totalChange} /><ButtonExpand target="#months-membership-dol-fam" />
                            <GoalsMonths id="months-membership-dol-fam" placeholder="$0" num="dollars" channel="membership" subchannel="family" />
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="goal-membership-dol-ind" className="col-sm-3 control-label">Individual $:</label>
                        <div className="col-sm-3 goal-section">
                            <input type="text" id="goal-membership-dol-ind" data-channel="membership" data-subchannel="individual" placeholder="000,000" className="form-control total dollars" onBlur={this.totalChange} /><ButtonExpand target="#months-membership-dol-ind" />
                            <GoalsMonths id="months-membership-dol-ind" placeholder="$0" num="dollars" channel="membership" subchannel="individual" />
                        </div>
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
