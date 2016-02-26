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

function compile(done, type, production) {
  var source = gulp._.config[type].src;

  var forceTheme = getForcedTheme();

  if (forceTheme && type === 'css') {
    console.log(' !!!', ('[WARNING] Building one theme only: << ' + forceTheme + ' >>').underline.red);
    source = source.concat(['!src/css/app.' + (forceTheme === 'mat' ? 'ios' : 'mat') + '.styl']);
  }

  var pipe = gulp.src(source, {base: gulp._.config.base})
    .pipe(gulp._.plugins.pipes[type].compile({
      prod: production,
      pack: gulp._.config.webpack,
      retainPath: type === 'js'
    }));

  if (type === 'js' && gulp._.config.bailOnError) {
    pipe.on('error', function() {
      done();
      process.exit(1);
    });
  }

  pipe.pipe(gulp.dest(gulp._.config[type].dest));

  if (type === 'css') {
    pipe.pipe(gulp._.config.browser.stream());
  }

  return pipe;
}

Object.keys(types).forEach(function(type) {
  var deps = types[type];

  gulp.task(type + ':lint', function() {
    return gulp.src(gulp._.config.lint[type])
      .pipe(gulp._.plugins.pipes[type].lint());
  });

  gulp.task(type + ':dev', deps, function(done) {
    return compile(done, type);
  });

  gulp.task(type + ':prod', deps, function(done) {
    return compile(done, type, true);
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

  var pipe = gulp.src(gulp._.config.html.src, {base: gulp._.config.base})
    .pipe(gulp._.plugins.replace('@@theme', forceTheme ? forceTheme : ''))
    .pipe(gulp._.plugins.replace('@@appManifest', computeAppManifest()));

  if (production) {
    pipe.pipe(gulp._.plugins.pipes.html.compile({prod: true}));
  }

  return pipe.pipe(gulp.dest(gulp._.config.html.dest));
}

['dev', 'prod'].forEach(function(type) {
  gulp.task('html:' + type, ['update:build-manifest'], function() {
    return compileHTML(type === 'prod');
  });
});
