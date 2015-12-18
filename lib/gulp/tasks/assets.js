'use strict';

var gulp = require('gulp');

function compile(production) {
  return gulp.src(gulp._.config.assets.src, {base: gulp._.config.base})
    .pipe(gulp._.plugins.changed(gulp._.config.assets.dest))
    .pipe(gulp._.plugins.if(production, gulp._.plugins.pipes.image.optimize()))
    .pipe(gulp.dest(gulp._.config.assets.dest));
}

gulp.task('assets:dev', function() {
  return compile();
});
gulp.task('assets:prod', function() {
  return compile(true);
});

gulp.task('app-additions', function() {
  return gulp.src(gulp._.config.appAdditions.src, {base: gulp._.config.appAdditions.base})
    .pipe(gulp._.plugins.changed(gulp._.config.appAdditions.dest))
    .pipe(gulp.dest(gulp._.config.appAdditions.dest));
});
