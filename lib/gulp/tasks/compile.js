'use strict';

var
  gulp = require('gulp'),
  _ = require('lodash')
  ;

var types = {
  'js': ['js:lint'],
  'css': ['css:lint']
};

function compile(type, production) {
  return gulp.src(gulp._.config[type].src, {base: gulp._.config.base})
    .pipe(gulp._.plugins.pipes[type].compile({
      prod: production,
      pack: gulp._.config.webpack,
      retainPath: type === 'js'
    }))
    .pipe(gulp.dest(gulp._.config[type].dest))
    .pipe(gulp._.plugins.if(type === 'css', gulp._.config.browser.stream()));
}

gulp.task('html:dev', function() {
  return gulp.src(gulp._.config.html.src, {base: gulp._.config.base})
    .pipe(gulp.dest(gulp._.config.html.dest));
});
gulp.task('html:prod', function() {
  return compile('html', true);
});

_.forEach(types, function(deps, type) {
  gulp.task(type + ':lint', function() {
    return gulp.src(gulp._.config.lint[type])
      .pipe(gulp._.plugins.pipes[type].lint());
  });

  gulp.task(type + ':dev', deps, function() {
    return compile(type);
  });

  gulp.task(type + ':prod', deps, function() {
    return compile(type, true);
  });
});
