'use strict';

var
  gulp = require('gulp'),
  config = require('../gulp-config'),
  plugins = config.plugins,
  named = require('vinyl-named'),
  fm = require('front-matter'),
  through = require('through2'),
  runSequence = require('run-sequence'),
  del = require('del'),
  nib = require('nib')
  ;

function pageCompiler() {
  function compile(file, enc, callback) {
    if (file.isNull()) {
      return callback(null, file);
    }
    if (file.isStream()) {
      throw new Error('STREAM!');
    }

    var str = file.contents.toString('utf8');
    var content = fm(str);
    var json = content.attributes;
    var addition = '';

    if (json.template) {
      if (json.template.indexOf('$') > -1) {
        delete json.template;
        addition = 'exports.__config.template = require(\'raw!./html/page.home.tpl\');';
      }
      else if (json.template.indexOf('./') == -1) {
        json.template = 'html/' + json.template + '.tpl';
      }
    }

    file.contents = new Buffer('/*eslint-disable */\nexports.__config = ' +
      JSON.stringify(json) + ';\n' +
      addition + '\n/*eslint-enable */\n' + content.body
    );

    this.push(file);
    callback();
  }

  return through.obj(compile);
}


gulp.task('dev:pages:copy', function() {
  return gulp.src(config.pages.src)
    .pipe(gulp.dest(config.pages.dest));
});

gulp.task('pages:css:lint', function() {
  return gulp.src(config.pages.css.watch)
    .pipe(plugins.stylint())
    .pipe(plugins.stylint.reporter());
});

gulp.task('dev:pages:css', ['pages:css:lint'], function() {
  return gulp.src(config.pages.css.entry)
    .pipe(plugins.sourcemaps.init())
    .pipe(plugins.stylus({
      use: [nib()]
    }))
    .pipe(plugins.autoprefixer(config.css.autoprefixer))
    .pipe(plugins.sourcemaps.write())
    .pipe(gulp.dest(config.pages.dest));
});

gulp.task('dev:pages:compile', function() {
  return gulp.src(config.pages.js.entry)
    .pipe(pageCompiler())
    .pipe(gulp.dest(config.pages.dest));
});

gulp.task('dev:pages:pack', function() {
  var tmp = {};

  return gulp.src(config.pages.js.entry)
    .pipe(plugins.eslint())
    .pipe(plugins.eslint.format())
    .pipe(plugins.rename(function(path) {
      tmp[path.basename] = path;
    }))
    .pipe(named())
    .pipe(plugins.webpack(config.webpack.dev))
    .pipe(plugins.rename(function(path) {
      path.dirname = tmp[path.basename].dirname;
    }))
    .pipe(gulp.dest(config.pages.dest));
});

gulp.task('dev:pages:clean', function() {
  del.sync(config.pages.clean);
});

gulp.task('dev:pages', function(done) {
  runSequence(
    'dev:pages:copy',
    ['dev:pages:css', 'dev:pages:compile'],
    'dev:pages:pack',
    'dev:pages:clean',
    done
  );
});



gulp.task('prod:pages', function() {
  return;
  return gulp.src(config.pages.entry)
    .pipe(pageCompiler())
    //.pipe(plugins.eslint())
    //.pipe(plugins.eslint.format())
    .pipe(named())
    //.pipe(stream(config.webpack.prod, webpack))
    .pipe(plugins.uglify())
    .pipe(gulp.dest(config.pages.dest));
});
