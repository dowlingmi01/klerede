/* The change arrow (up or down) displayed next to metrics which have increased or decreased. */
var ChangeArrow = React.createClass({
    render: function() {
        return (
            <div>
                Hello
            </div>
        );
    }
});

React.render(
  <ChangeArrow width="134.915px" height="134.915px" />,
  document.getElementById('test-svg')
);
console.log('Change arrow loaded...');
