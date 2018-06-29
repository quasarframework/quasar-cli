const { green, grey } = require('chalk')
const
  appPaths = require('../app-paths'),
  {
    version,
    dependencies: { 'quasar-framework': quasarVersion }
  } = require(appPaths.resolve.cli('package.json'))

module.exports = function (argv, cmd) {
  console.log(`
 CLI mode..........${green(argv.mode.toUpperCase())}
 Quasar theme......${green(argv.theme)}
 Quasar CLI........${green('v' + version)}
 Quasar Framework..${green('v' + quasarVersion)}
 Debugging.........${cmd === 'dev' || argv.debug ? green('enabled') : grey('no')}
  `)
}
