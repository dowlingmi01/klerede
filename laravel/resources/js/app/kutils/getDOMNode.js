var React = require('react');
var ReactDOM = require('react-dom');


module.exports = function (obj) {
	return ReactDOM.findDOMNode(obj);
}
