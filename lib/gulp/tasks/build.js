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
  'deps:$',
  'assets:$',
  'css:$',
  'html:$',
  'app-additions',
  'js:$'
];

_.forEach(['dev', 'prod'], function(type) {
  var deps = _.map(dependencies, function(item) {
    return item.replace('$', type);
  });

  if (type === 'prod') {
    deps.unshift('clean');
  }

  gulp.task(type, deps);
});
