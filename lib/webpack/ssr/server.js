const
  nodeExternals = require('webpack-node-externals'),
  VueSSRServerPlugin = require('vue-server-renderer/server-plugin')

module.exports = function (chain, cfg) {
  chain.entry('app')
    .clear()
    .add(appPaths.resolve.app('.quasar/entry-server.js'))

  chain.target('node')
  chain.devtool('#source-map')

  chain.output
    .filename('server-bundle.js')
    .libraryTarget('commonjs2')

  chain.resolve.alias
    .merge({
      quasar: appPaths.resolve.app(`node_modules/quasar-framework/dist/quasar.${cfg.ctx.themeName}.common.js`)
    })

  chain.plugin('define')
    .tap(args => {
      const { 'process.env': env, ...rest } = args[0]
      return [{
        'process.env': Object.assign(
          {},
          env,
          { CLIENT: false, SERVER: true }
        ),
        ...rest
      }]
    })

  chain.externals(nodeExternals({
    // do not externalize CSS files in case we need to import it from a dep
    whitelist: /(\.css$|quasar-framework\/src|quasar-framework\/i18n\/|quasar-framework\/icons\/)/
  }))

  chain.plugin('vue-ssr-client')
    .use(VueSSRServerPlugin, [{
      filename: '../vue-ssr-server-bundle.json'
    }])

  if (cfg.ctx.prod) {
    const SsrProdArtifacts = require('./plugin.ssr-prod-artifacts')
    chain.plugin('ssr-artifacts')
      .use(SsrProdArtifacts, [ cfg ])

    // copy src-ssr to dist folder in /server
    const CopyWebpackPlugin = require('copy-webpack-plugin')
    chain.plugin('copy-webpack')
      .use(CopyWebpackPlugin, [
        [{
          from: cfg.ssr.__dir,
          to: '../server',
          ignore: ['.*']
        }]
      ])
  }
}
