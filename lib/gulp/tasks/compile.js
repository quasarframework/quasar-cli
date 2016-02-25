'use strict';

var
  gulp = require('gulp'),
  manifest = require('../manifest')
  ;

var types = {
  'js': ['js:lint'],
  'css': ['css:lint', 'update:build-manifest']
};

function getForcedTheme() {
  return gulp._.config.app.forceTheme;
}

function compile(type, production) {
  var source = gulp._.config[type].src;

  var forceTheme = getForcedTheme();

  if (forceTheme && type === 'css') {
    console.log(' !!!', ('[WARNING] Building one theme only: << ' + forceTheme + ' >>').underline.red);
    source = source.concat(['!src/css/app.' + (forceTheme === 'mat' ? 'ios' : 'mat') + '.styl']);
  }

  return gulp.src(source, {base: gulp._.config.base})
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
  var forceTheme = getForcedTheme();

  return gulp.src(gulp._.config.html.src, {base: gulp._.config.base})
    .pipe(gulp._.plugins.replace('@@theme', forceTheme ? forceTheme : ''))
    .pipe(gulp._.plugins.replace('@@appManifest', computeAppManifest()))
    .pipe(gulp._.plugins.if(production, gulp._.plugins.pipes.html.compile({prod: true})))
    .pipe(gulp.dest(gulp._.config.html.dest));
}

['dev', 'prod'].forEach(function(type) {
  gulp.task('html:dev', ['update:build-manifest'], function() {
    return compileHTML(type === 'prod');
  });
});
