const
  appPaths = require('./app-paths')

module.exports = class ElectronPackageJson {
  apply (compiler) {
    compiler.hooks.emit.tapAsync('package.json', (compiler, callback) => {
      const pkg = require(appPaths.resolve.app('package.json'))

      pkg.dependencies = pkg.dependencies
      pkg.main = './electron-main.js'
      const source = JSON.stringify(pkg)

      compiler.assets['package.json'] = {
        source: () => new Buffer(source),
        size: () => Buffer.byteLength(source)
      }

      callback()
    })
  }
}
