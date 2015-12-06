'use strict';

var fs = require('../file-system');

function renameAppLayout(oldName, newName) {
  var
    src = fs.getPathToFolderFromApp('src/layouts/' + oldName),
    dest = fs.getPathToFolderFromApp('src/layouts/' + newName)
    ;

  /* istanbul ignore if */
  if (fs.move(src, dest)) {
    return 1;
  }
  /* istanbul ignore if */
  if (
    fs.exists(dest + '/layout.' + oldName + '.html') &&
    fs.move(dest + '/layout.' + oldName + '.html', dest + '/layout.' + newName + '.html')
  ) {
    return 1;
  }
  /* istanbul ignore if */
  if (fs.move(dest + '/layout.' + oldName + '.js', dest + '/layout.' + newName + '.js')) {
    return 1;
  }

  var
    data,
    nodefs = require('fs'),
    filename = dest + '/layout.' + newName + '.js'
    ;

  data = nodefs.readFileSync(filename, 'utf8');

  nodefs.writeFileSync(
    filename,
    data.replace(new RegExp('layout.' + oldName + '.html', 'g'), 'layout.' + newName + '.html'),
    'utf8'
  );
}

function create(program, name) {
  var src = fs.getPathToAsset('layout');
  var dest = fs.getPathToFolderFromApp('src/layouts/');

  if (fs.exists(dest + '/' + name)) {
    program.log.error('Layout already exists.');
    return 1;
  }

  program.log.info('Generating Quasar App layout...');

  /* istanbul ignore next */
  if (fs.copy(src, dest)) {
    program.log.error('Cannot copy files.');
    return 1;
  }

  program.log.success('Template copied.');

  /* istanbul ignore next */
  if (renameAppLayout('___layout___', name)) {
    program.log.error('Cannot rename template layout.');
    fs.removeFolder(fs.getPathToFolderFromApp('src/layouts/___layout___'));
    return 1;
  }

  program.log.success('Quasar Layout', name.green, 'created.');
  return 0;
}

function rename(program, oldName, newName) {
  var src = fs.getPathToFolderFromApp('src/layouts/' + oldName);
  var dest = fs.getPathToFolderFromApp('src/layouts/' + newName);

  if (!fs.exists(src)) {
    program.log.error('Layout does not exists.');
    return 1;
  }
  if (fs.exists(dest)) {
    program.log.error('Layout with new name already exists.');
    return 1;
  }

  program.log.info('Renaming Quasar App layout...');

  /* istanbul ignore next */
  if (renameAppLayout(oldName, newName)) {
    program.log.error('Cannot rename App layout.');
    return 1;
  }

  program.log.success('Quasar Layout', oldName.green, 'renamed to', newName.green, '.');
  return 0;
}


module.exports = {
  create: create,
  rename: rename
};
