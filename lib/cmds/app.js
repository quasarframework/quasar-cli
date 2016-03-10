'use strict';

module.exports.create = function(program, folder, callback) {
  var
    fs = require('../file-system'),
    cwd = process.cwd(),
    src = fs.getPathToAsset('app'),
    dest = fs.joinPath(fs.getWorkingPath(), folder)
    ;

  if (fs.exists(dest)) {
    program.log.error('Folder already exists!');
    callback(1);
    return;
  }

  program.log.info('Generating Quasar App folder...');

  /* istanbul ignore if */
  if (fs.copy(src, dest)) {
    program.log.error('Cannot generate App folder.');
    callback(1);
    return;
  }

  process.chdir(dest);

  /* istanbul ignore if */
  if (require('./assets').create('page', program, 'index')) {
    callback(1);
    return;
  }

  program.log.success('Quasar App created.\n');

  var spinner = require('ora')('Running "npm install"...');

  spinner.start();
  require('child_process').exec('npm install', function(err) {
    spinner.stop();

    /* istanbul ignore if */
    if (err) {
      program.log.error('"npm install" failed. Please manually run it inside App folder.');
      callback(1);
      return;
    }
    program.log.success('Your App folder is ready.');
    callback(0);
  });

  process.chdir(cwd);
};
