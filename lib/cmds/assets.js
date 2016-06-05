'use strict';

var fs = require('../file-system');

var
  files = {
    page: [
      ['/config.', '.yml'],
      ['/style.', '.styl', true],
      ['/view.', '.html', true],
      ['/script.', '.js']
    ],
    layout: [
      ['/layout.', '.html'],
      ['/layout.', '.styl', true],
      ['/layout.', '.yml'],
      ['/layout.', '.js']
    ]
  },
  replace = {
    page: [
      {
        file: 'script.',
        ext: '.js',
        path: 'raw!./view.',
        pathEnd: '.html'
      },
      {
        file: 'style.',
        ext: '.styl',
        path: '.page-',
        pathEnd: ' ',
        optional: true
      },
      {
        file: 'style.',
        ext: '.styl',
        path: '.page-',
        pathEnd: '\n',
        optional: true
      }
    ],
    layout: [
      {
        file: 'layout.',
        ext: '.js',
        path: 'raw!./layout.',
        pathEnd: '.html'
      },
      {
        file: 'layout.',
        ext: '.styl',
        path: '.layout-',
        pathEnd: ' ',
        optional: true
      },
      {
        file: 'layout.',
        ext: '.styl',
        path: '.layout-',
        pathEnd: '\n',
        optional: true
      }
    ]
  };

function renameAsset(assetType, oldName, newName) {
  var
    returnValue = 0,
    src = fs.getPathToFolderFromApp('src/' + assetType + 's/' + oldName),
    dest = fs.getPathToFolderFromApp('src/' + assetType + 's/' + newName)
    ;

  /* istanbul ignore if */
  if (fs.move(src, dest)) {
    return 1;
  }

  files[assetType].forEach(function(file) {
    /* istanbul ignore if */
    if (returnValue) {
      return;
    }

    var rename = true;

    if (file[2]) {
      rename = fs.exists(dest + file[0] + oldName + file[1]);
    }

    /* istanbul ignore if */
    if (rename && fs.move(dest + file[0] + oldName + file[1], dest + file[0] + newName + file[1])) {
      returnValue = 1;
      return;
    }
  });

  replace[assetType].forEach(function(asset) {
    var
      data,
      filename = dest + '/' + asset.file + newName + asset.ext,
      nodefs = require('fs')
      ;

    if (asset.optional && !fs.exists(filename)) {
      return;
    }

    data = nodefs.readFileSync(filename, 'utf8').replace(
      new RegExp(asset.path + oldName + asset.pathEnd, 'g'),
      asset.path + newName + asset.pathEnd
    );

    nodefs.writeFileSync(filename, data, 'utf8');
  });

  return returnValue;
}

function create(assetType, program, name) {
  var
    src = fs.getPathToAsset(assetType),
    dest = fs.getPathToFolderFromApp('src/' + assetType + 's/'),
    title = assetType.charAt(0).toUpperCase() + assetType.slice(1)
    ;

  if (fs.exists(dest + '/' + name)) {
    program.log.error(title + ' already exists.');
    return 1;
  }

  program.log.info('Generating Quasar App ' + title + '...');

  /* istanbul ignore next */
  if (fs.copy(src, dest)) {
    program.log.error('Cannot copy files.');
    return 1;
  }

  program.log.success('Template copied.');

  /* istanbul ignore next */
  if (renameAsset(assetType, '___' + assetType + '___', name)) {
    program.log.error('Cannot rename ' + title + ' template.');
    fs.remove(fs.getPathToFolderFromApp('src/' + assetType + 's/___' + assetType + '___'));
    return 1;
  }

  program.log.success('Quasar ' + title, name.green, 'created.');
  return 0;
}

function rename(assetType, program, oldName, newName) {
  var
    src = fs.getPathToFolderFromApp('src/' + assetType + 's/' + oldName),
    dest = fs.getPathToFolderFromApp('src/' + assetType + 's/' + newName),
    title = assetType.charAt(0).toUpperCase() + assetType.slice(1)
    ;

  if (!fs.exists(src)) {
    program.log.error(title + ' does not exists.');
    return 1;
  }
  if (fs.exists(dest)) {
    program.log.error(title + ' with new name already exists.');
    return 1;
  }

  program.log.info('Renaming Quasar App ' + title + '...');

  /* istanbul ignore next */
  if (renameAsset(assetType, oldName, newName)) {
    program.log.error('Cannot rename App ' + title + '.');
    return 1;
  }

  program.log.success('Quasar', title, oldName.green, 'renamed to', newName.green, '.');
  return 0;
}


module.exports = {
  create: create,
  rename: rename
};
