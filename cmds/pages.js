'use strict';

module.exports = function(program) {
  program
  .command('page <page-name> [new-name]')
  .description('Create or rename a Quasar App Page')
  .action(function(name, newName) {
    program.helpers.assertInsideAppFolder();

    if (newName) {
      process.exit(require('../lib/cmds/pages').rename(program, name, newName));
    }

    process.exit(require('../lib/cmds/pages').create(program, name));
  });
};
