/* The change arrow (up or down) displayed next to metrics which have increased or decreased. */
var ChangeArrow = React.createClass({
    render: function() {
        return (
            <svg height={this.props.height} width={this.props.width}>
                <g>
                    <line className="arrow-line" stroke={this.props.color} x1="30.75" y1="65" x2="30.75" y2="4"/>
                    <line className="arrow-line" stroke={this.props.color} x1="30.75" y1="4" x2="4" y2="30.75"/>
                    <line className="arrow-line" stroke={this.props.color} x1="30.75" y1="4" x2="57.5" y2="30.75"/>
                </g>
            </svg>
        );
    }
});

React.render(
    <ChangeArrow width="62" height="69" color="#ccebeb"></ChangeArrow>,
    document.getElementById('arrow-1')
);
React.render(
    <ChangeArrow width="62" height="69" color="#ff0000"></ChangeArrow>,
    document.getElementById('arrow-2')
);
console.log('Change arrow loaded...');
