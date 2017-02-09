var React = require('react');
var ReactDOM = require('react-dom');


var $ = require('jquery');
// require('../libs/jquery.easing.1.3.js');
// require('../libs/jquery.numberformatter-1.2.4.jsmin.js');

var moment = require('moment');
moment.updateLocale('en',{
    week:{
        dow:1
    }
});

var wnt = require ('./kcomponents/wnt.js');
var reorderFiscalMonths = require ('./kcomponents/reorder-fiscal-months');

var KAPI = {};
KAPI.auth = require("./kapi/auth.js");
KAPI.stats = require("./kapi/stats.js");
KAPI.goals = require("./kapi/goals.js");


var printDiv = require ('./kutils/print-div.js');
var saveImage = require ('./kutils/save-image.js');

var ActionMenu = require('./reusable-parts').ActionMenu;
var Meter = require('./reusable-parts').Meter;
var Caret = require('./svg-icons').Caret;
var ChangeArrow = require('./svg-icons').ChangeArrow;
var analytics = require("./analytics.js");

var Goals = React.createClass({
    getInitialState:function () {
        return {
            period:'year',
            units:'amount'
        }
    },
    setUnits:function(units){
        this.setState({units:units});
    },
    setPeriod:function(e){
        this.setState({period:e.currentTarget.value});
    },
    getMeterStatus:function(amount, goal, advance) {
        var differenceCompleted = amount/(goal*advance);
        
        if(differenceCompleted < .5) {
            return 'Behind';
        } else if(differenceCompleted < .75) {
            return 'Behind';
        } else if(differenceCompleted < .90) {
            return 'Slightly Behind';
        } else if(differenceCompleted < 1.10) {
            return 'On Track';
        } else {
            return 'Ahead';
        }
        
    },
    render:function() {
        
        var data = this.props.data;
        var units = this.state.units;
        var period = this.state.period;
        var advance = this.props.advance[period];
        
        var channels = [];
        var channelsData = data.sub_categories;
        
        for (var k in channelsData) {
            var cd = channelsData[k];
            var amount = cd.progress[period][units]; 
            var goal = cd.goals[period][units];
            var meterStatus = this.getMeterStatus(amount, goal, advance);
            if(cd['goals_' + units]) {
                channels.push(
                    <Meter key={k} label={cd.name} divID="meter-sales-box" meterStatus={meterStatus} units={this.state.units} advance={advance} amount={amount} goal={goal} completed='sgGoalBoxComplete' />
                )
            }
        }

        var amount = data.progress[period][units]; 
        var goal = data.goals[period][units];
        var meterStatus = this.getMeterStatus(amount, goal, advance);
        
        // console.debug(this.state.units);
        var amountClass = this.state.units=="amount" ? "filter-units selected" : "filter-units";
        var unitsClass = this.state.units=="units" ? "filter-units selected" : "filter-units";
        
        // console.debug(amountClass, unitsClass);
        
        var unitsTab = [];
        
        if(data.goals_amount) {
            unitsTab.push(
                <div key="amount" data-value="amount" className={amountClass} onClick={(e)=>this.setUnits('amount')}>
                    Dollars
                    <div className="filter-highlight"></div>
                </div>
            )
        }
        if(data.goals_units) {
            unitsTab.push(
                <div key="units" data-value="amount" className={unitsClass} onClick={(e)=>this.setUnits('units')}>
                    Units
                    <div className="filter-highlight"></div>
                </div>
            )
        }
        
        
        return(
            <div className="widget  multicolor-wrapper" id="sales-goals" style={{width:"100%", marginBottom:"15px"}}>
                <h2>{data.name}</h2>                    
                <ActionMenu actions={this.props.actions}/>
                <form>
                    <select className="form-control" onChange={this.setPeriod}>
                        <option value="year">Current Year ({wnt.thisFiscalYear})</option>
                        <option value="quarter">Current Quarter (Q{wnt.thisFiscalQuarter})</option>
                        <option value="month">Current Month ({wnt.thisMonthText.substring(0,3)})</option>
                    </select>
                    <Caret className="filter-caret" />
                </form>
                <div id="sg-units">
                    {unitsTab}
                </div>
                <Meter label="TOTAL" divID="meter-sales-total" meterStatus={meterStatus} units={this.state.units} advance={advance} amount={amount} goal={goal} completed='sgGoalTotalComplete' />
                {channels.length ?
                    <div> 
                        <h3>BY TYPE</h3>
                        <div className="channels">
                            {channels}
                        </div>
                    </div>
                            :
                    null
                }
            </div>
        );
    }
});

function sumObjects(values, units, keys) {
    if(!values) {
        return 0;
    }
    var sum = 0;
    if (!keys) {
        for (var i in values) {
            var obj = values[i];
            if (!obj) continue;
            sum+= parseFloat(obj[units]);
        }
    } else {
        for (var i in keys) {
            var obj = values[keys[i]];
            if (!obj) continue;
            sum += parseFloat(obj[units]);
        }
    }
    return sum;
}

function sumValues(values, keys) {
    if(!values) {
        return 0;
    }
    var sum = 0;
    if (!keys) {
        for (var i in values) {
            sum += parseFloat(values[i]);
        }
    } else {
        for (var i in keys) {
            sum += parseFloat(values[keys[i]]);
        }
    }
    return sum;
}

