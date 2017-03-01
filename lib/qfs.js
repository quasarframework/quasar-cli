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

function isInElectronFolder () {
  return exists(getAppRoot(), 'config', 'electron.js')
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

function isEmpty (dest) {
  var stat, content

  try {
    stat = fs.statSync(dest)
  }
  catch (e) {
    return true
  }

  content = stat.isDirectory() ? fs.readdirSync(dest) : fs.readFileSync(dest)
  return !content || !content.length
}

module.exports = {
  get: {
    root: getAppRoot
  },
  is: {
    inAppFolder: isInAppFolder,
    inElectronFolder: isInElectronFolder,
    empty: isEmpty
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
  symlink: symlink
}
