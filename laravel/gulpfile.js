/******************************/
/******** DEPENDENCIES ********/
/******************************/
var elixir = require('laravel-elixir'),
    gulp = require('gulp'),
    del = require('del'),
    jshint = require('gulp-jshint');


/************************/
/******** CONFIG ********/
/************************/
elixir.config.production = true;   // Adds minification (true)
elixir.config.sourcemaps = false;


/***********************/
/******** TASKS ********/
/***********************/

// Clean temp files ... run as 'gulp clean' after exiting 'gulp watch' since 'gulp watch' leaves the temp files
gulp.task('clean', function () {
  del([
    'public/css/compiledless.css',
    'public/css/compiledsass.css'
  ]);
});

// Check JS for errors (Not linting report)
gulp.task('lint', function() {
    /* Array for multiple directories */
    return gulp.src(['resources/js/*.js','!resources/js/report.js'])
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

elixir(function(mix) {
    
    // Sergio's report task
    mix.browserify('report.js', elixir.jsOutput, 'resources/js', {debug:true});
    
    // MASTER STYLES PROCESSING ... 1) Compile LESS, 2) compile SASS, 3) combine (order of concatenation, destination, source), 4) remove temp files
    mix.less('app.less','public/css/compiledless.css')
        .sass('*','public/css/compiledsass.css')
        .styles(
            ['compiledless.css', 'compiledsass.css'],
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
