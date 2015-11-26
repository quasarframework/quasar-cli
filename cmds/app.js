'use strict';

module.exports = function(program) {
  program
  .command('new <app-folder>')
  .description('Create Quasar App')
  .action(function(folder) {
    require('../lib/cmds/app').create(program, folder, function(exitCode) {
      process.exit(exitCode);
    });
  });

  program
  .command('wrap')
  .usage('[Cordova command parameters] [options]')
  .description('Wrap App (or execute cmd) with Cordova')
  .action(function() {
    program.helpers.assertInsideAppFolder();

    var appPath = require('../lib/file-system').getAppPath();

    if (arguments.length <= 1) {
      require('../lib/cmds/wrap').wrap(program, appPath, function(exitCode) {
        process.exit(exitCode);
      });
      return; // <<< EARLY EXIT
    }

    var args = Array.prototype.slice.call(arguments).slice(0, -1);

    require('../lib/cmds/wrap').run(program, appPath, args, function(exitCode) {
      process.exit(exitCode);
    });
  });
};
