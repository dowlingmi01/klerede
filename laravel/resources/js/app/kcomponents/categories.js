var wnt = require("./wnt.js");

var categories;

function sortCats(cats) {
    var sorted = [];
    for(var k in cats) {
        var c = cats[k];
        c.key = k;
        c.sub_categories = sortCats(c.sub_categories);
        sorted.push(c);
    }
    sorted.sort(function(a,b){
        return a.order - b.order;
    });
    
    return sorted;
}

module.exports = function() {
    if (! categories) {
        categories = sortCats(wnt.categories);
    }
    return categories;
}
