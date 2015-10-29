'use strict';

var
  gulp = require('gulp'),
  config = require('../gulp-config'),
  plugins = config.plugins,
  runSequence = require('run-sequence'),
  del = require('del'),
  through = require('through2'),
  path = require('path'),
  fs = require('fs'),
  yaml = require('js-yaml')
  ;

gulp.task('js:lint', function() {
  return gulp.src(config.js.all)
    .pipe(plugins.pipes.js.lint());
});

function compile(production) {
  return gulp.src(config.js.tmp.src, {base: config.js.tmp.dest})
    .pipe(plugins.pipes.js.compile({
      prod: production,
      pack: config.webpack,
      retainPath: true
    }))
    .pipe(gulp.dest(config.js.dest));
}

function processJS(done, production) {
  runSequence(
    ['js:lint', 'js:copy'],
    'js:manifest',
    'js:compile:' + (production ? 'prod' : 'dev'),
    'js:clean',
    done
  );
}

gulp.task('dev:js', function(done) {
  processJS(done, false);
});

gulp.task('prod:js', function(done) {
  processJS(done, true);
});

gulp.task('js:compile:dev', function() {
  return compile(false);
});
gulp.task('js:compile:prod', function() {
  return compile(true);
});

gulp.task('js:copy', function() {
  return gulp.src(config.js.src, {base: config.base})
    .pipe(gulp.dest(config.js.tmp.dest));
});

gulp.task('js:clean', function() {
  del.sync(config.js.tmp.dest);
});


function pageCompiler() {
  function compile(file, enc, callback) {
    if (file.isNull()) {
      return callback(null, file);
    }

    var lastIndex = file.path.lastIndexOf('/');
    var additions = '';

    var pageName = file.path.substr(lastIndex + 1).match(/^page\.(.*)\.js$/)[1];
    var pageFolder = path.resolve(file.path.substr(0, lastIndex), '../');

    if (pageName !== pageFolder.substr(pageFolder.lastIndexOf('/') + 1)) {
      console.log('ERROR!!!!!!! wrongly named file!');
    }

    var originalPageFolder = path.resolve(pageFolder, '../../../src/pages/' + pageName);
    var yamlFile = originalPageFolder + '/page.' + pageName + '.yml';

    var manifest = yaml.load(fs.readFileSync(yamlFile));

    if (!manifest.css) {
      var cssFile = originalPageFolder + '/css/page.' + pageName + '.styl';

      if (fs.existsSync(cssFile)) {
        manifest.css = 'pages/' + pageName + '/css/page.' + pageName + '.css';
      }
    }

    if (!manifest.html) {
      var htmlFile = originalPageFolder + '/html/page.' + pageName + '.html';

      if (fs.existsSync(cssFile)) {
        additions += 'exports.__config.html = require(\'raw!' + htmlFile + '\');';
      }
    }


    file.contents = new Buffer(
    //console.log(
      'exports.__config = ' + JSON.stringify(manifest, null, 2) + ';\n' +
      additions + '\n\n' + file.contents
    );

    this.push(file);
    callback();
  }

  return through.obj(compile);
}

gulp.task('js:manifest', function() {
  return gulp.src(config.js.tmp.pages, {base: config.js.tmp.dest})
    .pipe(pageCompiler())
    .pipe(gulp.dest(config.js.tmp.dest));
});
