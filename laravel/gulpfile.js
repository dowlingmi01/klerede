var elixir = require('laravel-elixir');

elixir.config.production = false;   // Adds minification (true)
elixir.config.sourcemaps = false;



elixir(function(mix) {
    mix.less('app.less', './public/css/app.css')
        .less('new.less', './public/css/new.css')
        .browserify([
                './resources/js/app/analytics.js',
                './resources/js/app/global.js',
                './resources/js/app/header.js',
                './resources/js/app/reporting-on.js',
                './resources/js/app/visits-blocks.js',
                './resources/js/app/sales-goals.js',
                './resources/js/app/membership-goals.js',
                './resources/js/app/revenue2.js',
                './resources/js/app/attendance.js',
                './resources/js/app/members-blocks.js',
                './resources/js/app/goal-setting.js',
                './resources/js/app/footer-copyright.js',
                './resources/js/app/login.js',
                './resources/js/app/load-user.js',
                './resources/js/app/faqs.js'
                ], 
            './public/js/app.js')
            .browserify([
            './resources/js/app/trackna.js',
            ], 
            './public/js/appna.js');
            
});
