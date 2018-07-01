const { green, grey, underline } = require('chalk')
const
  appPaths = require('../app-paths'),
  {
    version,
    dependencies: { 'quasar-framework': quasarVersion }
  } = require(appPaths.resolve.cli('package.json'))

module.exports = function (argv, cmd, details) {
  let banner = ''

  if (details) {
    banner += `
 ${underline('Build succeeded')}
`
  }

  banner += `
 ${cmd === 'dev' ? 'Dev mode..........' : 'Build mode........'} ${green(argv.mode)}
 Quasar theme...... ${green(argv.theme)}
 Quasar CLI........ ${green('v' + version)}
 Quasar Framework.. ${green('v' + quasarVersion)}
 Debugging......... ${cmd === 'dev' || argv.debug ? green('enabled') : grey('no')}`

  if (details) {
    banner += `
 ==================
 Output folder..... ${green(details.outputFolder)}`

    if (argv.mode === 'ssr') {
      banner += `

 Tip: Run "$ node server.js" from the output folder.
      You can also add an npm script to your package.json like this:
        "start": "node <folder>/server.js" where <folder> is the output

 Tip: The "server.js" needs to run inside of your project folder, otherwise
      you'll need to npm init and install all the deps of server.js in the
      output folder.`
    }
    else if (argv.mode === 'cordova') {
      banner += `

 Tip: "src-cordova" is a Cordova project folder, so everything you know
      about Cordova applies to it. Quasar CLI only generates the content
      for "src-cordova/www" folder and then Cordova takes over and builds
      the mobile app.

 Tip: Feel free to use Cordova CLI or change any files in "src-cordova",
      except for "www" folder which must be built by Quasar CLI.`
    }
    else if (['spa', 'pwa'].includes(argv.mode)) {
      banner += `

 Tip: Built files are meant to be served over an HTTP server
      Opening index.html over file:// won't work

 Tip: You can use "$ quasar serve" command to create a web server,
      both for testing or production. Type "$ quasar serve -h" for
      parameters. Also, an npm script (usually named "start") can
      be added for deployment environments.`
    }
  }

  console.log(banner + '\n')
}
