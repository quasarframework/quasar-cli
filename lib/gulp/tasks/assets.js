'use strict';

var gulp = require('gulp');

function compile(production) {
  return gulp.src(gulp._.config.assets.src, {base: gulp._.config.base})
    .pipe(gulp.dest(gulp._.config.assets.dest));
}

gulp.task('dev:assets', function() {
  return compile(false);
});

gulp.task('prod:assets', function() {
  return compile(true);
});
