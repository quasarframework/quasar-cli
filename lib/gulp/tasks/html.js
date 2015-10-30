'use strict';

var
  gulp = require('gulp'),
  config = require('../gulp-config'),
  plugins = config.plugins
  ;

function compile(production) {
  return gulp.src(config.html.src, {base: config.base})
    .pipe(plugins.pipes.html.compile({
      prod: production
    }))
    .pipe(gulp.dest(config.html.dest));
}

gulp.task('dev:html', function() {
  return compile(false);
});

gulp.task('prod:html', function() {
  return compile(true);
});
