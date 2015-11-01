'use strict';

var gulp = require('gulp');

gulp.task('css:lint', function() {
  return gulp.src(gulp.q.config.css.all)
    .pipe(gulp.q.plugins.pipes.css.lint());
});

function compile(production) {
  return gulp.src(gulp.q.config.css.src, {base: gulp.q.config.base})
    .pipe(gulp.q.plugins.pipes.css.compile({
      prod: production
    }))
    .pipe(gulp.dest(gulp.q.config.css.dest))
    .pipe(gulp.q.config.browser.stream());
}

gulp.task('dev:css', ['css:lint'], function() {
  return compile(false);
});

gulp.task('prod:css', ['css:lint'], function() {
  return compile(true);
});
