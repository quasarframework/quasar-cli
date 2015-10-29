'use strict';

var
  gulp = require('gulp'),
  config = require('../gulp-config'),
  runSequence = require('run-sequence')
  ;

gulp.task('build', function(done) {
  runSequence(
    'clean',
    ['dev:deps', 'dev:build'],
    done
  );
});

gulp.task('dev:build', ['dev:js', 'dev:html',  'dev:css', 'dev:assets']);
