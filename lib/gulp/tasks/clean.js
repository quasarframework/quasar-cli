'use strict';

var
  gulp = require('gulp'),
  del = require('del')
  ;

gulp.task('clean', function() {
  del.sync(gulp._.config.clean);
});
