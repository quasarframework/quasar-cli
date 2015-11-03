'use strict';

module.exports = function(program) {
  program
  .command('new:page <page-name>')
  .description('Create a Quasar Project Page')
  .action(function(name) {
    process.exit(require('../lib/cmds/pages').create(program, name));
  });

  program
  .command('remove:page <page-name>')
  .description('Remove a Quasar Project Page')
  .action(function(name) {
    process.exit(require('../lib/cmds/pages').remove(program, name));
  });

  program
  .command('rename:page <old-name> <new-name>')
  .description('Rename a Quasar Project Page')
  .action(function(oldName, newName) {
    process.exit(require('../lib/cmds/pages').rename(program, oldName, newName));
  });
};
