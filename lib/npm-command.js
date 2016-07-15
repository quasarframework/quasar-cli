var
  log = require('./log'),
  qfs = require('./qfs'),
  spawn = require('./spawn')

module.exports = function (command, callback) {
  if (!qfs.is.inAppFolder()) {
    log.fatal('Not in an App folder.')
    // ^^^ EARLY EXIT
  }

  spawn({
    command: 'npm',
    args: ['run', command],
    cwd: qfs.get.root(),
    callback: callback
  })
}
