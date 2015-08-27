/*********************************/
/******** SALES GOALS ROW ********/
/*********************************/

var SalesGoals = React.createClass({
    render: function() {
        return (
            <div>
                TEMP SALES GOALS
            </div>
        );
    }
});

React.render(
    <SalesGoals source="/api/v1/stats/query" venueID="1588" />,   // TEMP STATIC VENUE ID
    document.getElementById('sales-goals-widget')
);

console.log('Sales Goals row loaded...');
