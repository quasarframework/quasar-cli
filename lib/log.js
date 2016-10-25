require('colors')

var
  symbols = require('log-symbols'),
  messageTypes = {
    success: symbols.success,
    error: symbols.error,
    info: symbols.info,
    warning: symbols.warning,
    debug: '[DEBUG]'.gray 
  },
  log

function showMessage () {
  var
    array,
    args = [].slice.call(arguments)

  if (args[0].length === 0) {
    return console.log()
  }

  array = [].slice.call(args[0])

  if (args.length === 2) {
    array.unshift(args[1])
  }

  console.log.apply(console, array)
}

log = function () {
  showMessage(arguments)
}

log.fatal = function (message, errorCode) {
  log.error(message)
  process.exit(errorCode || 1)
}

Object.keys(messageTypes).forEach(function (name) {
  log[name] = function () {
    showMessage(arguments, ' ' + messageTypes[name])
  }
})

module.exports = log
