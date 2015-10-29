'use strict';

var
  gulp = require('gulp'),
  config = require('../gulp-config'),
  plugins = config.plugins
  ;

gulp.task('js:lint', function() {
  return gulp.src(config.js.all)
    .pipe(plugins.pipes.js.lint());
});

function compile(production) {
  return gulp.src(config.js.src, {base: config.base})
    .pipe(plugins.pipes.js.compile({
      prod: production,
      pack: config.webpack,
      retain: 'path'
    }))
    .pipe(gulp.dest(config.js.dest));
}
gulp.task('dev:js', ['js:lint'], function() {
  return compile(false);
});

gulp.task('prod:js', ['js:lint'], function() {
  return compile(true);
});
