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
