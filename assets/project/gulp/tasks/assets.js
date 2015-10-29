'use strict';

var
  gulp = require('gulp'),
  config = require('../gulp-config'),
  plugins = config.plugins
  ;

function compile(production) {
  return gulp.src(config.assets.src, {base: config.base})
    .pipe(gulp.dest(config.assets.dest));
}

gulp.task('dev:assets', function() {
  return compile(false);
});

gulp.task('prod:assets', function() {
  return compile(true);
});
