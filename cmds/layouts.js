'use strict';

module.exports = function(program) {
  program
  .command('layout <layout-name> [new-name]')
  .description('Create or rename a Quasar App Layout')
  .action(function(name, newName) {
    program.helpers.assertInsideAppFolder();

    if (newName) {
      process.exit(require('../lib/cmds/layouts').rename(program, name, newName));
    }

    process.exit(require('../lib/cmds/layouts').create(program, name));
  });
};
