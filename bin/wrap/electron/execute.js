var
  path = require('path'), 
  log = require('../../../lib/log'),
  qfs = require('../../../lib/qfs'),
  spawn = require('../../../lib/spawn'),
  install = require('spawn-npm-install')

module.exports = function (options, next) {
  var name = options.name
  var appPath = options.appPath
  var 
    electron = {
      srcPath: path.join(__dirname, 'files'),      
      destPath: path.join(appPath, 'electron')
    }

  if (qfs.exists(electron.destPath)) {
    log.fatal('electron wrapper folder "' + electron.destPath + '" already exists.')
  }

  // copy electron.js to root 
  qfs.copy(electron.srcPath, electron.destPath)

  spawn({
    command: 'npm',
    args: ['i'],
    cwd: electron.destPath,
    callback: function (exitCode) {
      if (exitCode === 0) {
        log()
        // log.success('Electron installed.\n')
        next(name)
      } else {
        log.error('Error installing electron modules')
      }      
    }
  })
}
