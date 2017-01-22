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

module.exports = function() {
    if (! categories) {
        categories = sortCats(wnt.categories);
    }
    return categories;
}


// function buildCats(catsArr) {
//     var cats = {};
//     for (var i=0; i<catsArr.length; i++) {
//         //{gate:"Guest Services", cafe: "Cafe", store: "Gift Store", membership: "Membership"};
//         var c = catsArr[i];
//         cats[c.key] = c;
//         cats[c.key].subCategories = buildCats(c.sub_categories);
//     }
//     return cats;
// }