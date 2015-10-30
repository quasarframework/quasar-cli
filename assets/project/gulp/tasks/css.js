'use strict';

var
  gulp = require('gulp'),
  config = require('../gulp-config'),
  plugins = config.plugins
  ;

gulp.task('css:lint', function() {
  return gulp.src(config.css.all)
    .pipe(plugins.pipes.css.lint());
});

function compile(production) {
  return gulp.src(config.css.src, {base: config.base})
    .pipe(plugins.pipes.css.compile({
      prod: production
    }))
    .pipe(gulp.dest(config.css.dest))
    .pipe(config.browser.stream());
}

gulp.task('dev:css', ['css:lint'], function() {
  return compile(false);
});

gulp.task('prod:css', ['css:lint'], function() {
  return compile(true);
});
