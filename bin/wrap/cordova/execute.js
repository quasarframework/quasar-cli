var
  log = require('../../../lib/log'),
  qfs = require('../../../lib/qfs'),
  spawn = require('../../../lib/spawn')

module.exports = function (options, next) {
  options = options || {}; 
  var name = options.name
  var appPath = options.appPath;
  var withCrosswalk = options.withCrosswalk;

  spawn({
    command: 'cordova',
    args: ['create', 'cordova'],
    cwd: appPath,
    callback: function (exitCode) {
      if (exitCode !== 0) {
        if (exitCode === -2) {
          log.error('cordova runtime not found. Please install cordova')
          log.info('For instructions see: https://www.npmjs.com/package/cordova')          
        }          

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

      if (!withCrosswalk) {
        log()
        log.info('Crosswalk plugin NOT installed as you instructed.')
        log.info(
          'Manually install it if you decide otherwise: ' +
          '"cordova plugin add cordova-plugin-crosswalk-webview".'
        )
        next(name)
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

          next(name)
        }
      })
    }
  })
}
