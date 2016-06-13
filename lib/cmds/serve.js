'use strict';

module.exports = function(program, folder, callback) {
  var
    watch = require('gulp-watch'),
    server = require('browser-sync').create()
    ;

  server.init({
    open: false,
    reloadOnRestart: true,
    ghostMode: false,
    server: {
      baseDir: folder
    }
  });

  watch(folder + '/**/*', function() {
    server.reload();
  });
};
