'use strict';

var
  gulp = require('gulp'),
  config = require('../gulp-config'),
  runSequence = require('run-sequence'),
  del = require('del')
  ;

gulp.task('clean', function() {
  del.sync(config.clean);
});

gulp.task('build', function(done) {
  runSequence(
    'clean',
    ['dev:deps', 'dev:build'],
    done
  );
});

gulp.task('dist', function(done) {
  runSequence(
    'clean',
    ['prod:deps', 'prod:build'],
    'dist:clean',
    'dist:copy',
    done
  );
});


/**
* Helpers
*/
gulp.task('dev:build',  function(done) {
  runSequence(
    ['dev:pages', 'dev:html',  'dev:css'/*, 'dev:js'*/],
    'dev:js',
    done
  );
});
gulp.task('prod:build', ['prod:pages', 'prod:html', 'prod:css', 'prod:js']);
