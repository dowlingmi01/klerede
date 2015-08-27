/*****************************/
/******** REVENUE ROW ********/
/*****************************/

var Revenue = React.createClass({
    render: function() {
        $.get('http://api.openweathermap.org/data/2.5/weather', {
            APPID: '86376bb7c673c089067f51ae70a6e79e',
            id: '524901'
        })
        .done(function(result) {
            console.log(result.weather[0].description);
        });
        return (
            <div>
                TEMP REVENUE ROW
            </div>
        );
    }
});

React.render(
    <Revenue source="/api/v1/stats/query" venueID="1588" />,   // TEMP STATIC VENUE ID
    document.getElementById('revenue-row-widget')
);

console.log('Revenue row loaded...');
