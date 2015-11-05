'use strict';

var fs = require('../file-system');

module.exports.create = function(program, folder) {
  var cwd = process.cwd();
  var src = fs.getPathToAsset('app');
  var page = fs.getPathToAsset('page');
  var dest = fs.joinPath(fs.getWorkingPath(), folder);

  if (fs.exists(dest)) {
    program.log.error('Folder already exists!');
    return 1;
  }

  program.log.info('Generating Quasar App folder...');

  /* istanbul ignore if */
  if (fs.copy(src, dest)) {
    program.log.error('Cannot generate App folder.');
    return 1;
  }

  process.chdir('./' + folder);
  if (require('./pages').create(program, 'index')) {
    return 1;
  }
  process.chdir(cwd);

  program.log.success('Quasar App created. Don\'t forget to run "npm init" before building.');
  return 0;
};
