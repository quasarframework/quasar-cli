'use strict';

function injectCommand(config) {
  config.program
  .command(config.type + ' <' + config.type + '-name> [new-name]')
  .description('Create or rename a Quasar App ' + config.type.charAt(0).toUpperCase() + config.type.slice(1))
  .option('-c, --copy', 'Copy Asset')
  .action(function(name, newName, options) {
    config.program.helpers.assertInsideAppFolder();

    var asset = require('../lib/cmds/assets');

    if (newName) {
      process.exit(asset.rename(config.type, options.copy, config.program, name, newName));
    }

    process.exit(asset.create(config.type, config.program, name));
  });
}

module.exports = function(program) {
  injectCommand({
    program: program,
    type: 'page'
  });

  injectCommand({
    program: program,
    type: 'layout'
  });
};
