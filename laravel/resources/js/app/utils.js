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
        // Format hours and period (AM/PM)
        if(hours === 0){
            time = '12:'+minutes;
            period = 'AM';
        }
        else if(hours < 12){
            time = hours+':'+minutes;
            period = 'AM';
        }
        else if(hours === 12){
            time = hours+':'+minutes;
            period = 'PM';
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
    var visitsTotal = $("#visitsTotal .stat"),
        visitsGA = $("#visitsGA .stat"),
        visitsGroups = $("#visitsGroups .stat"),
        visitsMembers = $("#visitsMembers .stat"),
        visitsNonmembers = $("#visitsNonmembers .stat"),
        salesGate = $("#salesGate .stat");
    $.ajax({
            url: "/api/v1/stats/query",
            type: "POST",
            data: {
            venue_id: 1588,
            queries: {
                visits_total: { specs: { type: 'visits' }, periods: '2015-05-06' },
                visits_ga: { specs: { type: 'visits', kinds: ['ga'] }, periods: '2015-05-06' },
                visits_groups: { specs: { type: 'visits', kinds: ['group'] }, periods: '2015-05-06' },
                visits_members: { specs: { type: 'visits', kinds: ['member'] }, periods: '2015-05-06' },
                visits_nonmembers: { specs: { type: 'visits', kinds: ['ga', 'group'] }, periods: '2015-05-06' },
                sales_gate: { specs: { type: 'sales', channel: 'gate' }, periods: '2015-05-06' }
            }
        },
        dataType: "json",
        success: function (result) {
            switch (result) {
                case true:
                    processResponse(result);
                    break;
                default:
                    visitsTotal.html(result.visits_total.units).formatNumber({format:"#,###", locale:"us"});     //.formatNumber({format:"#,###.00", locale:"us"})
                    visitsGA.html(result.visits_ga.units).formatNumber({format:"#,###", locale:"us"});
                    visitsGroups.html(result.visits_groups.units).formatNumber({format:"#,###", locale:"us"});
                    visitsMembers.html(result.visits_members.units).formatNumber({format:"#,###", locale:"us"});
                    visitsNonmembers.html(result.visits_nonmembers.units).formatNumber({format:"#,###", locale:"us"});
                    salesGate.html(result.sales_gate.units).formatNumber({format:"#,###", locale:"us"});
                    console.log(result);
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
//  {"visits_total":{"period":"2015-05-06","units":"2474”}}





