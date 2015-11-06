'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var reactify = require('reactify');
var uglify = require('gulp-uglify');

// gulp.task('browserify', function() {
//   var b = browserify();
//   b.transform(reactify);
//   b.add('./app/js/app.js');
//   b.add('./app/js/app_index.jsx');
//   b.add('./app/js/app_chatroom.jsx');
//   return b.bundle()
//     .pipe(source('bundle.js'))
//     .pipe(buffer())
//     .pipe(uglify())
//     .pipe(gulp.dest('./build/js/'));
// });

gulp.task('browserify_index', function() {
  var b = browserify();
  b.transform(reactify);
  b.add('./app/js/app_index.js');
  b.add('./app/js/app_index.jsx');
  return b.bundle()
    .pipe(source('bundle_index.js'))
    .pipe(buffer())
    .pipe(uglify())
    .pipe(gulp.dest('./build/js/'));
});

gulp.task('browserify_chatroom', function() {
  var b = browserify();
  b.transform(reactify);
  b.add('./app/js/app_chatroom.jsx');
  b.add('./app/js/app_chatroom.js');
  return b.bundle()
    .pipe(source('bundle_chatroom.js'))
    // .pipe(buffer())
    // .pipe(uglify())
    .pipe(gulp.dest('./build/js/'));
});

gulp.task('sass', function() {
  gulp.src('app/sass/main.scss')
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(gulp.dest('build/css/'));
});

gulp.task('sass:watch', function() {
  gulp.watch('app/sass/*.scss', ['sass']);
});


gulp.task('build', ['browserify_index', 'browserify_chatroom', 'sass']);
gulp.task('default', ['build']);