var categories = require('./categories');
module.exports = function () {
    var cats = categories();
    var names = {};
    return getNames(cats, names);
}

function getNames(cats, names) {
    for (var i=0; i<cats.length; i++) {
        //{gate:"Guest Services", cafe: "Cafe", store: "Gift Store", membership: "Membership"};
        var c = cats[i];
        names[c.key] = c.name;
        getNames(c.sub_categories, names);
    }
    return names;
}