'use strict';

var gulp = require('gulp');

gulp.task('css:lint', function() {
  return gulp.src(gulp._.config.css.all)
    .pipe(gulp._.plugins.pipes.css.lint());
});

function compile(production) {
  return gulp.src(gulp._.config.css.src, {base: gulp._.config.base})
    .pipe(gulp._.plugins.pipes.css.compile({
      prod: production
    }))
    .pipe(gulp.dest(gulp._.config.css.dest))
    .pipe(gulp._.config.browser.stream());
}

gulp.task('dev:css', ['css:lint'], function() {
  return compile(false);
});

gulp.task('prod:css', ['css:lint'], function() {
  return compile(true);
});
