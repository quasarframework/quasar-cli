'use strict';

var gulp = require('gulp');

function compile(production) {
  return gulp.src(gulp.q.config.assets.src, {base: gulp.q.config.base})
    .pipe(gulp.dest(gulp.q.config.assets.dest));
}

gulp.task('dev:assets', function() {
  return compile(false);
});

gulp.task('prod:assets', function() {
  return compile(true);
});
