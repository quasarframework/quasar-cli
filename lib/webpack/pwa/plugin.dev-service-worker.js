const
  fs = require('fs'),
  appPaths = require('../../app-paths')

const resetScript = fs.readFileSync(
  appPaths.resolve.cli('templates/pwa-dev/service-worker-dev.js'),
  'utf-8'
)

module.exports = class DevServiceWorker {
  constructor (opts = {}) {
    this.opts = opts
  }

  apply (compiler) {
    compiler.hooks.emit.tapAsync('service-worker-dev', (compiler, callback) => {
      const source = JSON.stringify(this.opts.manifest)

      compiler.assets['service-worker.js'] = {
        source: () => new Buffer(resetScript),
        size: () => Buffer.byteLength(resetScript)
      }

      callback()
    })
  }
}
