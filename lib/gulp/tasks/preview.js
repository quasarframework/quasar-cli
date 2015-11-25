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
  gulp._.plugins.watch('quasar.build.yml', reloadAfter('build'));

  /*
   * Watch for CSS
   */
  gulp._.plugins.watch(gulp._.config.css.all, run('dev:css'));

  /*
   * Watch for JS
   */
  gulp._.plugins.watch(gulp._.config.js.all, reloadAfter(['dev:js', 'manifest']));
  gulp._.plugins.watch(gulp._.config.js.yml, reloadAfter(['dev:js', 'manifest']));

  /*
   * Watch for HTML
   */
  gulp._.plugins.watch(gulp._.config.html.src, function() {
    gulp._.sequence('dev:html', 'dev:js', function() {
      gulp._.config.browser.reload();
    });
  });

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

gulp.task('monitor', ['build'], watchForChanges);


function launchPreview(type) {//defaultConfig, userConfig) {
  /*
   * Initialize Server
   */
  var config = _.merge({}, gulp._.config[type], gulp._.config.app[type] || {});

  gulp._.config.browser.init(config, watchForChanges);
}

gulp.task('preview', ['build'], function() {
  launchPreview('preview');
});

gulp.task('rpreview', ['build'], function() {
  launchPreview('rpreview');
});
