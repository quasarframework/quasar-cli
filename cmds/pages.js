'use strict';

module.exports = function(program) {
  program
  .command('new:page <page-name>')
  .description('Create a Quasar App Page')
  .action(function(name) {
    program.helpers.assertInsideAppFolder();
    process.exit(require('../lib/cmds/pages').create(program, name));
  });

  program
  .command('rename:page <old-name> <new-name>')
  .description('Rename a Quasar App Page')
  .action(function(oldName, newName) {
    program.helpers.assertInsideAppFolder();
    process.exit(require('../lib/cmds/pages').rename(program, oldName, newName));
  });
};
