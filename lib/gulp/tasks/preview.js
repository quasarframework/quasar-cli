'use strict';

var
  gulp = require('gulp'),
  merge = require('merge')
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
  return list.map(function(item) {
    return item + suffix;
  });
}

var watchers = [
  {
    files: 'quasar.build.yml',
    method: reloadAfter,
    task: '$'
  },
  {
    files: gulp._.config.css.watch,
    method: run,
    task: 'css:$'
  },
  {
    files: gulp._.config.js.watch,
    method: reloadAfter,
    task: 'js:$'
  },
  {
    files: gulp._.config.html.watch
      .concat([gulp._.config.appManifest.watch.pages, gulp._.config.appManifest.watch.layouts]),
    method: reloadAfter,
    task: 'html:$'
  },
  {
    files: gulp._.config.assets.src,
    method: reloadAfter,
    task: 'assets:$'
  },
  {
    files: function(production) {
      return mapDeps((production ? '.min' : '') + '.js', gulp._.config.deps.js.src);
    },
    method: reloadAfter,
    task: 'js:deps:$'
  }
  /*
  {
    files: function(production) {
      return mapDeps((production ? '.min' : '') + '.css', gulp._.config.deps.css.src);
    },
    method: run,
    task: 'css:deps:$'
  }
  */
];

function watchForChanges(production) {
  var suffix = production ? 'prod' : 'dev';

  watchers.forEach(function(watcher) {
    gulp._.plugins.watch(
      typeof watcher.files === 'function' ? watcher.files(production) : watcher.files,
      watcher.method(watcher.task.replace('$', suffix))
    );
  });
}

function launchPreview(type, production) {
  /*
   * Initialize Server
   */
  var config = merge(true, gulp._.config[type], gulp._.config.app[type] || {});

  gulp._.config.browser.init(config, function() {
    watchForChanges(production);
  });
}

['dev', 'prod'].forEach(function(type) {
  var production = type === 'prod';

  gulp.task('monitor:' + type, [type], function() {
    gulp._.config.bailOnError = false;
    watchForChanges(production);
  });
  gulp.task('preview:' + type, ['monitor:' + type], function() {
    launchPreview('preview', production);
  });
  gulp.task('responsive:' + type, ['monitor:' + type], function() {
    launchPreview('responsive', production);
  });

});
