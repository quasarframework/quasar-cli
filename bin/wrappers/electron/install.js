var
  path = require('path'),
  download = require('download-git-repo'),
  ora = require('ora'),
  uid = require('uid'),
  log = require('../../../lib/log'),
  qfs = require('../../../lib/qfs')

function generate (src, dest) {
  qfs.copy(path.join(src, 'template'), dest)

  log()
  log.success('Elecron wrapper created at', dest.yellow)
  log.info('Read quick documentation on Electron wrapper on ' + 'http://quasar-framework.org/guide/electron-wrapper.html'.bold)
  log()
  log('  ★ Change directory to the wrapper')
  log('    $ cd electron')
  log('  ★ ' + 'Edit config/electron.js'.gray)
  log('  ★ Install dependencies')
  log('    $ npm install')
  log()
}

module.exports = function (options) {
  var
    appPath = options.appPath,
    src = '/tmp/quasar-electron-template-' + uid(),
    dest = path.join(appPath, 'electron'),
    spinner = ora('Downloading Quasar Electron template...')

  spinner.start()
  download(
    'quasarframework/electron-wrapper',
    src,
    function (err) {
      spinner.stop()
      process.on('exit', function () {
        qfs.remove(src)
      })

      if (err) {
        if (err === 404) {
          log.fatal('Electron wrapper template may have moved. Please update to latest Quasar CLI.')
          // ^^^ EARLY EXIT
        }

        log.fatal('Failed to download Quasar Electron App template: ' + err)
        // ^^^ EARLY EXIT
      }

      log.success('Downloaded Quasar Electron App template.')
      generate(src, dest)
    }
  )
}
