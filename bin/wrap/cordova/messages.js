module.exports = {
  finishUp: function (log) {
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
  }
}
