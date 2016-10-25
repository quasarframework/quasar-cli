var
  path = require('path'),
  log = require('../../../lib/log'),
  qfs = require('../../../lib/qfs'),
  spawn = require('../../../lib/spawn')

module.exports = function (options) {
  var
    appPath = options.appPath,
    src = path.join(__dirname, 'files'),
    dest = path.join(appPath, 'electron')

  // copy electron.js to root
  qfs.copy(src, dest)

  spawn({
    command: 'npm',
    args: ['i'],
    cwd: dest,
    callback: function (exitCode) {
      if (exitCode !== 0) {
        log.error('Error installing electron modules.')
        return
      }

      log()
      log.success('Elecron wrapper created at', dest.yellow + '\n')
      log()
      log('  To get started:')
      log()
      log('  ★ Change directory to the wrapper')
      log('    $ cd electron')
      log()
      log('  ★ Start the app')
      log('    $ npm start')
      log()
      log('  ★ For convenience, add a script to package.json in your project root folder'.gray)
      log('    "electron": "cd electron && npm start"')
      log()
      log('  ★ To start electron app using script:')
      log('    $ npm start:electron')
      log()
    }
  })
}
