'use strict';

module.exports = function(program) {
  program
  .command('info')
  .description('Gather information about your runtime')
  .action(function() {
    var
      _ = require('lodash'),
      info = require('../lib/cmds/info')
      ;

    _.forEach(info, function(category) {
      program.log('\n', category.title.yellow);
      _.forEach(category.items, function(item) {
        program.log('', item[0] + ':\t', item[1]);
      });
    });

    program.log();
    process.exit(0);
  });
};
