const
  logger = require('./logger'),
  log = logger('app:spawn'),
  warn = logger('app:spawn', 'red'),
  spawn = require('cross-spawn')

/*
 Returns pid, takes onClose
 */
module.exports = function (cmd, params, cwd, onClose) {
  log(`Running "${cmd} ${params.join(' ')}"`)
  log()

  const runner = spawn(
    cmd,
    params,
    { stdio: 'inherit', stdout: 'inherit', stderr: 'inherit', cwd }
  )

  runner.on('close', code => {
    log()
    if (code) {
      log(`Command "${cmd}" failed with exit code: ${code}`)
    }

    onClose && onClose(code)
  })

  return runner.pid
}

/*
 Returns nothing, takes onFail
 */
module.exports.sync = function (cmd, params, cwd, onFail) {
  log(`[sync] Running "${cmd} ${params.join(' ')}"`)
  log()

  const runner = spawn.sync(
    cmd,
    params,
    { stdio: 'inherit', stdout: 'inherit', stderr: 'inherit', cwd }
  )

  if (runner.status) {
    warn()
    warn(`Command "${cmd}" failed with exit code: ${runner.status}`)
    onFail && onFail()
    process.exit(1)
  }
}
