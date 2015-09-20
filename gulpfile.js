'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var webpack = require('gulp-webpack');

gulp.task('webpack:dev', function() {
  return gulp.src('app/js/*.js')
    .pipe(webpack({
      output: {
        filename: 'bundle.js'
      }
    }))
    .pipe(gulp.dest('build/js/'));
});

gulp.task('sass', function() {
  gulp.src('app/sass/main.scss')
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(gulp.dest('build/css/'));
});

gulp.task('sass:watch', function() {
  gulp.watch('app/sass/*.scss', ['sass']);
});

gulp.task('copyIndex', function() {
  return gulp.src('app/*.html')
    .pipe(gulp.dest('build/'));
});

gulp.task('copyViews', function() {
  return gulp.src('app/views/*.html')
    .pipe(gulp.dest('build/views/'));
});

gulp.task('build', ['webpack:dev', 'copyIndex', 'copyViews', 'sass']);
gulp.task('default', ['build']);