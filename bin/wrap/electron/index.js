var
  path = require('path'), 
  log = require('../../../lib/log'),
  qfs = require('../../../lib/qfs'),
  spawn = require('../../../lib/spawn')

module.exports = function (options) {
  log('Wrapping Quasar app with Electron')

  var 
    electron = {
      srcPath: path.join(__dirname, 'files', 'electron.js'),      
      destPath: path.join(appPath, 'electron.js')
    }

  let script = '"start:electron": "electron electron.js"';
  log('Add a ' + script + ' to package.json for convenience')
  log('Run:')
  log('npm run start:electron')

  // copy electron.js to root 
  qfs.copy(electron.srcPath, electron.destPath)

  // install electron dependencies to package.json
  // "electron": "^1.4.3",
  // "electron-reload": "^1.0.2",
  spawn({
    command: 'npm',
    args: ['install', 'electron', 'electron-reload', '--save-dev'],
    cwd: appPath,
    callback: function (exitCode) {
      if (exitCode !== 0) {
        process.exit(exitCode)
        // ^^^ EARLY EXIT
      }

      // success
      process.exit(0)
    }
  })
}