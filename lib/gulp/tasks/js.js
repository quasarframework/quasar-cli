'use strict';

var
  gulp = require('gulp'),
  del = require('del'),
  quasarPipes = require('../pipes/quasar-pipes')
  ;

gulp.task('js:lint', function() {
  return gulp.src(gulp.q.config.js.all)
    .pipe(gulp.q.plugins.pipes.js.lint());
});

function compile(production) {
  return gulp.src(gulp.q.config.js.tmp.src, {base: gulp.q.config.js.tmp.dest})
    .pipe(gulp.q.plugins.pipes.js.compile({
      prod: production,
      pack: gulp.q.config.webpack,
      retainPath: true
    }))
    .pipe(gulp.dest(gulp.q.config.js.dest));
}

function processJS(done, production) {
  gulp.q.sequence(
    ['js:lint', 'js:copy'],
    'js:manifest',
    'js:compile:' + (production ? 'prod' : 'dev'),
    'js:clean',
    done
  );
}

gulp.task('dev:js', function(done) {
  processJS(done, false);
});

gulp.task('prod:js', function(done) {
  processJS(done, true);
});

gulp.task('js:compile:dev', function() {
  return compile(false);
});
gulp.task('js:compile:prod', function() {
  return compile(true);
});

gulp.task('js:copy', function() {
  return gulp.src(gulp.q.config.js.src, {base: gulp.q.config.base})
    .pipe(gulp.dest(gulp.q.config.js.tmp.dest));
});

gulp.task('js:clean', function() {
  del.sync(gulp.q.config.js.tmp.dest);
});


gulp.task('js:manifest', function() {
  return gulp.src(gulp.q.config.js.tmp.pages, {base: gulp.q.config.js.tmp.dest})
    .pipe(quasarPipes.pageCompiler())
    .pipe(gulp.dest(gulp.q.config.js.tmp.dest));
});
