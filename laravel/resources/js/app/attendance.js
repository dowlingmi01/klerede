/***********************************/
/******** HOURLY ATTENDANCE ********/
/***********************************/

var Attendance = React.createClass({
    getInitialState: function() {
        return {
            title: 'Hourly Attendance'
        };
    },
    render: function() {
        return (
            <div className="row">
                <div className="col-xs-12 col-md-12">
                    <div className="widget" id="revenue">
                        <h2>{this.state.title}</h2>
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
