/***********************************/
/******** HOURLY ATTENDANCE ********/
/***********************************/

require ('./wnt');
var analytics = require("./analytics.js");


var Attendance = React.createClass({
    getInitialState: function() {
        return {
            title: 'Hourly Attendance',
            visitsHourlyAll: [],
            visitsHourlyGA: [],
            visitsHourlyGroup: [],
            visitsHourlyMembership: []
        };
    },
	onStatsResult:function(result) {
        console.log('Attendance data loaded using KAPI...');
        wnt.attendance = result;
        if(this.isMounted()) {
            // LOOP THROUGH DATA TO CREATE ARRAYS
            // var self = this;
            // SET STATE TO ARRAYS FOR RENDERING
            this.setState({
                visitsHourlyAll: result.visits_hourly_all,
                visitsHourlyGA: result.visits_hourly_ga,
                visitsHourlyGroup: result.visits_hourly_group,
                visitsHourlyMembership: result.visits_hourly_membership
            });
			var currentState = this.state;
			for (k in currentState) {
				if (currentState[k] === null) {
					currentState[k] = '-';
				}
			}
			this.setState(currentState);
        }
    },
	callAPI:function functionName(filter) {
        var period = (filter === 'lastyear') ? wnt.yesterdaylastyear : wnt.yesterday;
		var queries = {
            visits_hourly_all: {
                specs: { type: 'visits' },
                periods: { 
                    period: period,
                    hourly: true
                }
            },
            visits_hourly_ga: {
                specs: { type: 'visits', kinds: ['ga'] },
                periods: { 
                    period: period,
                    hourly: true
                }
            },
            visits_hourly_group: {
                specs: { type: 'visits', kinds: ['group'] },
                periods: { 
                    period: period,
                    hourly: true
                }
            },
            visits_hourly_membership: {
                specs: { type: 'visits', kinds: ['membership'] },
                periods: { 
                    period: period,
                    hourly: true
                }
            }
        };
		KAPI.stats.query(wnt.venueID, queries, this.onStatsResult);
	},
    callAPIOLD: function(filter) {
        var period = (filter === 'lastyear') ? wnt.yesterdaylastyear : wnt.yesterday;
        var self = this;
        $.post(
            wnt.apiMain,
            {
                venue_id: wnt.venueID,
                queries: {
                    visits_hourly_all: {
                        specs: { type: 'visits' },
                        periods: { 
                            period: period,
                            hourly: true
                        }
                    },
                    visits_hourly_ga: {
                        specs: { type: 'visits', kinds: ['ga'] },
                        periods: { 
                            period: period,
                            hourly: true
                        }
                    },
                    visits_hourly_group: {
                        specs: { type: 'visits', kinds: ['group'] },
                        periods: { 
                            period: period,
                            hourly: true
                        }
                    },
                    visits_hourly_membership: {
                        specs: { type: 'visits', kinds: ['membership'] },
                        periods: { 
                            period: period,
                            hourly: true
                        }
                    }
                }
            }
        )
        .done(function(result) {
            console.log('Attendance data loaded...');
            wnt.attendance = result;
            if(this.isMounted()) {
                // LOOP THROUGH DATA TO CREATE ARRAYS
                var self = this;
                // SET STATE TO ARRAYS FOR RENDERING
                this.setState({
                    visitsHourlyAll: result.visits_hourly_all,
                    visitsHourlyGA: result.visits_hourly_ga,
                    visitsHourlyGroup: result.visits_hourly_group,
                    visitsHourlyMembership: result.visits_hourly_membership
                });
                // Set null data to '-'
                // var self = this;
                $.each(this.state, function(stat, value){
                    if(value === null){
                        var stateObject = function() {
                            returnObj = {};
                            returnObj[stat] = '-';
                            return returnObj;
                        };
                        self.setState(stateObject);
                    }
                });
                // Set default for datepicker
                // $('#revenue #datepicker').val(wnt.datePickerStart);
            }
        }.bind(this))   // .bind() gives context to 'this'
        .fail(function(result) {
            console.log('ATTENDANCE DATA ERROR! ... ' + result.statusText);
            console.log(result);
        });
    },
    componentDidMount: function() {
        this.callAPI();
        this.drawGraph();
    },
    componentDidUpdate: function(){
        this.drawGraph();        
    },
    convertHour: function(hour){
        var hours = ['12am', '1am', '2am', '3am', '4am', '5am', '6am', '7am', '8am', '9am', '10am', '11am', '12pm', '1pm', '2pm', '3pm', '4pm', '5pm', '6pm', '7pm', '8pm', '9pm', '10pm', '11pm'];
        hour = hours[hour];
        return hour;
    },
    drawGraph: function(){
        // NOTE: Using the "ALL" data first to get the max units for X and Y
        // Remove previous graphs
        d3.select('#graph').selectAll('svg').remove();
        var self = this;
        // define dimensions of graph
        console.log('Width for hourly attendance =', $('#attendance').width());   // Get width to use in calculation (need to rerun on resize)
        var base = $('#attendance').width();
        console.log('WIDTH', base, base - 160);
        var m = [20, 80, 60, 80]; // margins
        var w = 1000 - m[1] - m[3]; // width
        var h = 400 - m[0] - m[2]; // height
        // create a simple array that we'll plot with a line (this array represents only the Y values, X will just be the index location)
        var visitsHourlyAll = [];
        var visitsHourlyGA = [];
        var visitsHourlyGroup = [];
        var visitsHourlyMembership = [];
        for (var i = 0; i < this.state.visitsHourlyAll.length; i++) {
            // Set hour from total array to-loop-for in the 'sub-array'
            var hour = this.state.visitsHourlyAll[i].hour;
            // Also, push unit value into array for the total line
            visitsHourlyAll.push(parseInt(this.state.visitsHourlyAll[i].units));
            // Loop through each 'sub-array' to find unit tied to matching hour from ALL, or push a zero
            var hourGA = false;
            var hourGroup = false;
            var hourMembership = false;
            loopGA:
            for (var j=0; j < this.state.visitsHourlyGA.length; j++){
                if (this.state.visitsHourlyGA[j].hour === hour){
                    visitsHourlyGA.push(parseInt(this.state.visitsHourlyGA[j].units));
                    hourGA = true;
                    break loopGA;
                }
            }
            if(hourGA === false){
                visitsHourlyGA.push(0);
            }
            loopGroup:
            for (var j=0; j < this.state.visitsHourlyGroup.length; j++){
                if (this.state.visitsHourlyGroup[j].hour === hour){
                    visitsHourlyGroup.push(parseInt(this.state.visitsHourlyGroup[j].units));
                    hourGroup = true;
                    break loopGroup;
                }
            }
            if(hourGroup === false){
                visitsHourlyGroup.push(0);
            }
            loopMembership:
            for (var j=0; j < this.state.visitsHourlyMembership.length; j++){
                if (this.state.visitsHourlyMembership[j].hour === hour){
                    visitsHourlyMembership.push(parseInt(this.state.visitsHourlyMembership[j].units));
                    hourMembership = true;
                    break loopMembership;
                }
            }
            if(hourMembership === false){
                visitsHourlyMembership.push(0);
            }
        }
        // X scale will fit all values from the array within pixels 0-w (added '-1' to NOT leave space on end of graph)
        var x = d3.scale.linear().domain([0, visitsHourlyAll.length-1]).range([0, w]);
        // Y scale will fit all values from 0 to d3.max(visitsHourlyAll) within pixels h-0
        var y = d3.scale.linear().domain([0, d3.max(visitsHourlyAll)]).range([h, 0]);
        // create a line function that can convert array into x and y points
        // SVG starts here
        var line = d3.svg.line()
            .interpolate("basis")  // basis is the smoothest ... "a B-spline, with control point duplication on the ends"
            // assign the X function to plot our line as we wish
            .x(function(d,i) { 
                return x(i);   // return the X coordinate where we want to plot this datapoint
            })
            .y(function(d) {
                return y(d);   // return the Y coordinate where we want to plot this datapoint
            });
        // Add an SVG element with the desired dimensions and margin.
        var gw = w + m[1] + m[3];
        var gh = h + m[0] + m[2];
        var graph = d3.select("#graph").append("svg:svg")
            .attr("width", gw)
            .attr("height", gh)
            .attr("viewBox", "0 0 " + gw + " " + gh )
            .attr("preserveAspectRatio", "xMidYMid meet")
            .append("svg:g")
            .attr("transform", "translate(" + m[3] + "," + m[0] + ")");   // Moves it within the viewport
        // create xAxis
        var xAxis = d3.svg.axis()
            .scale(x)
            //.tickSize(-h)
            .tickSubdivide(true)
            .tickFormat(function(i) {
                if(self.state.visitsHourlyAll[i] !== undefined){
                    var label = self.convertHour(self.state.visitsHourlyAll[i].hour)
                    return label;
                }
            });
        // Add the x-axis.
        graph.append("svg:g")
              .attr("class", "x axis")
              .attr("transform", "translate(0," + h + ")")
              .call(xAxis);

        // create left yAxis
        var yAxisLeft = d3.svg.axis()
            .scale(y)
            .ticks(4)
            .orient("left");
        // Add the y-axis to the left
        graph.append("svg:g")
              .attr("class", "y axis")
              //.attr("transform", "translate(-5,0)")  // -25???   separated the Y axis from the graph (weird.  why would they do this?)
              .call(yAxisLeft);
        // Add the line by appending an svg:path element with the array line we created above
        // do this AFTER the axes above so that the line is above the tick-lines
        graph.append("svg:path").attr("class", "graph-line line-all").attr("d", line(visitsHourlyAll));
        graph.append("svg:path").attr("class", "graph-line line-ga").attr("d", line(visitsHourlyGA));
        graph.append("svg:path").attr("class", "graph-line line-group").attr("d", line(visitsHourlyGroup));
        graph.append("svg:path").attr("class", "graph-line line-membership").attr("d", line(visitsHourlyMembership));
    },
    channelFilter: function(event){
        // Toggle the legend/filter checkmark
        $(event.target).closest('.line-graph-legend-item').find('.legend-check-circle').toggleClass('active');
        // Legend items each have a data attribute for matching to their respective bar segments to toggle
        var filter = $(event.target).closest('.line-graph-legend-item').data('segment');
        $('.'+filter).toggle();
    },
    periodChange: function(event){
        var filter = event.target.value;
        this.callAPI(filter);
        // Reset filters
        $('.line-graph-legend-item').find('.legend-check-circle').addClass('active');
        analytics.addEvent('Attendance', 'Filter Changed', filter);
    },
    render: function() {
        return (
            <div className="row">
                <div className="col-xs-12 col-md-12">
                    <div className="widget" id="attendance">
                        
                        <h2>{this.state.title}</h2>

                        <form id="filter-revenue-units">
                            <select className="form-control" onChange={this.periodChange}>
                                <option value="yesterday">Yesterday</option>
                                <option value="lastyear">A Year Ago</option>
                            </select>
                            <Caret className="filter-caret" />
                        </form>

                        <div className="line-graph-legend">
                            <div className="line-graph-legend-item" data-segment="line-all" onClick={this.channelFilter}>
                                <div className="legend-check-circle active">
                                    <CheckMark className="legend-check" />
                                </div>
                                All
                            </div>
                            <div className="line-graph-legend-item" data-segment="line-ga" onClick={this.channelFilter}>
                                <div className="legend-check-circle active">
                                    <CheckMark className="legend-check" />
                                </div>
                                General Admission
                            </div>
                            <div className="line-graph-legend-item" data-segment="line-group" onClick={this.channelFilter}>
                                <div className="legend-check-circle active">
                                    <CheckMark className="legend-check" />
                                </div>
                                Groups
                            </div>
                            <div className="line-graph-legend-item" data-segment="line-membership" onClick={this.channelFilter}>
                                <div className="legend-check-circle active">
                                    <CheckMark className="legend-check" />
                                </div>
                                Membership
                            </div>
                        </div>

                        <div id="graph" className="aGraph"></div>

                    </div>
                </div>
            </div>
        );
    }
});

if(document.getElementById('attendance-row-widget')){
    $.when(wnt.gettingVenueData).done(function(data) {
        React.render(
            <Attendance />,
            document.getElementById('attendance-row-widget')
        );
        console.log('2) Attendance row loaded...');
    });
}
