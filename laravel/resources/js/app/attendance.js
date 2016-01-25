/***********************************/
/******** HOURLY ATTENDANCE ********/
/***********************************/



    /*************************************/
    /******** TEST BAR GRAPH WAVE ********/
    /*************************************/
    /* HOLD: PROJECTED AREA GRAPH
    var barGraphWidth = $('#bar-graph').width();
    var barSegmentArea = barGraphWidth / 7;
    //The data for our line
    var lineData = [
      { "x": 0,   "y": 250},
      { "x": 0,   "y": 0},
      { "x": barSegmentArea/2,   "y": 5},
      { "x": barSegmentArea*1.5, "y": 100},
      { "x": barSegmentArea*2.5, "y": 80},
      { "x": barSegmentArea*3.5, "y": 120},
      { "x": barSegmentArea*4.5, "y": 100},
      { "x": barSegmentArea*5.5, "y": 5},
      { "x": barGraphWidth,    "y": 60},
      { "x": barGraphWidth,    "y": 250}
    ];

    //This is the accessor function we talked about above
    var lineFunction = d3.svg.line()
          .x(function(d) { return d.x; })
          .y(function(d) { return d.y; })
          .interpolate("monotone");

    //The SVG Container
    var svgContainer = d3.select("#bar-graph").append("svg")
          .attr("width", "100%")
          .attr("height", 250);

    //The line SVG Path we draw
    var lineGraph = svgContainer.append("path")
          .attr("d", lineFunction(lineData))
          .attr("fill", "rgba(236,234,231,1)");
    */



var PlotPoint = React.createClass({
    convertHour: function(hour){
        var hours = ['12am', '1am', '2am', '3am', '4am', '5am', '6am', '7am', '8am', '9am', '10am', '11am', '12pm', '1pm', '2pm', '3pm', '4pm', '5pm', '6pm', '7pm', '8pm', '9pm', '10pm', '11pm'];
        hour = hours[hour];
    },
    render: function() {
        return (
            <li>
                {this.convertHour(this.props.hour)} = {this.props.units}
            </li>
        );
    }
});

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
    },
    render: function() {
        // LOOP FOR BAR SETS
        var plots = [];
        for (var i = 0; i < this.state.visits.length; i++) {
            plots.push(<PlotPoint key={i} hour={this.state.visits[i].hour} units={this.state.visits[i].units} />);
        }
        return (
            <div className="row">
                <div className="col-xs-12 col-md-12">
                    <div className="widget" id="attendance">
                        <h2>{this.state.title}</h2>
                        <ul>
                            {plots}
                        </ul>
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
