'use strict';

var gulp = require('gulp');

/*
 * Inject browser into config so tasks can stream CSS
 */
var browser = gulp.q.config.browser = require('browser-sync').create();

function reloadAfter(tasks) {
  return function() {
    gulp.q.sequence(
      tasks,
      function() {
        browser.reload();
      }
    );
  };
}

function run(task) {
  return function() {
    gulp.q.sequence(task);
  };
}

function watchForChanges() {
  /*
   * Watch for CSS
   */
  gulp.q.plugins.watch(gulp.q.config.css.all, run('dev:css'));

  /*
   * Watch for JS
   */
  gulp.q.plugins.watch([gulp.q.config.js.all, gulp.q.config.js.yml], reloadAfter('dev:js'));

  /*
   * Watch for HTML
   */
  gulp.q.plugins.watch(gulp.q.config.html.src, function() {
    gulp.q.sequence('dev:html', 'dev:js', function() {
      browser.reload();
    });
  });

  /*
   * Watch for Assets
   */
  gulp.q.plugins.watch(gulp.q.config.assets.src, reloadAfter('dev:assets'));

  /*
   * Watch for Deps
   */
  gulp.q.plugins.watch(gulp.q.config.deps.js.src, reloadAfter('dev:js:deps'));
  gulp.q.plugins.watch(gulp.q.config.deps.css.src, run('dev:css:deps'));
}

gulp.task('monitor', ['build'], watchForChanges);

gulp.task('preview', ['build'], function() {
  /*
   * Initialize Server
   */
  gulp.q.config.browser.init(gulp.q.config.preview.server, watchForChanges);
});
