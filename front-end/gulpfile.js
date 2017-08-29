
var gulp = require('gulp');
var watchify = require('watchify');
var browserify = require('browserify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
// New Plugin
var sourcemaps = require('gulp-sourcemaps');
var notify = require('gulp-notify');
var util = require('gulp-util');
var uglify = require('gulp-uglify');
var assign = require('lodash.assign');

var customOpts = {
  entries: ['./scripts/main.js'],
  debug: true
};
var opts = assign({}, watchify.args, customOpts);
var b = watchify(browserify(opts).transform(babelify , {presets: ["es2015", "react"]})); 

b.on('update', bundle); // on any dep update, runs the bundler
b.on('log', util.log);

gulp.task('run' , bundle);

function bundle() {
  return b.bundle()
    //.transform(babelify , {presets: ["es2015", "react"]})
    //.bundle()
    .on('error' , function(e) {
      console.log(e.message);

      this.emit('end');
    })
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(sourcemaps.write('./'))
      // .pipe(uglify())
    .pipe(gulp.dest('./build'));
}


// gulp.task('watch' , ['browserify'],  function() {
//   gulp.watch('./scripts/**/*.js' , ['browserify']);
// });
