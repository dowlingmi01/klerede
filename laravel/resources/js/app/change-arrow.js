/******** The change arrow (up or down) displayed next to metrics which have increased or decreased. ********/

var ChangeArrow = React.createClass({
    render: function() {
        return (
            <svg height={this.props.height} width={this.props.width} className={this.props.className}>
                <g>
                    <line className="arrow-line" stroke={this.props.color} x1="30.75" y1="65" x2="30.75" y2="4"/>
                    <line className="arrow-line" stroke={this.props.color} x1="30.75" y1="4" x2="4" y2="30.75"/>
                    <line className="arrow-line" stroke={this.props.color} x1="30.75" y1="4" x2="57.5" y2="30.75"/>
                </g>
            </svg>
        );
    }
});

console.log('Change arrow loaded...');
