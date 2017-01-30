var wnt = require("./wnt.js");

var categories;

function sortCats(cats) {
    var sorted = [];
    for(var k in cats) {
        var c = cats[k];
        c.key = k;
        c.subCategories = c.sub_categories;
        c.sub_categories = sortCats(c.sub_categories);
        sorted.push(c);
    }
    sorted.sort(function(a,b){
        return a.order - b.order;
    });
    
    return sorted;
}

function getCategories() {
    if (! categories) {
        categories = sortCats(wnt.categories);
    }
    return categories;
}

module.exports.list = function() {
    return getCategories();
}


module.exports.names = function () {
    var cats = getCategories();
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

module.exports.visitsTypes = function() {
    var cats = getCategories();
    var visits = {};
    return getVisitsTypes(cats, visits);
}

function getVisitsTypes(cats, visits) {
    for (var i=0; i<cats.length; i++) {
        //{gate:"Guest Services", cafe: "Cafe", store: "Gift Store", membership: "Membership"};
        var c = cats[i];
        visits[c.key] = c.visits_type;
        getVisitsTypes(c.sub_categories, visits);
    }
    return visits;
}
