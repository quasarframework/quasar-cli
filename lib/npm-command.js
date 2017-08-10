var
  log = require('./log'),
  qfs = require('./qfs'),
  spawn = require('./spawn')

module.exports = function () {
  if (!qfs.is.inAppFolder()) {
    log.fatal('Not in an App folder.')
    // ^^^ EARLY EXIT
  }

  var args = [].slice.call(arguments).filter(function (item) {
    return typeof item !== 'undefined'
  })

  spawn({
    command: 'npm',
    args: ['run'].concat(args),
    cwd: qfs.get.root(),
    errHandler: function () {
      process.exit(1)
    },
    callback: function (code) {
      if (code !== 0) {
        process.exit(1)
      }
    }
  })
}
