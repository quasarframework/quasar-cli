'use strict';

var
  gulp = require('gulp'),
  del = require('del'),
  _ = require('lodash')
  ;

gulp.task('clean', function() {
  del.sync(gulp._.config.clean);
});

var dependencies = [
  '$:deps',
  '$:assets',
  '$:css',
  'app-additions',
  '$:layouts',
  '$:js',
  'manifest'
];

_.forEach(['dev', 'prod'], function(type) {
  var deps = _.map(dependencies, function(item) {
    return item.replace('$', type);
  });

  if (type === 'prod') {
    deps = ['clean'].concat(deps);
  }

  gulp.task(type, deps);
});
