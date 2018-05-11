const fs = require('fs')
const appPath = require('../build/app-paths')

function isValidName (name) {
  return ['packager', 'builder'].includes(name)
}

function installBundler (name) {
  const
    spawn = require('../helpers/spawn'),
    nodePackager = require('../helpers/node-packager')
    cmdParam = nodePackager === 'npm'
      ? ['install', '--save-dev', '--save-exact']
      : ['add', '--dev', '--exact']

  log(`Installing missing Electron bundler (${name})...`)
  spawn.sync(
    nodePackager,
    cmdParam.concat([`electron-${name}@latest`]),
    appPaths.appDir,
    () => warn(`Failed to install electron-${name}`)
  )
}

function isInstalled (name) {
  return fs.existsSync(appPath.resolve.app(`node_modules/electron-${name}`))
}

module.exports.ensureInstall = function (name) {
  if (!isValidName(name)) {
    warn(`⚠️  Unknown bundler "${ name }" for Electron`)
    warn()
    process.exit(1)
  }

  if (isInstalled(name)) {
    return
  }

  installBundler(name)
}

module.exports.getDefaultName = function () {
  if (isInstalled('packager')) {
    return 'packager'
  }

  if (isInstalled('builder')) {
    return 'builder'
  }

  return 'packager'
}

module.exports.getBundler = function (name) {
  return require(appPath.resolve.app(`node_modules/electron-${name}`))
}
