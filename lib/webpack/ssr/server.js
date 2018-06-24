const
  nodeExternals = require('webpack-node-externals'),
  VueSSRServerPlugin = require('vue-server-renderer/server-plugin')

module.exports = function (chain, cfg) {
  chain.entry('app')
    .clear()
    .add(appPaths.resolve.app('.quasar/ssr/entry-server.js'))

  chain.target('node')
  chain.devtool('#source-map')

  chain.output
    .filename('server-bundle.js')
    .libraryTarget('commonjs2')

  chain.externals(nodeExternals({
    // do not externalize CSS files in case we need to import it from a dep
    whitelist: /\.css$/
  }))

  chain.plugin('vue-ssr-client')
    .use(VueSSRServerPlugin)
}
