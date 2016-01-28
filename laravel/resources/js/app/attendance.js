/***********************************/
/******** HOURLY ATTENDANCE ********/
/***********************************/

var Attendance = React.createClass({
    getInitialState: function() {
        return {
            title: 'Hourly Attendance',
            visits: []
        };
    },
    componentDidMount: function() {
        var self = this;
        $.post(
            wnt.apiMain,
            {
                venue_id: wnt.venueID,
                queries: {
                    visits_hourly: {
                        specs: { type: 'visits' },   // kinds: ['ga' / 'group' / 'membership']
                        periods: { 
                            period: wnt.yesterday,
                            hourly: true
                        }
                    }
                }
            }
        )
        .done(function(result) {
            console.log('Attendance data loaded...');
            console.log(result);
            wnt.attendance = result;
            console.log(wnt.attendance.visits_hourly);
            if(this.isMounted()) {
                // LOOP THROUGH DATA TO CREATE ARRAYS
                var self = this;
                // SET STATE TO ARRAYS FOR RENDERING
                this.setState({
                    visits: result.visits_hourly
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
        // Remove previous graph
        d3.select('#graph').selectAll('svg').remove();
        var self = this;
        // define dimensions of graph
        var m = [80, 80, 80, 80]; // margins
        var w = 1000 - m[1] - m[3]; // width
        var h = 400 - m[0] - m[2]; // height
        
        // create a simple data array that we'll plot with a line (this array represents only the Y values, X will just be the index location)
        //var data = [3, 6, 2, 7, 5, 2, 0, 3, 8, 9, 2, 5, 9, 3, 6, 3, 6, 2, 7, 5, 2, 1, 3, 8, 9, 2, 5, 9, 2, 7];
        var data = [];
        var maxVal = 0;
        console.log(this.state.visits.length);
        for (var i = 0; i < this.state.visits.length; i++) {
            var units = parseInt(this.state.visits[i].units);
            // if(units > maxVal) {
            //     maxVal = units;
            // }
            data.push(units);
        }
        console.log('MAX = ' + maxVal);

        // X scale will fit all values from data[] within pixels 0-w
        var x = d3.scale.linear().domain([0, data.length-1]).range([0, w]);  // added '-1' to not leave space on end
        // Y scale will fit values from 0-10 within pixels h-0 (Note the inverted domain for the y-scale: bigger is up!)
        var y = d3.scale.linear().domain([0, d3.max(data)]).range([h, 0]);
            // automatically determining max range can work something like this
            // var y = d3.scale.linear().domain([0, d3.max(data)]).range([h, 0]);

        // create a line function that can convert data[] into x and y points
        // SVG starts here
        var line = d3.svg.line()
            .interpolate("basis")  // basis is the smoothest ... "a B-spline, with control point duplication on the ends"
            // assign the X function to plot our line as we wish
            .x(function(d,i) { 
                // verbose logging to show what's actually being done
                console.log('Plotting X value for data point: ' + d + ' using index: ' + i + ' to be at: ' + x(i) + ' using our xScale.');
                // return the X coordinate where we want to plot this datapoint
                return x(i); 
            })
            .y(function(d) { 
                // verbose logging to show what's actually being done
                console.log('Plotting Y value for data point: ' + d + ' to be at: ' + y(d) + " using our yScale.");
                // return the Y coordinate where we want to plot this datapoint
                return y(d); 
            });

        // Add an SVG element with the desired dimensions and margin.
        // <svg width="51.9px" height="22.322px" viewBox="0 0 51.9 22.322" preserveAspectRatio="xMidYMid meet"
        //.attr("viewBox", "0 0 " + w + " " + h )
        //    .attr("preserveAspectRatio", "xMidYMid meet");
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
                if(self.state.visits[i] !== undefined){
                    var label = self.convertHour(self.state.visits[i].hour)
                    return label;
                }
            });
        var xAxisGrid = d3.svg.axis()   // Second xAxis declaration for the light grid lines
            .scale(x)
            .tickSize(-h)
            .tickSubdivide(true);
        // .tickFormat(function(d) { return dataset[d].keyword; })
        // Add the x-axis.
        graph.append("svg:g")
              .attr("class", "x axis")
              .attr("transform", "translate(0," + h + ")")
              .call(xAxis);
        // graph.append("svg:g")   // Second xAxis drawing for the light grid lines
        //       .attr("class", "x axis grid")
        //       .call(xAxisGrid);

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
        
        // Add the line by appending an svg:path element with the data line we created above
        // do this AFTER the axes above so that the line is above the tick-lines
        graph.append("svg:path").attr("class", "graph-line").attr("d", line(data));
    },
    render: function() {
        return (
            <div className="row">
                <div className="col-xs-12 col-md-12">
                    <div className="widget" id="attendance">
                        <h2>{this.state.title}</h2>
                        <div id="graph" className="aGraph"></div>
                    </div>
                </div>
            </div>
        );
    }
});

if(document.getElementById('attendance-row-widget')){
    React.render(
        <Attendance />,
        document.getElementById('attendance-row-widget')
    );
    console.log('Attendance row loaded...');
}
