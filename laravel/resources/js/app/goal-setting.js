/**************************************/
/******** REUSABLE PARTS ICONS ********/
/**************************************/

var GoalSetting = React.createClass({
    render: function() {
        return (
            <div className="button-expand collapsed" data-toggle="collapse" data-target="#months-boxoffice">
                <Caret />
            </div>
        );
    }
});

if(document.getElementById('goal-setting')){
    React.render(
        <GoalSetting />,
        document.getElementById('goal-setting')
    );
    console.log('Goal setting loaded...');
}
