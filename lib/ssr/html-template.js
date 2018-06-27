const
  compileTemplate = require('lodash.template'),
  HtmlWebpackPlugin = require('html-webpack-plugin'),
  { fillHtmlTags } = require('../webpack/plugin.html-addons'),
  { fillPwaTags } = require('../webpack/pwa/plugin.html-pwa')

module.exports.getIndexHtml = function (template, cfg) {
  const compiled = compileTemplate(
    template.replace('<div id="q-app"></div>', '<!--vue-ssr-outlet-->')
  )
  let html = compiled({
    htmlWebpackPlugin: {
      options: cfg.__html.variables
    }
  })

  const data = { body: [], head: [] }

  fillHtmlTags(data, cfg)

  if (cfg.ctx.mode.pwa) {
    fillPwaTags(data, cfg)
  }

  html = HtmlWebpackPlugin.prototype.injectAssetsIntoHtml(html, {}, data)

  if (cfg.build.minify) {
    const { minify } = require('html-minifier')
    return minify(html, cfg.__html.minifyOptions)
  }
  else {
    return html
  }
}
