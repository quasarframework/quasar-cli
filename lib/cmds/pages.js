'use strict';

var fs = require('../file-system');

function renameProjectPage(oldName, newName) {
  var src = fs.getPathToFolderFromProject('src/pages/' + oldName);
  var dest = fs.getPathToFolderFromProject('src/pages/' + newName);

  /* istanbul ignore if */
  if (fs.move(src, dest)) {
    return 1;
  }
  /* istanbul ignore if */
  if (fs.move(dest + '/' + oldName + '.yml', dest + '/' + newName + '.yml')) {
    return 1;
  }
  /* istanbul ignore if */
  if (fs.move(dest + '/css/page.' + oldName + '.styl', dest + '/css/page.' + newName + '.styl')) {
    return 1;
  }
  /* istanbul ignore if */
  if (fs.move(dest + '/html/page.' + oldName + '.html', dest + '/html/page.' + newName + '.html')) {
    return 1;
  }
  /* istanbul ignore if */
  if (fs.move(dest + '/js/page.' + oldName + '.js', dest + '/js/page.' + newName + '.js')) {
    return 1;
  }
}

function create(program, name) {
  var src = fs.getPathToAsset('page');
  var dest = fs.getPathToFolderFromProject('src/pages/');

  if (fs.exists(dest + '/' + name)) {
    program.log.error('Page already exists.');
    return 1;
  }

  program.log.info('Generating Quasar Project page...');

  /* istanbul ignore next */
  if (fs.copy(src, dest)) {
    program.log.error('Cannot copy files.');
    return 1;
  }

  program.log.success('Template copied.');

  /* istanbul ignore next */
  if (renameProjectPage('___page___', name)) {
    program.log.error('Cannot rename template page.');
    fs.removeFolder(fs.getPathToFolderFromProject('src/pages/___page___'));
    return 1;
  }

  program.log.success('Quasar Page', name.green, 'created.');
  return 0;
}

function remove(program, name) {
  var src  = fs.getPathToFolderFromProject('src/pages/' + name);

  if (!fs.exists(src)) {
    program.log.error('Page does not exists!');
    return 1;
  }

  program.log.info('Removing Quasar Project page...');

  /* istanbul ignore next */
  if (fs.remove(src)) {
    program.log.error('Cannot remove files.');
    return 1;
  }

  program.log.success('Quasar Page', name.green, 'was deleted.');
  return 0;
};

function rename(program, oldName, newName) {
  var src = fs.getPathToFolderFromProject('src/pages/' + oldName);
  var dest = fs.getPathToFolderFromProject('src/pages/' + newName);

  if (!fs.exists(src)) {
    program.log.error('Page does not exists.');
    return 1;
  }
  if (fs.exists(dest)) {
    program.log.error('Page with new name already exists.');
    return 1;
  }

  program.log.info('Renaming Quasar Project page...');

  /* istanbul ignore next */
  if (renameProjectPage(oldName, newName)) {
    program.log.error('Cannot rename project page.');
    return 1;
  }

  program.log.success('Quasar Page', oldName.green, 'renamed to ', newName.green, '.');
  return 0;
}


module.exports = {
  create: create,
  rename: rename,
  remove: remove
};
