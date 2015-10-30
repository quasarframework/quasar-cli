'use strict';

var
  gulp = require('gulp'),
  config = require('../gulp-config'),
  plugins = config.plugins,
  runSequence = require('run-sequence')
  ;

/*
 * Inject browser into config so tasks can stream CSS
 */
var browser = config.browser = require('browser-sync').create();

function reloadAfter(tasks) {
  return function() {
    runSequence(
      tasks,
      function() {
        browser.reload();
      }
    );
  };
}

function run(task) {
  return function() {
    runSequence(task);
  };
}

function watchForChanges() {
  /*
   * Watch for CSS
   */
  plugins.watch(config.css.all, run('dev:css'));

  /*
   * Watch for JS
   */
  plugins.watch([config.js.all, config.js.yml], reloadAfter('dev:js'));

  /*
   * Watch for HTML
   */
  plugins.watch(config.html.src, function() {
    runSequence('dev:html', 'dev:js', function() {
      browser.reload();
    });
  });

  /*
   * Watch for Assets
   */
  plugins.watch(config.assets.src, reloadAfter('dev:assets'));

  /*
   * Watch for Deps
   */
  plugins.watch(config.deps.js.src, reloadAfter('dev:js:deps'));
  plugins.watch(config.deps.css.src, run('dev:css:deps'));
}

gulp.task('monitor', ['build'], watchForChanges);

gulp.task('preview', ['build'], function() {
  /*
   * Initialize Server
   */
  config.browser.init(config.preview.server, watchForChanges);
});
