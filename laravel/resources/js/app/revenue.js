/*****************************/
/******** REVENUE ROW ********/
/*****************************/

var Revenue = React.createClass({
    render: function() {
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
