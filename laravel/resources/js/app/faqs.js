var $ = require('jquery');

if(document.getElementById('faqs-js')){
    var titleSelector=".topics > div > ul > li .svgcaret, .topics > div > ul > li .faq-title";
    $(titleSelector).on(
        "click", 
        function (event) {
            $(event.currentTarget).parent().toggleClass("active")
        }
    );
}