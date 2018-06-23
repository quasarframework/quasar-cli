module.exports = class PwaManifest {
  constructor (opts = {}) {
    this.opts = opts
  }

  apply (compiler) {
    compiler.hooks.emit.tapAsync('manifest.json', (compiler, callback) => {
      const source = JSON.stringify(this.opts.manifest)

      compiler.assets['manifest.json'] = {
        source: () => new Buffer(source),
        size: () => Buffer.byteLength(source)
      }

      callback()
    })
  }
}
