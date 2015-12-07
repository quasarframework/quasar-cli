'use strict';

var
  gulp = require('gulp'),
  _ = require('lodash')
  ;

_.forEach(['js', 'css'], function(type) {
  gulp.task(type + ':lint', function() {
    return gulp.src(gulp._.config[type].all)
      .pipe(gulp._.plugins.pipes[type].lint());
  });
});
