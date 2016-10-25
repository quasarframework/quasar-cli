module.exports = {
  finishUp: function (log) {
    let script = '"start:electron": "cd electron && npm start"';

    log()
    log('  To get started:')
    log()
    log('  ★ Change directory to the wrapper')
    log('    $ cd electron')
    log()
    log('  ★ Start the app')        
    log('    $ npm start')
    log()
    log('  ★ For convenience, add a script to package.json in your project root folder'.gray )
    log('    ' + script)
    log()
    log('  ★ To start electron app using script:')
    log('    $ npm start:electron')    
    log()
  }
}
