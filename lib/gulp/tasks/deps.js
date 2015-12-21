'use strict';

var
  gulp = require('gulp'),
  _ = require('lodash'),
  fs = require('fs')
  ;

function mapDependencies(options) {
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
      prod: production,
      name: gulp._.config.deps.name
    }))
    .pipe(gulp.dest(gulp._.config.deps[type].dest))
    .pipe(gulp._.plugins.if(type === 'css', gulp._.config.browser.stream()));
}


_.forEach(['js', 'css'], function(type) {
  gulp.task(type + ':deps:dev', function() {
    return compile(type);
  });

  gulp.task(type + ':deps:prod', function() {
    return compile(type, true);
  });
});

/*
 * Main tasks
 */
gulp.task('deps:dev',  ['js:deps:dev',  'css:deps:dev']);
gulp.task('deps:prod', ['js:deps:prod', 'css:deps:prod']);
