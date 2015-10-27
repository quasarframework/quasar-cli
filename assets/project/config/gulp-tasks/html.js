'use strict';

var
  gulp = require('gulp'),
  config = require('../gulp-config'),
  plugins = config.plugins
  ;

gulp.task('html:lint', function() {
  return gulp.src(config.html.watch)
    .pipe(plugins.html5Lint());
});

gulp.task('dev:html', ['html:lint'], function() {
  return gulp.src(config.html.watch)
    .pipe(gulp.dest(config.html.dest));
});

gulp.task('prod:html', ['html:lint'], function() {
  return gulp.src(config.html.watch)
    .pipe(plugins.htmlmin(config.html.settings))
    .pipe(gulp.dest(config.html.dest));
});
