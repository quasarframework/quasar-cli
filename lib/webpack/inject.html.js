const path = require('path')

const
  appPaths = require('../app-paths'),
  HtmlWebpackPlugin = require('html-webpack-plugin'),
  HtmlAddonsPlugin = require('./plugin.html-addons')

module.exports = function (chain, cfg) {
  chain.plugin('html-webpack')
    .use(HtmlWebpackPlugin, [{
      filename: cfg.ctx.dev
        ? 'index.html'
        : path.join(cfg.build.distDir, cfg.build.htmlFilename),
      template: appPaths.resolve.app(cfg.sourceFiles.indexHtmlTemplate),
      minify: cfg.build.minify
        ? {
          removeComments: true,
          collapseWhitespace: true,
          removeAttributeQuotes: true
          // more options:
          // https://github.com/kangax/html-minifier#options-quick-reference
        }
        : undefined,

      chunksSortMode: 'none',
      // inject script tags for bundle
      inject: true,
      cache: true,

      // custom ones
      ctx: cfg.ctx,
      productName: cfg.build.productName,
      productDescription: cfg.build.productDescription
    }])

  chain.plugin('html-addons')
    .use(HtmlAddonsPlugin, [ cfg ])
}
