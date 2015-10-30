'use strict';

var
  gulp = require('gulp'),
  config = require('../gulp-config'),
  del = require('del')
  ;

gulp.task('clean', function() {
  del.sync(config.clean);
});

gulp.task('clean:dist', function() {
  del.sync(config.dist.dest);
});
