exports.forceDigits = function (n, d) { //n:number, d:number -> string
    var s = n.toString();
    while (s.length < d) {
        s = "0"+s;
    }
    return s;
}


var formatAmount = exports.formatAmount = function(n, dec) {
    // return n;
    if(n===null || n===undefined || isNaN(n) || n===0) return "0";
    
    var sign = n<0 ? "-" : "";
    n = Math.abs(n);
    if ( n >= 1000) {
        //comma values, no decimals
        var s = n.toFixed(0);
        var r = "";
        for (var i = s.length - 1; i >= 0; i--) {
            r = s.charAt(i) + r;
            
            if ((s.length-i) % 3 === 0 && i>0 ) {
                r = ","+r;
            }
        };
        return sign+r;
    } else if (dec !== undefined) {
        //dec is defined
        
        return sign+n.toFixed(dec);
        
    } else if (n > 100) {
        //one decimal
        return sign+n.toFixed(1);
    } else {
        //2 decimals
        return sign+n.toFixed(2);
    }
}

exports.formatInteger = function(n){
    return formatAmount(n, 0);
}
