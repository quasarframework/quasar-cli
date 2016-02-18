'use strict';

var
  gulp = require('gulp'),
  merge = require('merge'),
  Karma = require('karma').Server
  ;

gulp.task('test', ['css:lint', 'js:lint'], function(done) {
  var config = merge(true, gulp._.config.karma, gulp._.config.app.test || {});

  new Karma(config, done).start();
});
