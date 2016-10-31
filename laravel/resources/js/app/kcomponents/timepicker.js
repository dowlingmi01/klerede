var React = require('react');
var $ = require('jquery');
require('timepicker');
var JQTimePicker = React.createClass({
    getInitialState:function() {
        return {
            defaultValue:this.props.defaultValue
        }
    },
    componentWillReceiveProps:function(nextProps) {
        if (nextProps.defaultValue != this.state.defaultValue) {
            this.setState({defaultValue:nextProps.defaultValue});
            $(this.refs.self).timepicker('setTime', nextProps.defaultValue);
        }
    },
    componentDidMount:function () {
        $(this.refs.self).timepicker(
            {"timeFormat":this.props.timeFormat || "g:ia"}
        );
        $(this.refs.self).on("changeTime", this.props.onChange);
    },
    render:function () {
        return (
            <input type="text" id={this.props.id} ref="self" className={this.props.className} defaultValue={this.props.defaultValue} />
        )
    }
});

module.exports = JQTimePicker;