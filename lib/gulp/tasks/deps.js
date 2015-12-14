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

function compile(type, production) {
  var userSpecific = gulp._.config.app.deps[type] || [];
  var src = mapDependencies({
    list: gulp._.config.deps[type].src.concat(userSpecific),
    production: production,
    suffix: '.' + type,
    min: production
  });

  return gulp.src(src)
    .pipe(gulp._.plugins.newer(gulp._.config.deps[type].dest + '/' + gulp._.config.deps.name + '.' + type))
    .pipe(gulp._.plugins.pipes[type].deps({
      prod: type !== 'css' && production,
      name: gulp._.config.deps.name
    }))
    .pipe(gulp.dest(gulp._.config.deps[type].dest))
    .pipe(gulp._.plugins.if(type === 'css', gulp._.config.browser.stream()));
}


_.forEach(['js', 'css'], function(type) {
  gulp.task('dev:' + type + ':deps', function() {
    return compile(type);
  });

  gulp.task('prod:' + type + ':deps', function() {
    return compile(type, true);
  });
});

/*
 * Main tasks
 */
gulp.task('dev:deps',  ['dev:js:deps',  'dev:css:deps']);
gulp.task('prod:deps', ['prod:js:deps', 'prod:css:deps']);
