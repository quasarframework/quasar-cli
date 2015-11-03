'use strict';

var gulp = require('gulp');

function compile() {
  return gulp.src(gulp._.config.assets.src, {base: gulp._.config.base})
    .pipe(gulp.dest(gulp._.config.assets.dest));
}

gulp.task('dev:assets', compile);
gulp.task('prod:assets', compile);
