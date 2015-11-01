'use strict';

var gulp = require('gulp');

function compile(production) {
  return gulp.src(gulp.q.config.html.src, {base: gulp.q.config.base})
    .pipe(gulp.q.plugins.pipes.html.compile({
      prod: production
    }))
    .pipe(gulp.dest(gulp.q.config.html.dest));
}

gulp.task('dev:html', function() {
  return compile(false);
});

gulp.task('prod:html', function() {
  return compile(true);
});
