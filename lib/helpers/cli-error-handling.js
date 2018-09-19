const
  PrettyError = require('pretty-error'),
  pe = PrettyError.start()

pe.skipPackage('regenerator-runtime')
pe.skipPackage('babel-runtime')
pe.skipNodeFiles()

let ouchInstance

module.exports.getOuchInstance = function () {
  if (ouchInstance) {
    return ouchInstance
  }

  const Ouch = require('ouch')
  ouchInstance = (new Ouch()).pushHandler(
    new Ouch.handlers.PrettyPageHandler('orange', null, 'sublime')
  )

  return ouchInstance
}
