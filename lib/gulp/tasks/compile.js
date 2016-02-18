'use strict';

var
  gulp = require('gulp'),
  manifest = require('../manifest')
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

Object.keys(types).forEach(function(type) {
  var deps = types[type];

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

/*
 * HTML
 */

function computeAppManifest() {
  return 'quasar.data.manifest = ' + manifest() + ';';
}

function compileHTML(production) {
  return gulp.src(gulp._.config.html.src, {base: gulp._.config.base})
    .pipe(gulp._.plugins.replace('@@appManifest', computeAppManifest()))
    .pipe(gulp._.plugins.if(production, gulp._.plugins.pipes.html.compile({prod: true})))
    .pipe(gulp.dest(gulp._.config.html.dest));
}

gulp.task('html:dev', function() {
  return compileHTML();
});
gulp.task('html:prod', function() {
  return compileHTML(true);
});
