'use strict';

var
  gulp = require('gulp'),
  config = require('../gulp-config'),
  named = require('vinyl-named'),
  plugins = config.plugins
  ;

gulp.task('js:lint', function() {
  return gulp.src(config.js.watch)
    .pipe(plugins.eslint())
    .pipe(plugins.eslint.format());
});

gulp.task('dev:js', ['js:lint'], function() {
  return gulp.src(config.js.entry)
    .pipe(named())
    .pipe(plugins.webpack(config.webpack.dev))
    .pipe(gulp.dest(config.js.dest));
});

gulp.task('prod:js', ['js:lint'], function() {
  return gulp.src(config.js.entry)
    .pipe(named())
    .pipe(plugins.webpack(config.webpack.prod))
    .pipe(plugins.uglify())
    .pipe(gulp.dest(config.js.dest));
});
