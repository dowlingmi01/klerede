/* The change arrow (up or down) displayed next to metrics which have increased or decreased. */
var VisitsBlock = React.createClass({
    render: function() {
        return (
            <div className="stat-block">
                <div className="label">{this.props.label}</div>
                <div className="stat">...</div>
                <div className="change">
                    <ChangeArrow width="62" height="69" color="#ffffff" className={this.props.changeDirection} />
                    {this.props.tempData}
                </div>
            </div>
        );
    }
});

React.render(
    <VisitsBlock label="Total Visitors" tempData="9,981" changeDirection="up" />,
    document.getElementById('visits-total')
);
React.render(
    <VisitsBlock label="Gen Admission" tempData="9,981" changeDirection="up" />,
    document.getElementById('visits-ga')
);
React.render(
    <VisitsBlock label="Groups" tempData="9,981" changeDirection="down" />,
    document.getElementById('visits-groups')
);
React.render(
    <VisitsBlock label="Members" tempData="9,981" changeDirection="up" />,
    document.getElementById('visits-members')
);
React.render(
    <VisitsBlock label="Non-members" tempData="9,981" changeDirection="down" />,
    document.getElementById('visits-nonmembers')
);
React.render(
    <VisitsBlock label="Total Gate" tempData="9,981" changeDirection="up" />,
    document.getElementById('sales-gate')
);
console.log('Visits blocks loaded...');
