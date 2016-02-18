'use strict';

module.exports = function(program) {
  program
  .command('info')
  .description('Gather information about your runtime')
  .action(function() {
    var info = require('../lib/cmds/info');

    info.forEach(function(category) {
      program.log('\n', category.title.yellow);
      category.items.forEach(function(item) {
        program.log('', item[0] + ':\t', item[1]);
      });
    });

    program.log();
    process.exit(0);
  });
};
