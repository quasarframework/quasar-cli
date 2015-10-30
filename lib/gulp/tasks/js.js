'use strict';

var
  gulp = require('gulp'),
  config = require('../gulp-config'),
  plugins = config.plugins,
  runSequence = require('run-sequence'),
  del = require('del'),
  quasarPipes = require('../pipes/quasar-pipes')
  ;

gulp.task('js:lint', function() {
  return gulp.src(config.js.all)
    .pipe(plugins.pipes.js.lint());
});

function compile(production) {
  return gulp.src(config.js.tmp.src, {base: config.js.tmp.dest})
    .pipe(plugins.pipes.js.compile({
      prod: production,
      pack: config.webpack,
      retainPath: true
    }))
    .pipe(gulp.dest(config.js.dest));
}

function processJS(done, production) {
  runSequence(
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
  return gulp.src(config.js.src, {base: config.base})
    .pipe(gulp.dest(config.js.tmp.dest));
});

gulp.task('js:clean', function() {
  del.sync(config.js.tmp.dest);
});


gulp.task('js:manifest', function() {
  return gulp.src(config.js.tmp.pages, {base: config.js.tmp.dest})
    .pipe(quasarPipes.pageCompiler())
    .pipe(gulp.dest(config.js.tmp.dest));
});
