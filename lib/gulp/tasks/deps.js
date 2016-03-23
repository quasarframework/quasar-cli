'use strict';

var
  gulp = require('gulp'),
  fs = require('fs')
  ;

function mapDependencies(list, production, suffix, min) {
  return list.map(function(item) {
    if (min && !fs.existsSync(item + '.min' + suffix)) {
      return item + '.' + suffix;
    }
    return item + (min ? '.min' : '') + suffix;
  });
}

function compile(type, production) {
  var userSpecific = gulp._.config.app.deps[type] || [];
  var src = mapDependencies(
    gulp._.config.deps[type].src.concat(userSpecific),
    production,
    '.' + type,
    production
  );

  var pipe = gulp.src(src)
    .pipe(gulp._.plugins.newer(gulp._.config.deps[type].dest + '/' + gulp._.config.deps.name + '.' + type))
    .pipe(gulp._.plugins.pipes[type].deps({
      prod: production,
      name: gulp._.config.deps.name
    }))
    .pipe(gulp.dest(gulp._.config.deps[type].dest));

  if (type === 'css') {
    pipe.pipe(gulp._.config.browser.stream());
  }

  return pipe;
}


['js'/*, 'css'*/].forEach(function(type) {
  gulp.task(type + ':deps:dev', ['update:build-manifest'], function() {
    return compile(type);
  });

  gulp.task(type + ':deps:prod', ['update:build-manifest'], function() {
    return compile(type, true);
  });
});

/*
 * Main tasks
 */
gulp.task('deps:dev',  ['js:deps:dev'/*,  'css:deps:dev'*/]);
gulp.task('deps:prod', ['js:deps:prod'/*, 'css:deps:prod'*/]);
