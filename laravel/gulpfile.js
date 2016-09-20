var elixir = require('laravel-elixir');

elixir.config.production = true;   // Adds minification (true)
elixir.config.sourcemaps = false;



elixir(function(mix) {
    mix.less('app.less', './public/css/app.css')
        .less('new.less', './public/css/new.css')
        .babel([
                './resources/js/libs/jquery-2.1.4.js',
                './resources/js/libs/jquery-ui.min.js',
                './resources/js/libs/date.js',
                './resources/js/libs/jquery.datePicker.js',
                './resources/js/libs/react-0.13.3.js',
                './resources/js/libs/hashtable.js',
                './resources/js/libs/jquery.numberformatter-1.2.4.jsmin.js',
                './resources/js/libs/jquery.easing.1.3.js',
            //  './resources/js/libs/d3.min.js',
                './resources/js/libs/radialProgress.js',
                './resources/js/libs/bootstrap.js',
            ], 
            './public/js/libs.js')
        .babel([
            './resources/js/app/global.js',
            './resources/js/app/app-utils.js',
            './resources/js/app/svg-icons.js',
            './resources/js/app/reusable-parts.js',
            './resources/js/app/header.js',
            './resources/js/app/reporting-on.js',
            './resources/js/app/visits-blocks.js',
            './resources/js/app/sales-goals.js',
            './resources/js/app/membership-goals.js',
            './resources/js/app/revenue2.js',
            './resources/js/app/attendance.js',
            './resources/js/app/members-blocks.js',
            './resources/js/app/goal-setting.js',
            './resources/js/app/login.js'
            ], 
            './public/js/app.js');
            
});
