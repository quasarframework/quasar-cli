'use strict';

var gulp = require('gulp');

function compile(production) {
  return gulp.src(gulp._.config.assets.src, {base: gulp._.config.base})
    .pipe(gulp._.plugins.changed(gulp._.config.assets.dest))
    .pipe(gulp._.plugins.if(production, gulp._.plugins.pipes.image.optimize()))
    .pipe(gulp.dest(gulp._.config.assets.dest));
}

gulp.task('dev:assets', function() {
  return compile();
});
gulp.task('prod:assets', function() {
  return compile(true);
});
