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

function watchForChanges() {
  /*
   * Watch for build file configuration
   */
  gulp._.plugins.watch('quasar.build.yml', reloadAfter('dev'));

  /*
   * Watch for CSS
   */
  gulp._.plugins.watch(gulp._.config.css.watch, run('dev:css'));

  /*
   * Watch for JS
   */
  gulp._.plugins.watch(gulp._.config.js.watch, reloadAfter('dev:js'));
  gulp._.plugins.watch(gulp._.config.appManifest.watch, reloadAfter('manifest'));

  /*
   * Watch for Assets
   */
  gulp._.plugins.watch(gulp._.config.assets.src, reloadAfter('dev:assets'));

  /*
   * Watch for Deps
   */
  gulp._.plugins.watch(mapDeps('.js', gulp._.config.deps.js.src), reloadAfter('dev:js:deps'));
  gulp._.plugins.watch(mapDeps('.css', gulp._.config.deps.css.src), run('dev:css:deps'));
}

gulp.task('monitor', ['dev'], watchForChanges);


function launchPreview(type) {//defaultConfig, userConfig) {
  /*
   * Initialize Server
   */
  var config = _.merge({}, gulp._.config[type], gulp._.config.app[type] || {});

  gulp._.config.browser.init(config, watchForChanges);
}

gulp.task('preview', ['dev'], function() {
  launchPreview('preview');
});

gulp.task('preview-resp', ['dev'], function() {
  launchPreview('previewResp');
});
