'use strict';

var
  gulp = require('gulp'),
  _ = require('lodash')
  ;

function reloadAfter(tasks) {
  return function() {
    gulp._.sequence(
      tasks,
      function() {
        gulp._.config.browser.reload();
      }
    );
  };
}

function run(task) {
  return function() {
    gulp._.sequence(task);
  };
}

function mapDeps(suffix, list) {
  return _.map(list, function(item) {
    return item + suffix;
  });
}

function watchForChanges(production) {
  var suffix = production ? 'prod' : 'dev';

  /*
   * Watch for build file configuration
   */
  gulp._.plugins.watch('quasar.build.yml', reloadAfter(suffix));

  /*
   * Watch for CSS
   */
  gulp._.plugins.watch(gulp._.config.css.watch, run('css:' + suffix));

  /*
   * Watch for JS
   */
  gulp._.plugins.watch(gulp._.config.js.watch, reloadAfter('js:' + suffix));
  gulp._.plugins.watch(gulp._.config.appManifest.watch, reloadAfter('manifest'));

  /*
   * Watch for some HTML
   */
  if (production) {
    gulp._.plugins.watch(gulp._.config.html.watch, reloadAfter('html:' + suffix));
  }

  /*
   * Watch for Assets
   */
  gulp._.plugins.watch(gulp._.config.assets.src, reloadAfter('assets:' + suffix));

  /*
   * Watch for Deps
   */
  gulp._.plugins.watch(
    mapDeps((production ? '.min' : '') + '.js', gulp._.config.deps.js.src),
    reloadAfter('js:deps:' + suffix)
  );
  gulp._.plugins.watch(
    mapDeps((production ? '.min' : '') + '.css', gulp._.config.deps.css.src),
    run('css:deps:' + suffix)
  );
}

function launchPreview(type, production) {
  /*
   * Initialize Server
   */
  var config = _.merge({}, gulp._.config[type], gulp._.config.app[type] || {});

  gulp._.config.browser.init(config, function() {
    watchForChanges(production);
  });
}

_.forEach(['dev', 'prod'], function(type) {
  var production = type === 'prod';

  gulp.task('monitor:' + type, [type], function() {
    watchForChanges(production);
  });
  gulp.task('preview:' + type, ['monitor:' + type], function() {
    launchPreview('preview', production);
  });
  gulp.task('responsive:' + type, ['monitor:' + type], function() {
    launchPreview('responsive', production);
  });

});
