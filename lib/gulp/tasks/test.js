'use strict';

var
  gulp = require('gulp'),
  _ = require('lodash'),
  Karma = require('karma').Server
  ;

gulp.task('test', ['css:lint', 'js:lint'], function(done) {
  var config = _.merge({}, gulp._.config.karma, gulp._.config.app.test || {});

  new Karma(config, done).start();
});
