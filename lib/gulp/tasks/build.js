'use strict';

var gulp = require('gulp');

gulp.task('build', function(done) {
  gulp.q.sequence(
    'clean',
    ['dev:deps', 'dev:build'],
    done
  );
});

gulp.task('dev:build', function(done) {
  gulp.q.sequence(
    ['dev:html',  'dev:css', 'dev:assets'],
    'dev:js',
    done
  );
});
