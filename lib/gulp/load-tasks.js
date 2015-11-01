var
  gulp = require('gulp'),
  requireDir = require('require-dir')
  ;

gulp.q = {};
gulp.q.sequence = require('run-sequence');
gulp.q.config = require('./gulp-config');
gulp.q.plugins = require('gulp-load-plugins')();

requireDir('./tasks/', {recurse: true});

module.exports = gulp;
