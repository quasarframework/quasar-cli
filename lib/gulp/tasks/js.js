'use strict';

var
  gulp = require('gulp'),
  del = require('del'),
  quasarPipes = require('../pipes/quasar-pipes')
  ;

gulp.task('js:lint', function() {
  return gulp.src(gulp._.config.js.all)
    .pipe(gulp._.plugins.pipes.js.lint());
});

function compile(production) {
  return gulp.src(gulp._.config.js.tmp.src, {base: gulp._.config.js.tmp.dest})
    .pipe(gulp._.plugins.pipes.js.compile({
      prod: production,
      pack: gulp._.config.webpack,
      retainPath: true
    }))
    .pipe(gulp.dest(gulp._.config.js.dest));
}

function processJS(done, production) {
  gulp._.sequence(
    ['js:lint', 'js:copy'],
    'js:manifest',
    'js:compile:' + (production ? 'prod' : 'dev'),
    'js:clean',
    done
  );
}

gulp.task('dev:js', function(done) {
  processJS(done);
});

gulp.task('prod:js', function(done) {
  processJS(done, true);
});

gulp.task('js:compile:dev', function() {
  return compile();
});
gulp.task('js:compile:prod', function() {
  return compile(true);
});

gulp.task('js:copy', function() {
  return gulp.src(gulp._.config.js.src, {base: gulp._.config.base})
    .pipe(gulp.dest(gulp._.config.js.tmp.dest));
});

gulp.task('js:clean', function() {
  del.sync(gulp._.config.js.tmp.dest);
});


gulp.task('js:manifest', function() {
  return gulp.src(gulp._.config.js.tmp.pages, {base: gulp._.config.js.tmp.dest})
    .pipe(quasarPipes.pageCompiler())
    .pipe(gulp.dest(gulp._.config.js.tmp.dest));
});
