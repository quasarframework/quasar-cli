'use strict';

module.exports.create = function(program, folder) {
  var
    fs = require('../file-system'),
    cwd = process.cwd(),
    src = fs.getPathToAsset('app'),
    dest = fs.joinPath(fs.getWorkingPath(), folder)
    ;

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

  process.chdir(dest);
  /* istanbul ignore if */
  if (require('./pages').create(program, 'index')) {
    return 1;
  }
  process.chdir(cwd);

  program.log.success('Quasar App created.');
  program.log.info('Don\'t forget to run "npm install" first.');

  return 0;
};
