var React = require('react');
var CheckMark = require('../svg-icons').CheckMark;

var Channel = React.createClass({
    render:function () {
        return(
            <div className={"channel multicolor-wrapper "+this.props.empty}>
                <div className={"circle-checkbox multicolorbg "+this.props.active} onClick={this.props.onClick}>
                    <CheckMark className="legend-check" />
                </div> &nbsp;
                <span>{this.props.name}</span>
                &nbsp;
            </div>
        );
    }
});

module.exports = Channel;