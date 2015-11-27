'use strict';

var
  gulp = require('gulp'),
  del = require('del')
  ;

gulp.task('dev', function(done) {
  gulp._.sequence(
    ['dev:deps', 'dev:html',  'dev:css', 'dev:assets'],
    'dev:js',
    'manifest',
    done
  );
});

gulp.task('prod', function(done) {
  gulp._.sequence(
    'clean',
    ['prod:deps', 'prod:html', 'prod:css', 'prod:assets'],
    'prod:js',
    'manifest',
    done
  );
});

gulp.task('clean', function() {
  del.sync(gulp._.config.clean);
});
