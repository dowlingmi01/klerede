var React = require('react');

module.exports = React.createClass({
    componentDidMount:function () {
        // $(this.getDOMNode()).modal("show");
        
    },
    render:function () {
        return (
            <div className="add-note-menu" onClick={this.props.onAddNote}>
                <div className={"menu-content fade "+this.props.fadein} style={{left:this.props.left}} role="tooltip" ><div className="arrow"></div><div className="action" ><a href="#add-note">Add Note</a></div></div>
            </div> 
        );
    }
});