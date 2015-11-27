'use strict';

var gulp = require('gulp');

function compile(production) {
  return gulp.src(gulp._.config.html.src, {base: gulp._.config.base})
    .pipe(gulp._.plugins.pipes.html.compile({
      prod: production
    }))
    .pipe(gulp.dest(gulp._.config.html.dest));
}

gulp.task('dev:html', function() {
  return compile(false);
});

gulp.task('prod:html', function() {
  return compile(true);
});
