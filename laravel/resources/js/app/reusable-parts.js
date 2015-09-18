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

var Dial = React.createClass({
    render: function() {
        return (
            <div id={this.props.divID} className="dial">
                <div className="channel-info">
                    <div className="channel-name">{this.props.label}</div>
                    <div className="channel-amount">{this.props.amount}</div>
                    <div className="channel-goal">Goal: <span className="amount">{this.props.goal}</span></div>
                    <div className={"channel-status " + this.props.statusClass}>{this.props.status}</div>
                </div>
            </div>
        );
    }
});

console.log('Reusable parts loaded...');
