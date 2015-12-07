'use strict';

var gulp = require('gulp');

function compile(type, production) {
  return gulp.src(gulp._.config[type].src, {base: gulp._.config.base})
    .pipe(gulp._.plugins.pipes[type].compile({
      prod: production
    }))
    .pipe(gulp.dest(gulp._.config[type].dest))
    .pipe(gulp._.plugins.if(type === 'css', gulp._.config.browser.stream()));
}

/*
 * CSS
 */

gulp.task('dev:css', ['css:lint'], function() {
  return compile('css');
});

gulp.task('prod:css', ['css:lint'], function() {
  return compile('css', true);
});

/*
 * HTML
 */

gulp.task('dev:html', function() {
  return compile('html');
});

gulp.task('prod:html', function() {
  return compile('html', true);
});
