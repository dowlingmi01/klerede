/******** HELPER UTILITIES ********/
var wnt ={
    months: [
        'January', 
        'February', 
        'March', 
        'April', 
        'May', 
        'June', 
        'July', 
        'August', 
        'September', 
        'October', 
        'November', 
        'December'
    ],
    updateClock: function(){
        var today = new Date(),
            hours = today.getHours(),
            minutes = today.getMinutes(),
            date = today.getDate(),
            month = wnt.months[today.getMonth()],
            year = today.getFullYear(),
            time,
            period;
        // Handle zeros in front of minutes
        minutes = minutes < 10 ? '0'+minutes : minutes;
        if(hours === 0){
            time = '12:'+minutes;
            period = 'AM';
        }
        else if(hours < 12){
            time = hours+':'+minutes;
            period = 'AM';
        }
        else {
            time = (hours-12)+':'+minutes;
            period = 'PM';
        }
        return [time, period, date, month+' '+year]
    }
};
console.log('Utilities loaded...');












/******** TEST JSON ********/
JSONTest = function() {
    var resultDiv = $("#totalVisitors");
    $.ajax({
            url: "/api/v1/stats/query",
            type: "POST",
            data: {
            venue_id: 1588,
            queries: {
                visits_total: { specs: { type: 'visits' }, periods: '2015-05-06' }
            }
        },
        dataType: "json",
        success: function (result) {
            switch (result) {
                case true:
                    processResponse(result);
                    break;
                default:
                    resultDiv.html(result.visits_total.units).formatNumber({format:"#,###", locale:"us"});     //.formatNumber({format:"#,###.00", locale:"us"})
                    /*
                    .parseNumber({format:"#,###", locale:"us"})
                    .formatNumber({format:"#,###", locale:"us"})
                    */
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(xhr.status);
            alert(thrownError);
        }
    });
};
JSONTest();


/*
{ venue_id: XXXX, queries: { name1: query1, name2: query2, ... } }
Where each queryX has the format:
{
    specs: {
        type: 'visits' / 'sales'
        ...optional specs...
    }
    periods: {
        type: 'date' (default) / 'week' / 'month' / 'quarter' / 'year'
        period: XXXX-XX / from: XXXX-XX, to: XXXX-XX
        kind: 'detail' (default) / 'sum' / 'average'
    }
}
*/
//{"visits_total":{"period":"2015-05-06","units":"2474”}}



