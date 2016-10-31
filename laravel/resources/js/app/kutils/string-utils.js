var React = require("react");

module.exports.limitString = function (s, limit, limitter) {
    if (!limitter) limitter = "&hellip;";
    
    if(s.length <= limit) {
        return s;
    }
    var arr = s.split(" ");
    
    var r = "";
    while (r.length < limit-3) {
        r = r + arr.shift() + " ";
    }
    
    return r+"\u2026";
}