/********************************/
/******** GLOBAL HELPERS ********/
/********************************/

var wnt = {
    formatDate: function(dateObj) {
        var mm = dateObj.getMonth()+1,
            dd = dateObj.getDate(),
            formattedDate = dateObj.getFullYear()+'-'+wnt.doubleDigits(mm)+'-'+wnt.doubleDigits(dd);
        return formattedDate;
    },
    doubleDigits: function(num) {
        num = num < 10 ? '0'+num : num;
        return num;
    }
};

/********************************************/
/******** GLOBAL API-FORMATTED DATES ********/
/********************************************/

wnt.today = new Date();
wnt.yesterday = new Date(wnt.today);
wnt.yesterday.setDate(wnt.today.getDate() - 1);
wnt.daybeforeyesterday = new Date(wnt.today);
wnt.daybeforeyesterday.setDate(wnt.today.getDate() - 2);
wnt.today = wnt.formatDate(wnt.today);
wnt.yesterday = wnt.formatDate(wnt.yesterday);
wnt.daybeforeyesterday = wnt.formatDate(wnt.daybeforeyesterday);

console.log('App utilities loaded...');



/* TEST DIAL */
var div1=d3.select(document.getElementById('div1'));
var div2=d3.select(document.getElementById('div2'));
var div3=d3.select(document.getElementById('div3'));
var div4=d3.select(document.getElementById('div4'));

start();

function onClick1() {
    deselect();
    div1.attr("class","selectedRadial");
}

function onClick2() {
    deselect();
    div2.attr("class","selectedRadial");
}

function onClick3() {
    deselect();
    div3.attr("class","selectedRadial");
}

function onClick4() {
    deselect();
    div4.attr("class","selectedRadial");
}

function labelFunction(val,min,max) {

}

function deselect() {
    div1.attr("class","radial");
    div2.attr("class","radial");
    div3.attr("class","radial");
    div4.attr("class","radial");
}

function start() {

    var rp1 = radialProgress(document.getElementById('div1'))
            .label("RADIAL 1")
            .onClick(onClick1)
            .diameter(150)
            .value(78)
            .render();

    var rp2 = radialProgress(document.getElementById('div2'))
            .label("RADIAL 2")
            .onClick(onClick2)
            .diameter(150)
            .value(132)
            .render();

    var rp3 = radialProgress(document.getElementById('div3'))
            .label("RADIAL 3")
            .onClick(onClick3)
            .diameter(150)
            .minValue(100)
            .maxValue(200)
            .value(150)
            .render();

    var rp4 = radialProgress(document.getElementById('div4'))
            .label("RADIAL 4")
            .onClick(onClick4)
            .diameter(150)
            .minValue(100)
            .maxValue(200)
            .value(187)
            .render();

}