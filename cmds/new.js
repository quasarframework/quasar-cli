'use strict';

var
  path = require('path'),
  fs = require('fs'),
  fse = require('fs-extra');

module.exports = function(program) {
  program
  .command('new <folder>')
  .alias('new:app')
  .description('Create a Quasar project folder')
  .action(function(folder) {
    var src = path.normalize(path.join(__dirname, '../assets/project'));
    var dest = path.normalize(path.join(process.cwd(), folder));

    if (fs.existsSync(dest)) {
      program.log.error('Folder already exists!');
      process.exit(1);
    }

    program.log.info('Generating Quasar Project folder...');

    var err = fse.copySync(src, dest);

    if (err) {
      // notify of error
      program.log.error('Error initializing. Abort.', err);

      process.exit(1); // <<<--- EARLY EXIT
    }

    program.log.success('Project folder created.');
  });
};
