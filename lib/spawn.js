
var
  spawn = require('child_process').spawn,
  windowsPlatform = /^win/.test(process.platform)

module.exports = function (opts) {
  var
    executable = windowsPlatform ? 'cmd.exe' : opts.command,
    args = (windowsPlatform ? ['/c', opts.command] : []).concat(opts.args)

  spawn(executable, args, {
    cwd: opts.cwd,
    stdio: ['inherit', 'inherit', 'inherit']
  })
  .on('error', opts.errHandler || function () {})
  .on('close', opts.callback || function () {})
}
