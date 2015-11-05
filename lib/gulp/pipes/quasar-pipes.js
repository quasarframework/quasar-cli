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

    var pageName = path.basename(file.path).match(/^script\.(.*)\.js$/)[1];
    var pageFolder = path.resolve(path.dirname(file.path), '../');

    if (pageName !== pageFolder.substr(pageFolder.lastIndexOf('/') + 1)) {
      console.log('ERROR!!!!!!! wrongly named file!');
    }

    var originalPageFolder = path.resolve(pageFolder, '../../../src/pages/' + pageName);
    var yamlFile = originalPageFolder + '/config.' + pageName + '.yml';

    if (fs.existsSync(yamlFile)) {
      manifest = yaml.load(fs.readFileSync(yamlFile)) || {};
    }

    if (!manifest.css) {
      if (fs.existsSync(originalPageFolder + '/css/style.' + pageName + '.styl')) {
        manifest.css = 'pages/' + pageName + '/css/style.' + pageName + '.css';
      }
    }

    if (!manifest.html) {
      var htmlFile = originalPageFolder + '/html/view.' + pageName + '.html';

      if (fs.existsSync(htmlFile)) {
        additions += 'module.exports.config.html = require(\'raw!' + htmlFile + '\');';
      }
    }

    file.contents = new Buffer(
      file.contents +
      '\nmodule.exports.config = ' + JSON.stringify(manifest, null, 2) + ';\n' +
      additions
    );

    this.push(file);
    callback();
  }

  return through.obj(compile);

};
