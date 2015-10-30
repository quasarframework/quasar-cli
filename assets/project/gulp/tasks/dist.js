'use strict';

var
  gulp = require('gulp'),
  config = require('../gulp-config'),
  runSequence = require('run-sequence')
  ;

gulp.task('dist', function(done) {
  runSequence(
    ['clean', 'clean:dist'],
    ['prod:deps', 'prod:build'],
    'dist:finalize',
    done
  );
});

gulp.task('dist:finalize', function() {
  gulp.src(config.dist.src)
    .pipe(gulp.dest(config.dist.dest));
});

gulp.task('prod:build', function(done) {
  runSequence(
    ['prod:html', 'prod:css', 'prod:assets'],
    'prod:js',
    done
  );
});
