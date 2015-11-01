'use strict';

var
  gulp = require('gulp'),
  del = require('del')
  ;

gulp.task('clean', function() {
  del.sync(gulp.q.config.clean);
});

gulp.task('clean:dist', function() {
  del.sync(gulp.q.config.dist.dest);
});

gulp.task('clean:all', ['clean', 'clean:dist']);
