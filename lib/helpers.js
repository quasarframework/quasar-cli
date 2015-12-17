'use strict';

var
  fs = require('./file-system'),
  path = require('path')
  ;

/* istanbul ignore next */
function exit(program) {
  program.log();
  program.log.error('Command works only inside a Quasar App folder.');
  program.log();
  process.exit(1);
}

module.exports = /* istanbul ignore next */ function(program) {
  program.helpers = {
    insideAppFolder: function() {
      var cwd = fs.getAppPath();

      if (!cwd || !fs.exists(path.join(cwd, 'quasar.build.yml'))) {
        return false;
      }

      return true;
    },
    assertInsideAppFolder: function() {
      if (!this.insideAppFolder()) {
        exit(program);
      }
    },
    assertInsideNpmFolder: function() {
      if (!fs.getAppPath()) {
        exit(program);
      }
    }
  };
};
