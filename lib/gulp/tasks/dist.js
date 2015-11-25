'use strict';

var gulp = require('gulp');

gulp.task('dist', function(done) {
  gulp._.sequence(
    'clean:all',
    ['prod:deps', 'prod:build'],
    'manifest',
    'dist:finalize',
    done
  );
});

gulp.task('dist:finalize', function() {
  gulp.src(gulp._.config.dist.src)
    .pipe(gulp.dest(gulp._.config.dist.dest));
});

gulp.task('prod:build', function(done) {
  gulp._.sequence(
    ['prod:html', 'prod:css', 'prod:assets'],
    'prod:js',
    done
  );
});
