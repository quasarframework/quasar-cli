'use strict';

var gulp = require('gulp');

/*
 * Development
 */

gulp.task('dev', function(done) {
  gulp._.sequence(
    ['dev:deps', 'dev:build'],
    'manifest',
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

/*
 * Production
 */

gulp.task('prod', function(done) {
  gulp._.sequence(
    'clean',
    ['prod:deps', 'prod:build'],
    'manifest',
    done
  );
});

gulp.task('prod:build', function(done) {
  gulp._.sequence(
    ['prod:html', 'prod:css', 'prod:assets'],
    'prod:js',
    done
  );
});
