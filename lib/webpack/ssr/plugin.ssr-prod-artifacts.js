const
  fs = require('fs'),
  path = require('path')

const
  appPaths = require('../../app-paths'),
  compileTemplate = require('lodash.template'),
  { getIndexHtml } = require('../../ssr/html-template')

module.exports = class SsrProdArtifacts {
  constructor (cfg = {}) {
    this.cfg = cfg
  }

  apply (compiler) {
    compiler.hooks.emit.tapAsync('ssr-artifacts', (compiler, callback) => {
      /*
       * index.template.html
       */
      const htmlFile = appPaths.resolve.app(this.cfg.sourceFiles.indexHtmlTemplate)
      this.htmlTemplate = getIndexHtml(fs.readFileSync(htmlFile, 'utf-8'), this.cfg)

      compiler.assets['../template.html'] = {
        source: () => new Buffer(this.htmlTemplate),
        size: () => Buffer.byteLength(this.htmlTemplate)
      }

      /*
       * server.js
       */
      const serverTemplate = path.join(__dirname, 'template.server.js')
      const serverFile = compileTemplate(
        fs.readFileSync(serverTemplate, 'utf-8'),
        { interpolate: /<%([\s\S]+?)%>/g }
      )()

      compiler.assets['../server.js'] = {
        source: () => new Buffer(serverFile),
        size: () => Buffer.byteLength(serverFile)
      }

      callback()
    })
  }
}
