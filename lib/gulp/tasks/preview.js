'use strict';

var
  gulp = require('gulp'),
  _ = require('lodash')
  ;

/*
 * Inject browser into config so tasks can stream CSS
 */
var browser = gulp._.config.browser = require('browser-sync').create();

function reloadAfter(tasks) {
  return function() {
    gulp._.sequence(
      tasks,
      function() {
        browser.reload();
      }
    );
  };
}

function run(task) {
  return function() {
    gulp._.sequence(task);
  };
}

function watchForChanges() {
  /*
   * Watch for CSS
   */
  gulp._.plugins.watch(gulp._.config.css.all, run('dev:css'));

  /*
   * Watch for JS
   */
  gulp._.plugins.watch(gulp._.config.js.all, reloadAfter('dev:js', 'manifest'));
  gulp._.plugins.watch(gulp._.config.js.yml, reloadAfter('dev:js', 'manifest'));

  /*
   * Watch for HTML
   */
  gulp._.plugins.watch(gulp._.config.html.src, function() {
    gulp._.sequence('dev:html', 'dev:js', function() {
      browser.reload();
    });
  });

  /*
   * Watch for Assets
   */
  gulp._.plugins.watch(gulp._.config.assets.src, reloadAfter('dev:assets'));

  /*
   * Watch for Deps
   */
  gulp._.plugins.watch(gulp._.config.deps.js.src, reloadAfter('dev:js:deps'));
  gulp._.plugins.watch(gulp._.config.deps.css.src, run('dev:css:deps'));
}

gulp.task('monitor', ['build'], watchForChanges);

gulp.task('preview', ['build'], function() {
  /*
   * Initialize Server
   */
  var config = {};
  var userConfig = gulp._.config.app.preview || {};

  _.merge(config, gulp._.config.preview, userConfig);

  gulp._.config.browser.init(config, watchForChanges);
});
