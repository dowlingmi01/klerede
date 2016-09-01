/******************************/
/******** DEPENDENCIES ********/
/******************************/
var elixir = require('laravel-elixir'),
    gulp = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    jshint = require('gulp-jshint'),
    react = require('gulp-react');


/************************/
/******** CONFIG ********/
/************************/
elixir.config.production = true;   // Adds minification (true)
elixir.config.sourcemaps = false;


/***********************/
/******** TASKS ********/
/***********************/

// GULP defaults ... 'gulp watch' will compile the less, minify, AND move it to the public folder
elixir(function(mix) {
    // Compile LESS, compile JS libraries, and compile custom JS
    mix.less('app.less')
        .task('libs')
        .task('app');
});

gulp.task('less', function () {
    elixir(function(mix){mix.less('app.less')});
});
// Lint JavaScript
gulp.task('lint', function() {
    /* Array for multiple directories */
    return gulp.src(['resources/js/app/*.js','!resources/js/report.js'])
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

// JavaScript Libraries
gulp.task('libs', function(){
    gulp.src([
            'resources/js/libs/jquery-2.1.4.js',
            'resources/js/libs/jquery-ui.min.js',
            'resources/js/libs/date.js',
            'resources/js/libs/jquery.datePicker.js',
            'resources/js/libs/react-0.13.3.js',
            //'resources/js/libs/JSXTransformer-0.13.3.js',   // Not needed now with the addition of gulp-react to pre-process the JSX
            'resources/js/libs/hashtable.js',
            'resources/js/libs/jquery.numberformatter-1.2.4.jsmin.js',
            'resources/js/libs/jquery.easing.1.3.js',
            'resources/js/libs/d3.min.js',
            'resources/js/libs/radialProgress.js',
            'resources/js/libs/bootstrap.js'
            //'resources/js/libs/es5-shim.min.js'   // Didn't help, so removing to save KB
        ])
        .pipe(concat('libs.js'))
        .pipe(uglify({mangle: false}))
        .pipe(gulp.dest('public/js'));
});

// Custom JavaScript
gulp.task('app', function(){
    gulp.src([
            'resources/js/app/global.js',
            'resources/js/app/app-utils.js',
            'resources/js/app/svg-icons.js',
            'resources/js/app/reusable-parts.js',
            'resources/js/app/header.js',
            'resources/js/app/reporting-on.js',
            'resources/js/app/visits-blocks.js',
            'resources/js/app/sales-goals.js',
            'resources/js/app/membership-goals.js',
            'resources/js/app/revenue2.js',
            'resources/js/app/attendance.js',
            'resources/js/app/members-blocks.js',
            'resources/js/app/goal-setting.js',
            'resources/js/app/login.js'
        ])
        .pipe(react())
        .pipe(concat('app.js'))
        .pipe(uglify({mangle: false}))
        .pipe(gulp.dest('public/js'));
});
