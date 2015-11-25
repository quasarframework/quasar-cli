'use strict';

var
  os = require('os'),
  pkg = require('../package-json')
  ;


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
