'use strict';

var
  plugins = require('gulp-load-plugins')(),
  nib = require('nib')
  ;

module.exports.lint = function(pipe) {
  return pipe.pipe(plugins.stylint())
    .pipe(plugins.stylint.reporter());
};

module.exports.process = {
  dev: function(pipe, options) {
    return pipe.pipe(plugins.sourcemaps.init())
      .pipe(plugins.stylus({use: [nib()]}))
      .pipe(plugins.autoprefixer(options.autoprefixer))
      .pipe(plugins.sourcemaps.write());
  },
  prod: function(pipe, options) {
    return pipe.pipe(plugins.stylus({use: [nib()]}))
      .pipe(plugins.autoprefixer(options.autoprefixer))
      .pipe(plugins.csso());
  }
};
