var
  log = require('./log'),
  qfs = require('./qfs'),
  spawn = require('./spawn')

module.exports = function (command, handlers) {
  if (!qfs.is.inAppFolder()) {
    log.fatal('Not in an App folder.')
    // ^^^ EARLY EXIT
  }

  spawn({
    command: 'npm',
    args: ['run', command],
    cwd: qfs.get.root()
  })
}
