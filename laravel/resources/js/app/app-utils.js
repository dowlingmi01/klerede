/******** Global helpers ********/
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

/******** Globally accessible API-formatted dates ********/
wnt.today = new Date();
wnt.yesterday = new Date(wnt.today);
wnt.yesterday.setDate(wnt.today.getDate() - 1);
wnt.daybeforeyesterday = new Date(wnt.today);
wnt.daybeforeyesterday.setDate(wnt.today.getDate() - 2);
wnt.today = wnt.formatDate(wnt.today);
wnt.yesterday = wnt.formatDate(wnt.yesterday);
wnt.daybeforeyesterday = wnt.formatDate(wnt.yesterday);

console.log('App utilities loaded...');

// TO DO: DIFFERENT DATE FORMATS????


/******** TESTS ********/
$(function(){
    /*
    $today = new Date();
    $yesterday = new Date($today);
    $yesterday.setDate($today.getDate() - 1);
    $('#tempDate').html(($yesterday.getMonth()+1)+'/'+$yesterday.getDate()+'/'+$yesterday.getFullYear());
    */
    $('#tempDate').html(wnt.yesterday);
});
// .formatNumber({format:"#,###", locale:"us"})
/*
periods: {
    type: 'date' (default) / 'week' / 'month' / 'quarter' / 'year'
    period: XXXX-XX / from: XXXX-XX, to: XXXX-XX
    subperiod (optional): 'date' / 'week' / 'month' / 'quarter'
    kind: 'detail' (default) / 'sum' / 'average'
}
*/






