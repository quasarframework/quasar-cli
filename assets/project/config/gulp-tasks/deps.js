'use strict';

var
  gulp = require('gulp'),
  config = require('../gulp-config'),
  plugins = config.plugins
  ;

/**
 * Scripts
 */
gulp.task('dev:js:deps', function() {
  return gulp.src(config.deps.js.src)
    .pipe(plugins.newer(config.deps.dest + '/' + config.deps.name + '.js'))
    .pipe(plugins.sourcemaps.init())
    .pipe(plugins.concat(config.deps.name + '.js'))
    .pipe(plugins.sourcemaps.write())
		.pipe(gulp.dest(config.deps.js.dest));
});

gulp.task('prod:js:deps', function() {
  return gulp.src(config.deps.js.src)
    .pipe(plugins.newer(config.deps.dest + '/' + config.deps.name + '.min.js'))
    .pipe(plugins.concat(config.deps.name + '.js'))
    .pipe(plugins.uglify())
    .pipe(gulp.dest(config.deps.js.dest));
});


/**
 * Styles
 */
gulp.task('dev:css:deps', function() {
  return gulp.src(config.deps.css.src)
    .pipe(plugins.newer(config.deps.dest + '/' + config.deps.name + '.css'))
    .pipe(plugins.sourcemaps.init())
    .pipe(plugins.concat(config.deps.name + '.css'))
    .pipe(plugins.sourcemaps.write())
    .pipe(gulp.dest(config.deps.css.dest));
});

gulp.task('prod:css:deps', function() {
  return gulp.src(config.deps.css.src)
    .pipe(plugins.concat(config.deps.name + '.css'))
    .pipe(plugins.csso())
    .pipe(gulp.dest(config.deps.css.dest));
});


/*
 * Main tasks
 */
gulp.task('dev:deps',  ['dev:js:deps',  'dev:css:deps']);
gulp.task('prod:deps', ['prod:js:deps', 'prod:css:deps']);
