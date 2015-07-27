/* The change arrow (up or down) displayed next to metrics which have increased or decreased. */
var ChangeArrow = React.createClass({
    render: function() {
        return (
            <svg height={this.props.height} width={this.props.width}>
                <circle cx="50" cy="50" r="25" fill="#ff0099">{this.props.children}</circle>
            </svg>
        );
    }
});

React.render(
    <ChangeArrow height="50" width="50"></ChangeArrow>,
    document.getElementById('test-svg')
);
console.log('Change arrow loaded...');
