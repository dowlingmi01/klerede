/******** The change arrow (up or down) displayed next to metrics which have increased or decreased. ********/

var ChangeArrow = React.createClass({
    render: function() {
        return (
            /* width is 83% of height for this arrow */
            <svg width="20px" height="17px" viewBox="0 0 28.322 33.986" preserveAspectRatio="xMidYMid meet" className={this.props.className}>
                <path fill={this.props.color} d="M16.382 31.766V8.503l8.147 8.15c0.867 0.9 2.3 0.9 3.1 0c0.867-0.868 0.867-2.275-0.001-3.142L16.382 2.2 L14.161 0l-2.222 2.223L0.65 13.512C0.217 13.9 0 14.5 0 15.082s0.217 1.1 0.7 1.571c0.868 0.9 2.3 0.9 3.1 0 l8.148-8.15v23.263c0 1.2 1 2.2 2.2 2.221C15.387 34 16.4 33 16.4 31.8"/>
            </svg>



        );
    }
});

console.log('Change arrow loaded...');
