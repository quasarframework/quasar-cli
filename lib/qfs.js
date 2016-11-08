var
  fs = require('fs'),
  fse = require('fs-extra'),
  path = require('path'),
  getRoot = require('find-root'),
  appRoot

function getAppRoot () {
  if (!appRoot) {
    try {
      appRoot = getRoot(process.cwd())
    }
    catch (e) {
      return
    }
  }

  if (arguments.length > 0) {
    return path.join.apply(null, [appRoot].concat([].slice.call(arguments)))
  }

  return appRoot
}

function isInAppFolder () {
  return !!getAppRoot()
}

function copy (src, dest) {
  return fse.copySync(src, dest)
}

function remove (path) {
  return fse.removeSync(path)
}

function exists () {
  return fs.existsSync(path.join.apply(null, [].slice.call(arguments)))
}

function move (src, dest) {
  /* istanbul ignore if */
  if (copy(src, dest)) {
    return 1
  }

  /* istanbul ignore if */
  if (remove(src)) {
    return 1
  }
}

function symlink (dest, src) {
  return fs.symlinkSync(dest, src)
}

function join () {
  return path.join.apply(null, arguments)
}

function resolve () {
  return path.resolve.apply(null, arguments)
}

function relative (to) {
  return path.relative(getAppRoot(), to)
}

function basename (filePath, ext) {
  return path.basename(filePath, ext)
}

function dirname (filePath) {
  return path.dirname(filePath)
}

function dirIsEmpty(dest) {
  try {
    var files = fs.readdirSync(dest)
    return files.length === 0
  } catch (err) {}
    return false
}

module.exports = {
  get: {
    root: getAppRoot
  },
  is: {
    inAppFolder: isInAppFolder
  },

  join: join,
  resolve: resolve,
  relative: relative,
  basename: basename,
  dirname: dirname,

  copy: copy,
  remove: remove,
  exists: exists,
  move: move,
  symlink: symlink,
  dirIsEmpty: dirIsEmpty
}