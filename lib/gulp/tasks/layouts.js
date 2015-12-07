'use strict';

var gulp = require('gulp');

function compile(production) {
  return gulp.src(gulp._.config.layouts.src)
    .pipe(gulp._.plugins.pipes.js.compile({
      prod: production,
      pack: gulp._.config.webpack
    }))
    .pipe(gulp.dest(gulp._.config.layouts.dest));
}

gulp.task('dev:layouts', function() {
  return compile();
});

gulp.task('prod:layouts', function() {
  return compile(true);
});
