'use strict';

var gulp = require('gulp');

function compile(production, type) {
  var stream = gulp.src(gulp._.config.deps[type].src)
    .pipe(gulp._.plugins.pipes[type].deps({
      prod: production,
      name: gulp._.config.deps.name
    }))
    .pipe(gulp.dest(gulp._.config.deps[type].dest));

  if (type == 'css') {
    stream = stream.pipe(gulp._.config.browser.stream());
  }

  return stream;
}

/**
 * Scripts
 */

gulp.task('dev:js:deps', function() {
  return compile(false, 'js');
});

gulp.task('prod:js:deps', function() {
  return compile(true, 'js');
});

/**
 * Styles
 */

gulp.task('dev:css:deps', function() {
  return compile(false, 'css');
});

gulp.task('prod:css:deps', function() {
  return compile(true, 'css');
});

/*
 * Main tasks
 */
gulp.task('dev:deps',  ['dev:js:deps',  'dev:css:deps']);
gulp.task('prod:deps', ['prod:js:deps', 'prod:css:deps']);
