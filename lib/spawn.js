
var
  spawn = require('child_process').spawn,
  windowsPlatfrom = /^win/.test(process.platform)

module.exports = function (opts) {
  var
    executable = windowsPlatfrom ? 'cmd.exe' : opts.command,
    args = (windowsPlatfrom ? ['/c', opts.command] : []).concat(opts.args)

  spawn(executable, args, {
    cwd: opts.cwd,
    stdio: ['inherit', 'inherit', 'inherit']
  })
  .on('error', opts.errHandler || function () {})
  .on('close', opts.callback || function () {})
}
