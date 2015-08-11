'use strict';

var gulp = require('gulp');
var webpack = require('gulp-webpack');

gulp.task('webpack:dev', function() {
  return gulp.src('app/js/client.js')
    .pipe(webpack({
      output: {
        filename: 'bundle.js'
      }
    }))
    .pipe(gulp.dest('build/'));
});

gulp.task('copyHTML', function() {
  return gulp.src('app/**/*.html')
    .pipe(gulp.dest('build/'));
});

gulp.task('copyCSS', function() {
  return gulp.src('app/**/*.css')
    .pipe(gulp.dest('build/'));
});

gulp.task('copyIMG', function() {
  return gulp.src('app/**/*.ico')
    .pipe(gulp.dest('build/'));
});

gulp.task('build', ['webpack:dev', 'copyHTML', 'copyCSS', 'copyIMG']);
gulp.task('default', ['build']);