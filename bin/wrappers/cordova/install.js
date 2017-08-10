var
  log = require('../../../lib/log'),
  qfs = require('../../../lib/qfs'),
  spawn = require('../../../lib/spawn')

function done () {
  log()
  log('  To get started:')
  log()
  log.info('Read quick documentation on Cordova wrapper on ' + 'http://quasar-framework.org/guide/cordova-wrapper.html'.bold)
  log()
  log('  ★ Change directory to the wrapper')
  log('    $ cd cordova')
  log('  ★ ' + 'Edit config.xml'.gray)
  log('  ★ Add platforms:')
  log('    $ cordova platform add android')
  log('    $ cordova platform add ios')
  log('  ★ Run app:')
  log('    $ cordova run')
}

function install (options) {
  var
    wrapper = qfs.join(options.appPath, 'cordova'),
    www = qfs.join(options.appPath, 'cordova/www')

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
  done()
}

module.exports = function (options) {
  spawn({
    command: 'cordova',
    args: ['create', 'cordova'],
    cwd: options.appPath,
    callback: function (exitCode) {
      if (exitCode !== 0) {
        if (exitCode === -2) {
          log.error('Cordova runtime not found. Please install Cordova.')
          log.info('For instructions see: https://www.npmjs.com/package/cordova')
        }

        process.exit(exitCode)
        // ^^^ EARLY EXIT
      }

      install(options)
    }
  })
}
