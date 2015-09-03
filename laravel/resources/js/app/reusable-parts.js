/**************************************/
/******** REUSABLE PARTS ICONS ********/
/**************************************/

var ActionMenu = React.createClass({
    render: function() {
        return (
            <div className="plus-sign-menu" data-toggle="popover" data-html="true" data-content="<a href='#'>Edit</a> <a href='#'>Save</a> <a href='#'>Email</a> <a href='#'>Print</a>" data-placement="top">
                <PlusSign className="plus-sign-button" />
            </div>
        );
    }
});

var Segment = React.createClass({
    render: function() {
        return (
            <td className="bar-meter-segment">
                {this.props.label}
            </td>
        );
    }
});

console.log('Reusable parts loaded...');
