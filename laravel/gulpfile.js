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

// GULP defaults
elixir(function(mix) {
    // Sergio's report task
    mix.browserify('report.js', elixir.jsOutput, 'resources/js', {debug:true});
    // MASTER STYLES PROCESSING ... 1) Compile LESS, 2) compile SASS, 3) combine (order of concatenation, destination, source), 4) remove temp files
    mix.less('app.less','public/css/temp-less.css')
        .sass('*','public/css/temp-sass.css')
        .styles(
            ['temp-sass.css'],
            'public/css/app.css',
            'public/css'
        )
        .task('clean');
    // MASTER SCRIPTS PROCESSING ... 1) Set scripts in order of concatenation, 2) declare destination, 3) set source path for scripts
    mix.scripts(
        ['utils.js', 'dashboard.js'],
        'public/js/app.js',
        'resources/js/app'
    );
});

// Remove temp files
gulp.task('clean', function () {
  del([
    'public/css/temp-less.css',
    'public/css/temp-sass.css'
  ]);
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
