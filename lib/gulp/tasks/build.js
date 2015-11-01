'use strict';

var gulp = require('gulp');

gulp.task('build', function(done) {
  gulp._.sequence(
    'clean',
    ['dev:deps', 'dev:build'],
    done
  );
});

gulp.task('dev:build', function(done) {
  gulp._.sequence(
    ['dev:html',  'dev:css', 'dev:assets'],
    'dev:js',
    done
  );
});
