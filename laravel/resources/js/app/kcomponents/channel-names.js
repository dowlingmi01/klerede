var categories = require('./categories');
module.exports = function () {
    var cats = categories();
    var names = {};
    for (var i=0; i<cats.length; i++) {
        //{gate:"Guest Services", cafe: "Cafe", store: "Gift Store", membership: "Membership"};
        var c = cats[i];
        names[c.key] = c.name;
    }
    return names;
}