function calculatePartials(goals, advance, thisMonth, thisQuarterMonths) {

    // console.debug(goals, advance, thisMonth, thisQuarterMonths);
    
    for (var k in goals) {
        var channel = goals[k];
        channel.goals = {
            year:{
                amount:sumValues(channel.goals_amount),
                units:sumValues(channel.goals_units)
            },
            quarter: {
                amount:sumValues(channel.goals_amount, thisQuarterMonths),
                units:sumValues(channel.goals_units, thisQuarterMonths)
            },
            month: {
                amount:channel.goals_amount ? channel.goals_amount[thisMonth] : 0,
                units:channel.goals_units ? channel.goals_units[thisMonth] : 0
            }
        }
        // try {
            channel.progress = {
                year:{
                    amount:sumObjects(channel.actuals, 'amount'),
                    units:sumObjects(channel.actuals, 'units')
                },
                quarter: {
                    amount:sumObjects(channel.actuals, 'amount', thisQuarterMonths),
                    units:sumObjects(channel.actuals, 'units', thisQuarterMonths)
                },
                month: {
                    amount:channel.actuals ? channel.actuals[thisMonth] ? channel.actuals[thisMonth].amount : 0 : 0,
                    units:channel.actuals ? channel.actuals[thisMonth] ? channel.actuals[thisMonth].units : 0 : 0
                }
            }
        // } catch(e) {
        //     console.debug(e, channel.actuals);
        // }
        // console.debug(k, channel.actuals);
        calculatePartials(channel.sub_categories, advance, thisMonth, thisQuarterMonths);
        
    }
    
}

var SalesGoals = React.createClass({
    getInitialState: function() {
        var actions = [];
        var permissions = KAPI.auth.getUserPermissions();
        if (permissions["goals-set"]) {
            actions.push({href:"goals", text:"Edit Goals", handler:this.onActionClick});
        };
    
        if(features.save) {
            actions.push({href:"#save", text:"Save", handler:this.onActionClick});
        }
        if (features.print) {
            actions.push({href:"#print", text:"Print", handler:this.onActionClick});
        }

    
        return {
            actions:actions,
            goals:{}
        };
    },
    loadGoals:function(){
        KAPI.goals.sales.get(wnt.venueID, wnt.thisFiscalYear, this.onGoalsLoaded, true, wnt.today);
    },
    onGoalsLoaded:function(goals){
        
        var today = wnt.today;
        
        var startOfYear = moment(wnt.thisFiscalYearStart);

        var startOfQuarter = moment(today).startOf('quarter');
        var endOfQuarter = moment(today).endOf('quarter');
        var quarterLength = endOfQuarter.diff(startOfQuarter, 'days');

        var startOfMonth = moment(today).startOf('month');
        var endOfMonth = moment(today).endOf('month');
        var monthLength = endOfMonth.diff(startOfMonth, 'days');
        
        var yearAdvance = moment(today).diff(startOfYear, 'days')/365 ;
        var quarterAdvance = moment(today).diff(startOfQuarter, 'days') / quarterLength ;
        var monthAdvance = moment(today).diff(startOfMonth, 'days')/monthLength;
        
        
        var thisMonth = moment(today).diff(startOfYear, 'months')+1;
        
        var qm = startOfQuarter.diff(startOfYear, 'months');
        
        // var thisQuarterMonths = [qm+1, qm+2, qm+3];
        var thisQuarterMonths = [qm+1, qm+2, qm+3];
            
        var advance = {
            year:yearAdvance, 
            quarter:quarterAdvance, 
            month:monthAdvance
        }
        
        console.debug({goals:goals, advance:advance, thisMonth:thisMonth, thisQuarterMonths:thisQuarterMonths});
        calculatePartials(goals, advance, thisMonth, thisQuarterMonths);
        
        
        this.setState({
            goals:goals,
            advance:advance,
            thisMonth:thisMonth,
            thisQuarterMonths:thisQuarterMonths
        });
    },
    componentDidUpdate:function () {
        var left = $('#goalsLeft').height();
        var right = $('#goalsRight').height();
        if (left>right) {
            var diff = left - right;
            var last = $('#goalsRight .widget');
        } else {
            diff = right - left;
            last = $('#goalsLeft .widget');
        }
        var div = $(last[last.length-1]);
        $(div.css('height', div.height()+diff+56+"px" ));
        
        // $('.widget.multicolor-wrapper#sales-goals').css('height','200px');
    },
    componentDidMount:function() {
        this.loadGoals();
    },
    render: function() {
        var state = this.state;
        var goalsData = state.goals;
        var goalsLeft = [];
        var goalsRight = [];
        var left = true;
        for(var g in goalsData) {
            
            var goals = left ? goalsLeft : goalsRight;
            var goalsOther = left ? goalsRight : goalsLeft;
            
            var data = goalsData[g];
            goals.push(<Goals key={g} thisMonth={state.thisMonth} thisQuarterMonths={state.thisQuarterMonths} advance={state.advance} data={data} actions={this.state.actions}/>)
            
            goalsOther.push(<div key={g}></div>)
            
            left = !left;
        }
        
        return (
            <div className="row">
                <div className="col-xs-6" id="goalsLeft" >{goalsLeft}</div>
                <div className="col-xs-6" id="goalsRight" >{goalsRight}</div>
            </div>
        );
    }

});

if(document.getElementById('sales-goals-widget')){
    $.when(wnt.gettingVenueData).done(function(data) {
        ReactDOM.render(
            <SalesGoals />,
            document.getElementById('sales-goals-widget')
        );
        console.log('2) Sales Goals row loaded...');
    });
}
