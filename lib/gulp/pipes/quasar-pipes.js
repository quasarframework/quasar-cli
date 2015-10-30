var
  through = require('through2'),
  path = require('path'),
  fs = require('fs'),
  yaml = require('js-yaml')
  ;

module.exports.pageCompiler = function() {

  function compile(file, enc, callback) {
    if (file.isNull()) {
      return callback(null, file);
    }

    var
      additions = '',
      manifest = {}
      ;

    var pageName = path.basename(file.path).match(/^page\.(.*)\.js$/)[1];
    var pageFolder = path.resolve(path.dirname(file.path), '../');

    if (pageName !== pageFolder.substr(pageFolder.lastIndexOf('/') + 1)) {
      console.log('ERROR!!!!!!! wrongly named file!');
    }

    var originalPageFolder = path.resolve(pageFolder, '../../../src/pages/' + pageName);
    var yamlFile = originalPageFolder + '/page.' + pageName + '.yml';

    if (fs.existsSync(yamlFile)) {
      manifest = yaml.load(fs.readFileSync(yamlFile));
    }

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
      'exports.__config = ' + JSON.stringify(manifest, null, 2) + ';\n' +
      additions + '\n\n' + file.contents
    );

    this.push(file);
    callback();
  }

  return through.obj(compile);

};
