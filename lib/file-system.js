'use strict';

var
  fs = require('fs'),
  fse = require('fs-extra'),
  path = require('path'),
  getRoot = require('find-root')
  ;

function getWorkingPath() {
  return process.cwd();
}

function getAppPath() {
  return getRoot(getWorkingPath());
}

function joinPath() {
  return path.normalize(path.join.apply(path, Array.prototype.slice.apply(arguments)));
}

function getPathToAsset(name) {
  return joinPath(__dirname, '../assets', name);
}

function getPathToFolderFromApp(folder) {
  return joinPath(getAppPath(), folder);
}


function copy(src, dest) {
  return fse.copySync(src, dest);
}

function remove(path) {
  return fse.removeSync(path);
}

function exists(path) {
  return fs.existsSync(path);
}

function move(src, dest) {
  /* istanbul ignore if */
  if (copy(src, dest)) {
    return 1;
  }

  /* istanbul ignore if */
  if (remove(src)) {
    return 1;
  }
}



module.exports = {
  getWorkingPath: getWorkingPath,
  joinPath: joinPath,
  getPathToAsset: getPathToAsset,
  getAppPath: getAppPath,
  getPathToFolderFromApp: getPathToFolderFromApp,

  copy: copy,
  remove: remove,
  exists: exists,
  move: move
};
