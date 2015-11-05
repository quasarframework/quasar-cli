'use strict';

var fs = require('../file-system');

function renameAppPage(oldName, newName) {
  var src = fs.getPathToFolderFromApp('src/pages/' + oldName);
  var dest = fs.getPathToFolderFromApp('src/pages/' + newName);

  /* istanbul ignore if */
  if (fs.move(src, dest)) {
    return 1;
  }
  /* istanbul ignore if */
  if (fs.move(dest + '/config.' + oldName + '.yml', dest + '/config.' + newName + '.yml')) {
    return 1;
  }
  /* istanbul ignore if */
  if (fs.move(dest + '/css/style.' + oldName + '.styl', dest + '/css/style.' + newName + '.styl')) {
    return 1;
  }
  /* istanbul ignore if */
  if (fs.move(dest + '/html/view.' + oldName + '.html', dest + '/html/view.' + newName + '.html')) {
    return 1;
  }
  /* istanbul ignore if */
  if (fs.move(dest + '/js/script.' + oldName + '.js', dest + '/js/script.' + newName + '.js')) {
    return 1;
  }
}

function create(program, name) {
  var src = fs.getPathToAsset('page');
  var dest = fs.getPathToFolderFromApp('src/pages/');

  if (fs.exists(dest + '/' + name)) {
    program.log.error('Page already exists.');
    return 1;
  }

  program.log.info('Generating Quasar App page...');

  /* istanbul ignore next */
  if (fs.copy(src, dest)) {
    program.log.error('Cannot copy files.');
    return 1;
  }

  program.log.success('Template copied.');

  /* istanbul ignore next */
  if (renameAppPage('___page___', name)) {
    program.log.error('Cannot rename template page.');
    fs.removeFolder(fs.getPathToFolderFromApp('src/pages/___page___'));
    return 1;
  }

  program.log.success('Quasar Page', name.green, 'created.');
  return 0;
}

function remove(program, name) {
  var src  = fs.getPathToFolderFromApp('src/pages/' + name);

  if (!fs.exists(src)) {
    program.log.error('Page does not exists!');
    return 1;
  }

  program.log.info('Removing Quasar App page...');

  /* istanbul ignore next */
  if (fs.remove(src)) {
    program.log.error('Cannot remove files.');
    return 1;
  }

  program.log.success('Quasar Page', name.green, 'was deleted.');
  return 0;
}

function rename(program, oldName, newName) {
  var src = fs.getPathToFolderFromApp('src/pages/' + oldName);
  var dest = fs.getPathToFolderFromApp('src/pages/' + newName);

  if (!fs.exists(src)) {
    program.log.error('Page does not exists.');
    return 1;
  }
  if (fs.exists(dest)) {
    program.log.error('Page with new name already exists.');
    return 1;
  }

  program.log.info('Renaming Quasar App page...');

  /* istanbul ignore next */
  if (renameAppPage(oldName, newName)) {
    program.log.error('Cannot rename App page.');
    return 1;
  }

  program.log.success('Quasar Page', oldName.green, 'renamed to', newName.green, '.');
  return 0;
}


module.exports = {
  create: create,
  rename: rename,
  remove: remove
};
