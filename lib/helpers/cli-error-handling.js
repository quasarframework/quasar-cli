const
  PrettyError = require('pretty-error'),
  pe = PrettyError.start()

pe.skipPackage('regenerator-runtime')
pe.skipPackage('babel-runtime')
pe.skipNodeFiles()

let OuchErrorHandler

module.exports.switchToOuch = function () {
  if (OuchErrorHandler) {
    return OuchErrorHandler
  }

  PrettyError.stop()
  const Ouch = require('ouch')

  OuchErrorHandler = (new Ouch()).pushHandler(
    new Ouch.handlers.PrettyPageHandler('orange', null, 'sublime')
  )

  return OuchErrorHandler
}
