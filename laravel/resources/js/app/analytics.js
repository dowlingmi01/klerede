module.exports = {
 	create: function(global_ga_id){


	    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
	    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
	    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
	    })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');


 		console.debug('GA initialized...');
 		ga('create', global_ga_id, 'auto');
 		 
 	},

    addView: function(veneu_id, user_id) {
        console.debug("Calling ga...");
        console.debug(arguments);
        if(arguments.length > 0){
        	console.debug("...with parameters.");
        	ga('set', {
		          'dimension1': veneu_id,
		          'dimension2': user_id
   			 });
        } 
        ga('send', 'pageview');
    },

    addEvent: function(category, action, label) {
        console.debug("Calling ga add events.");
        console.debug(arguments);
        ga('send', 'event', category, action, label);
    },
    
   
}; 