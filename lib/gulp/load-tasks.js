var
  gulp = require('gulp'),
  requireDir = require('require-dir')
  ;

gulp._ = {};
gulp._.sequence = require('run-sequence');
gulp._.config = require('./gulp-config');
gulp._.plugins = require('gulp-load-plugins')();

requireDir('./tasks/', {recurse: true});

module.exports = gulp;
