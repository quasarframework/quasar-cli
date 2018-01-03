const
  fs = require('fs'),
  path = require('path'),
  resolve = path.resolve,
  join = path.join

const
  getAppDir = require('./get-app-dir')

const
  appDir = getAppDir(),
  cliDir = resolve(__dirname, '../..'),
  srcDir = resolve(appDir, 'src'),
  pwaDir = resolve(appDir, 'src-pwa'),
  cordovaDir = resolve(appDir, 'src-cordova'),
  electronDir = resolve(appDir, 'src-electron')

module.exports = {
  cliDir,
  appDir,
  srcDir,
  pwaDir,
  cordovaDir,
  electronDir,

  entryTemplateFile: resolve(cliDir, 'templates/app/entry.js'),
  entryFile: resolve(appDir, '.quasar/entry.js'),

  resolve: {
    cli: dir => join(cliDir, dir),
    app: dir => join(appDir, dir),
    src: dir => join(srcDir, dir),
    pwa: dir => join(pwaDir, dir),
    cordova: dir => join(cordovaDir, dir),
    electron: dir => join(electronDir, dir)
  }
}
