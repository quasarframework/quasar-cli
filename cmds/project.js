'use strict';

module.exports = function(program) {
  program
  .command('new <app-folder>')
  .description('Create Quasar Project')
  .action(function(folder) {
    process.exit(require('../lib/cmds/project').create(program, folder));
  });
};
