'use strict';

var fs = require('../file-system');

module.exports.create = function(program, folder) {
  var src = fs.getPathToAsset('project');
  var dest = fs.joinPath(fs.getWorkingPath(), folder);

  if (fs.exists(dest)) {
    program.log.error('Folder already exists!');
    return 1;
  }

  program.log.info('Generating Quasar Project folder...');

  /* istanbul ignore if */
  if (fs.copy(src, dest)) {
    program.log.error('Cannot copy files.');
    return 1;
  }

  program.log.success('Quasar Project created. Don\'t forget to run "npm init" before building.');
  return 0;
};
