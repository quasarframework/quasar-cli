'use strict';

var
  gulp = require('gulp'),
  del = require('del')
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

['dev', 'prod'].forEach(function(type) {
  var deps = dependencies.map(function(item) {
    return item.replace('$', type);
  });

  if (type === 'prod') {
    deps.unshift('clean');
  }

  gulp.task(type, deps);
});
