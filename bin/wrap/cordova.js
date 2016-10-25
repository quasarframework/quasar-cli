var
  log = require('../../lib/log'),
  qfs = require('../../lib/qfs'),
  spawn = require('../../lib/spawn')

module.exports = function (options) {
  options = options || {}; 
  appPath = options.appPath;
  withCrosswalk = options.withCrosswalk;

  spawn({
    command: 'cordova',
    args: ['create', 'cordova'],
    cwd: appPath,
    callback: function (exitCode) {
      if (exitCode !== 0) {
        process.exit(exitCode)
        // ^^^ EARLY EXIT
      }

      var
        wrapper = qfs.join(appPath, 'cordova'),
        www = qfs.join(appPath, 'cordova/www')

      if (qfs.remove(www)) {
        log.fatal('Cannot remove "www" folder.')
        // ^^^ EARLY EXIT
      }

      if (qfs.symlink('../dist', www)) {
        log.fatal('Cannot create symlink.')
        // ^^^ EARLY EXIT
      }

      log()
      log.success('Cordova wrapper created at', wrapper.yellow + '\n')

      function finishUp () {
        log()
        log('  To get started:')
        log()
        log('  ★ Change directory to the wrapper')
        log('    $ cd cordova')
        log('  ★ ' + 'Edit config.xml'.gray)
        log('  ★ Add platforms:')
        log('    $ cordova platform add android')
        log('    $ cordova platform add ios')
        log('  ★ Run app:')
        log('    $ cordova run')

        process.exit(0)
      }

      if (!withCrosswalk) {
        log()
        log.info('Crosswalk plugin NOT installed as you instructed.')
        log.info(
          'Manually install it if you decide otherwise: ' +
          '"cordova plugin add cordova-plugin-crosswalk-webview".'
        )
        finishUp()
        process.exit(0)
        // ^^^ EARLY EXIT
      }

      spawn({
        command: 'cordova',
        args: ['plugin', 'add', 'cordova-plugin-crosswalk-webview'],
        cwd: wrapper,
        callback: function (exitCode) {
          if (exitCode === 0) {
            log()
            log.success('Plugin installed.\n')
          }

          finishUp()
        }
      })
    }
  })
}
