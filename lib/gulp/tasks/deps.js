'use strict';

var
  gulp = require('gulp'),
  _ = require('lodash'),
  fs = require('fs')
  ;

function mapDependencies(options) {//production, list, suffix) {
  return _.map(options.list, function(item) {
    if (options.min && !fs.existsSync(item + '.min' + options.suffix)) {
      return item + '.' + options.suffix;
    }
    return item + (options.min ? '.min' : '') + options.suffix;
  });
}

function compile(production, type) {
  var userSpecific = gulp._.config.app.deps[type] || [];
  var src = mapDependencies({
    list: gulp._.config.deps[type].src.concat(userSpecific),
    production: production,
    suffix: '.' + type,
    min: production
  });

  return gulp.src(src)
    .pipe(gulp._.plugins.pipes[type].deps({
      prod: production,
      name: gulp._.config.deps.name
    }))
    .pipe(gulp.dest(gulp._.config.deps[type].dest))
    .pipe(gulp._.plugins.if(type === 'css', gulp._.config.browser.stream()));
}

/**
 * Scripts
 */

gulp.task('dev:js:deps', function() {
  return compile(false, 'js');
});

gulp.task('prod:js:deps', function() {
  return compile(true, 'js');
});

/**
 * Styles
 */

gulp.task('dev:css:deps', function() {
  return compile(false, 'css');
});

gulp.task('prod:css:deps', function() {
  return compile(true, 'css');
});

gulp.task('semantic:deps', function() {
  return gulp.src(gulp._.config.deps.semantic.src)
    .pipe(gulp._.plugins.newer(gulp._.config.deps.semantic.dest))
    .pipe(gulp.dest(gulp._.config.deps.semantic.dest));
});

/*
 * Main tasks
 */
gulp.task('dev:deps',  ['dev:js:deps',  'dev:css:deps', 'semantic:deps']);
gulp.task('prod:deps', ['prod:js:deps', 'prod:css:deps', 'semantic:deps']);
