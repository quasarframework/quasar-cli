'use strict';

var
  fs = require('./file-system'),
  path = require('path'),
  getRoot = require('find-root')
  ;

function exit(program) {
  program.log();
  program.log.error('Command works only inside a Quasar App folder.');
  program.log();
  process.exit(1);
}

module.exports = function(program) {
  program.helpers = {
    assertInsideAppFolder: function() {
      var cwd;

      try {
        cwd = getRoot(process.cwd());
      }
      catch(e) {
        exit(program);
      }

      if (!fs.exists(path.join(cwd, 'quasar.build.yml'))) {
        exit(program);
      }
    }
  };
};
