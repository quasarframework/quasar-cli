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
};
