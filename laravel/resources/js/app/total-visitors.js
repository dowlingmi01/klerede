/* The change arrow (up or down) displayed next to metrics which have increased or decreased. */
var TotalVisitors = React.createClass({
    render: function() {
        return (
            <div className="stat-block" id="visitsTotal">
                <div className="label">Total Visitors</div>
                <div className="stat">...</div>
                <div className="change up"><span className="glyphicon glyphicon-arrow-up" ariaHidden="true"></span> 9,981</div>
            </div>
        );
    }
});

React.render(
    <TotalVisitors />,
    document.getElementById('total-visitors')
);
console.log('Total Visitors block loaded...');
