'use strict';

var
  os = require('os'),
  pkg = require('../package-json'),
  p = {}
  ;

require('../helpers')(p);

module.exports = [
  {
    title: 'Runtime',
    items: [
      ['Quasar CLI', 'v' + pkg.getVersion(__dirname)],
      ['Node JS', process.version]
    ]
  },
  {
    title: 'Operating System',
    items: [
      ['Architecture', os.arch()],
      ['Platform', os.platform()],
      ['Release', os.release()]
    ]
  }
];

/* istanbul ignore if */
if (p.helpers.insideAppFolder()) {
  var fs = require('../file-system');
  var version = pkg.getVersion(fs.joinPath(fs.getAppPath(), 'node_modules/quasar-framework/'));

  module.exports.push({
    title: 'App',
    items: [
      ['Quasar Framework', 'v' + version]
    ]
  });
}
