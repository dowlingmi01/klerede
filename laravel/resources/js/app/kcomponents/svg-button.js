var React = require('react');

module.exports = React.createClass({
    render:function () {
        if (this.props.disabled) {
            return (
                <div id={this.props.id || ""} className={"svg-button disabled " + (this.props.className || "")}>
                    <div className="svg-button-content">{this.props.icon}</div>
                </div>
            );
        };
        return (
            <div onClick={this.props.onClick || null} onMouseDown={this.props.onMouseDown} id={this.props.id || ""} className={"svg-button " + (this.props.className || "")}>
                <div className="svg-button-content">{this.props.icon}</div>
            </div>
        );
    }
});