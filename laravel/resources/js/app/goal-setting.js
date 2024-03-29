/**************************************/
/******** REUSABLE PARTS ICONS ********/
/**************************************/

var React = require('react');
var ReactDOM = require('react-dom');


var $ = require("jquery");

var moment=require("moment");

(Function('return this')()).jQuery = require('jquery');
require("bootstrap").collapse;

require("number-to-locale-string");

var wnt = require ('./kcomponents/wnt.js');
var goals = require("./kapi/goals.js");

var ButtonExpand = require('./reusable-parts').ButtonExpand;


var Month = React.createClass({
    render:function() {
        return (
            <span className={this.props.className}>
                <label htmlFor={"goal-"+this.props.order} className="col-sm-2 control-label">{this.props.month}:</label>
                <div className="col-sm-4">
                    <input 
                        type="text" 
                        id={"goal-"+this.props.order} 
                        data-channel={this.props.channel} 
                        data-subchannel={this.props.subchannel} 
                        placeholder={this.props.placeholder} 
                        className={"form-control month-total "+this.props.num+" "+this.props.order} 
                        onBlur={this.props.monthChange}
                        tabIndex={this.props.order} 
                    />
                </div>
            </span>
        );
    }
});

var GoalsMonths = React.createClass({
    getInitialState:function(){
        var monthNames=[];
        var month = moment().month(wnt.venue.fiscal_year_start_month-1);
        
        for (var i=0; i<12; i++) {
            monthNames.push(month.format('MMM'));
            month.add(1, 'M');
        }
        return {
            monthNames:monthNames
        }
    },
	setGoals: function (data, year, channel, type, subChannel) {

		goals.sales.put(wnt.venueID, year, this.onGoalsSet, data, channel, type, subChannel);

        // var url = wnt.apiGoals+'/'+wnt.venueID+'/'+year+'/'+channel+'/'+type;
        // url = !subchannel ? url : url+'/'+subchannel;
		//put:function (venueID, year, onSuccess, data, channel, type, subChannel) {
	},
	onGoalsSet:function (data) {
		console.log(data);
	},
    monthChange: function(event){
        // Remove the special characters for processing
        $(event.target).val($(event.target).val().replace(/\D/g,''));

        if($(event.target).val() == "")  {
            $(event.target).val(0);
        };
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
        
        var self = this;
        // Calculate super-total if there is one
        if(subchannel){
            subchannel = $(event.target).data('subchannel');
            var superTotal = 0;
            $(event.target).closest('.super-set').find('.total').each(function(){
                superTotal += Number($(this).val().replace(/[^0-9\.]+/g,""));
            });
            if($(event.target).hasClass('dollars')){
                self.setGoals(data, wnt.thisFiscalYear, channel, 'amount', subchannel);
                $(event.target).closest('.super-set').find('.super-total').val(parseInt(superTotal).toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }));
            } else {
                self.setGoals(data, wnt.thisFiscalYear, channel, 'units', subchannel);
                $(event.target).closest('.super-set').find('.super-total').val(parseInt(superTotal).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 }));
            }
        }
        self.setGoals(data, wnt.thisFiscalYear, channel, 'amount', subchannel);
        // Convert the number back to a string and format it for display
        if($(event.target).hasClass('dollars')){
            $(event.target).val(parseInt($(event.target).val()).toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }));
        } else {
            $(event.target).val(parseInt($(event.target).val()).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 }));
        }
    },
    render: function() {
        var groups = [], monthNames=this.state.monthNames;
        
        for (var i=0; i<monthNames.length/2; i++) {
            groups.push(
                <div key={i} className="form-group">
                    <Month num={this.props.num} monthChange={this.monthChange} order={i+1} month={monthNames[i]}  channel={this.props.channel} subchannel={this.props.subchannel} />
                    <Month num={this.props.num} monthChange={this.monthChange} order={i+7} month={monthNames[i+6]}  channel={this.props.channel} subchannel={this.props.subchannel} />
                </div>
            );
        }
        
        return (
            <div className="collapse" id={this.props.id}>
                <div className="form-group">
                    <div className="col-sm-8 collapse-title">
                        By Month:
                    </div>
                </div>
                {groups}
            </div>
        );
    }
});

var GoalSetting = React.createClass({
	
	setGoals: function (data, year, channel, type, subChannel) {

		goals.sales.put(wnt.venueID, year, this.onGoalsSet, data, channel, type, subChannel);

        // var url = wnt.apiGoals+'/'+wnt.venueID+'/'+year+'/'+channel+'/'+type;
        // url = !subchannel ? url : url+'/'+subchannel;
		//put:function (venueID, year, onSuccess, data, channel, type, subChannel) {
	},
	onGoalsSet:function (data) {
		console.log(data);
	},
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
        for(var i=1; i<13; i++){
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
		goals.sales.get(wnt.venueID, wnt.thisFiscalYear, this.onGoalsGet);
	},
    componentDidMountOLD: function(){
        var self = this;
        wnt.gettingGoalsData = $.Deferred();
        wnt.getGoals(wnt.thisFiscalYear, wnt.gettingGoalsData);
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
            for(var i=1; i<13; i++){
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
        
        var self=this;
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
                self.setGoals(data, wnt.thisFiscalYear, channel, 'amount', subchannel);
                $(this).val(parseInt(total).toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }));
            } else {
                self.setGoals(data, wnt.thisFiscalYear, channel, 'units', subchannel);
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
        var total = $(event.target).val().replace(/\D/g,'') || 0;
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
        var self = this;
        // Set the super-total if there is one, and set the goals on the API
        if(subchannel){
            subchannel = $(event.target).data('subchannel');
            var superTotal = 0;
            $(event.target).closest('.super-set').find('.total').each(function(){
                superTotal += Number($(this).val().replace(/[^0-9\.]+/g,""));
            });
            if($(event.target).hasClass('dollars')){
                self.setGoals(data, wnt.thisFiscalYear, channel, 'amount', subchannel);
                $(event.target).closest('.super-set').find('.super-total').val(parseInt(superTotal).toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }));
            } else {
                self.setGoals(data, wnt.thisFiscalYear, channel, 'units', subchannel);
                $(event.target).closest('.super-set').find('.super-total').val(parseInt(superTotal).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 }));
            }
        } else {
            self.setGoals(data, wnt.thisFiscalYear, channel, 'amount');
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
                    <label htmlFor="goal-gate" className="col-sm-2 control-label">Guest Services:</label>
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
    $.when(wnt.gettingVenueData).done(function(data) {
	    console.log('Goal setting load...');
	    ReactDOM.render(
	        <GoalSetting />,
	        document.getElementById('goal-setting')
	    );
	    console.log('Goal setting loaded...');
    });
}
