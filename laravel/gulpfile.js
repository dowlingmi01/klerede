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

// GULP CLEAN: Clean temp files ... run as 'gulp clean' after exiting 'gulp watch' since 'gulp watch' leaves the temp files
gulp.task('clean', function () {
  del([
    'public/css/temp-less.css',
    'public/css/temp-sass.css',
    'public/js/temp-jquery.js',
    'public/js/temp-react.js',
    'public/js/temp-react-bootstrap.js'
  ]);
});

// GULP LINT: Check JS for errors (Not linting report)
gulp.task('lint', function() {
    /* Array for multiple directories */
    return gulp.src(['resources/js/*.js','!resources/js/report.js'])
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

// GULP
elixir(function(mix) {
    
    // Sergio's report task
    mix.browserify('report.js', elixir.jsOutput, 'resources/js', {debug:true});
    
    // MASTER STYLES PROCESSING ... 1) Compile LESS, 2) compile SASS, 3) combine (order of concatenation, destination, source), 4) remove temp files
    mix.less('app.less','public/css/temp-less.css')
        .sass('*','public/css/temp-sass.css')
        .styles(
            ['temp-less.css', 'temp-sass.css'],
            'public/css/app.css',
            'public/css'
        )
        .task('clean');

    // MASTER SCRIPTS PROCESSING ... 1) Set scripts in order of concatenation, 2) declare destination, 3) set source path for scripts
    mix.scripts(
        ['elixirtest.js', 'main.js'],
        'public/js/app.js',
        'resources/js'
    );

});

// GULP LIBS: Browserify npm packages for use on front-end
gulp.task('libs', function(){
    // JQUERY
    var b = browserify();
    b.require('jquery');
    b.bundle()
        .pipe(source('temp-jquery.js'))   // the output file is XYZ
        .pipe(gulp.dest('public/js')); // and is put into dist folder
    // REACT
    b = browserify();
    b.require('react');
    b.bundle()
        .pipe(source('temp-react.js'))   // the output file is XYZ
        .pipe(gulp.dest('public/js')); // and is put into this folder
    // BOOTSTRAP
    b = browserify();
    b.require('react-bootstrap');
    b.bundle()
        .pipe(source('temp-react-bootstrap.js'))   // the output file is XYZ
        .pipe(gulp.dest('public/js')); // and is put into dist folder
    // Concatenate and minify
    gulp.src(['public/js/temp-jquery.js','public/js/temp-react.js','public/js/temp-react-bootstrap.js'])
        .pipe(concat('libs.js'))
        .pipe(uglify({mangle: false}))
        .pipe(gulp.dest('public/js'));
});
