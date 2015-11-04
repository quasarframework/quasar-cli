'use strict';

module.exports = function(program) {
  program
  .command('new <app-folder>')
  .description('Create Quasar App')
  .action(function(folder) {
    process.exit(require('../lib/cmds/app').create(program, folder));
  });
};
