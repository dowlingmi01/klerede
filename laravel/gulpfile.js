/******************************/
/******** DEPENDENCIES ********/
/******************************/
var elixir = require('laravel-elixir'),
    gulp = require('gulp'),
    del = require('del'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    jshint = require('gulp-jshint'),
    browserify = require('browserify'),
    source = require("vinyl-source-stream");


/************************/
/******** CONFIG ********/
/************************/
elixir.config.production = true;   // Adds minification (true)
elixir.config.sourcemaps = false;


/***********************/
/******** TASKS ********/
/***********************/

// GULP defaults ... 'gulp watch' will compile the scss, minify, AND move it to the public folder
elixir(function(mix) {
    // Sergio's report task
    mix.browserify('report.js', elixir.jsOutput, 'resources/js', {debug:true});
    // Compile LESS, compile SASS, compile JS libraries, and compile custom JS
    mix.less('app.less','public/css')
        .sass('dashboard.scss','public/css/dashboard')
        .task('libs')
        .task('app');
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
            'resources/js/libs/react-0.13.3.js',
            'resources/js/libs/JSXTransformer-0.13.3.js',
            'resources/js/libs/bootstrap.js'
        ])
        .pipe(concat('libs.js'))
        .pipe(uglify({mangle: false}))
        .pipe(gulp.dest('public/js'));
});

// Custom JavaScript
gulp.task('app', function(){
    gulp.src([
            'resources/js/app/utils.js',
            'resources/js/app/dashboard.js'
        ])
        .pipe(concat('app.js'))
        .pipe(uglify({mangle: false}))
        .pipe(gulp.dest('public/js'));
});
