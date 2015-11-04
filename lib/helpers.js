'use strict';

var
  fs = require('./file-system'),
  path = require('path'),
  getRoot = require('find-root')
  ;

function exit(program) {
  program.log();
  program.log.error('Command works only inside a Quasar Project folder.');
  program.log();
  process.exit(1);
}

module.exports = function(program) {
  program.helpers = {
    assertInsideProjectFolder: function() {
      var cwd;

      try {
        cwd = getRoot(process.cwd());
      }
      catch(e) {
        exit(program);
      }

      if (!fs.exists(path.join(cwd, 'quasar.config.yml'))) {
        exit(program);
      }
    }
  };
};
