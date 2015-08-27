/**************************************/
/******** MEMBERSHIP GOALS ROW ********/
/**************************************/

var MembershipGoals = React.createClass({
    render: function() {
        return (
            <div>
                TEMP MEMBERSHIP GOALS
            </div>
        );
    }
});

React.render(
    <MembershipGoals source="/api/v1/stats/query" venueID="1588" />,   // TEMP STATIC VENUE ID
    document.getElementById('membership-goals-widget')
);

console.log('Membership Goals row loaded...');
