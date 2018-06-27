module.exports = class PwaManifest {
  constructor (opts = {}) {
    this.manifest = JSON.stringify(opts.pwa.manifest)
  }

  apply (compiler) {
    compiler.hooks.emit.tapAsync('manifest.json', (compiler, callback) => {
      compiler.assets['manifest.json'] = {
        source: () => new Buffer(this.manifest),
        size: () => Buffer.byteLength(this.manifest)
      }

      callback()
    })
  }
}
