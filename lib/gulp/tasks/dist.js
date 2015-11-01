'use strict';

var gulp = require('gulp');

gulp.task('dist', function(done) {
  gulp.q.sequence(
    ['clean', 'clean:dist'],
    ['prod:deps', 'prod:build'],
    'dist:finalize',
    done
  );
});

gulp.task('dist:finalize', function() {
  gulp.src(gulp.q.config.dist.src)
    .pipe(gulp.dest(gulp.q.config.dist.dest));
});

gulp.task('prod:build', function(done) {
  gulp.q.sequence(
    ['prod:html', 'prod:css', 'prod:assets'],
    'prod:js',
    done
  );
});
