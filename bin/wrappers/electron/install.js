var
  path = require('path'),
  download = require('download-github-repo'),
  ora = require('ora'),
  uid = require('uid'),
  log = require('../../../lib/log'),
  qfs = require('../../../lib/qfs')

function generate (src, dest) {
  qfs.copy(path.join(src, 'template'), dest)

  log()
  log.success('Elecron wrapper created at', dest.yellow)
  log()
  log('  To get started:')
  log()
  log('  ★ Change directory to the wrapper')
  log('    $ cd electron')
  log()
  log('  ★ Edit ' + 'package.json'.yellow + ' and ' + 'electron.js'.yellow)
  log()
  log('  ★ Install dependencies')
  log('    $ npm install')
  log()
  log('  To start Electron app in "dev" mode:')
  log('    Make sure you keep running (from root project folder): $ quasar dev')
  log('    Then from wrapper folder: $ npm run dev')
  log()
  log('  Building Electron app for production:')
  log('  Make sure you build Quasar app from root project')
  log('  folder before packaging it with Electron')
  log('  Then from Electron wrapper folder:')
  log('    $ npm run build')
  log()
  log('    # Build for specific platform only:'.gray)
  log('    $ npm run build <platform>')
  log('    # Example: $ npm run build linux')
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
