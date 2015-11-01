'use strict';

var gulp = require('gulp');

/**
 * Scripts
 */

function compileJs(production) {
  return gulp.src(gulp._.config.deps.js.src)
    .pipe(gulp._.plugins.pipes.js.deps({
      prod: production,
      name: gulp._.config.deps.name
    }))
    .pipe(gulp.dest(gulp._.config.deps.js.dest));
}

gulp.task('dev:js:deps', function() {
  return compileJs(false);
});

gulp.task('prod:js:deps', function() {
  return compileJs(true);
});


/**
 * Styles
 */

function compileCss(production) {
  return gulp.src(gulp._.config.deps.css.src)
    .pipe(gulp._.plugins.pipes.css.deps({
      prod: production,
      name: gulp._.config.deps.name
    }))
    .pipe(gulp.dest(gulp._.config.deps.css.dest))
    .pipe(gulp._.config.browser.stream());
}

gulp.task('dev:css:deps', function() {
  return compileCss(false);
});

gulp.task('prod:css:deps', function() {
  return compileCss(true);
});


/*
 * Main tasks
 */
gulp.task('dev:deps',  ['dev:js:deps',  'dev:css:deps']);
gulp.task('prod:deps', ['prod:js:deps', 'prod:css:deps']);
