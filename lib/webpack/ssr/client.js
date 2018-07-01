const
  appPaths = require('../../app-paths'),
  injectClientSpecifics = require('../inject.client-specifics'),
  injectHotUpdate = require('../inject.hot-update'),
  VueSSRClientPlugin = require('vue-server-renderer/client-plugin')

module.exports = function (chain, cfg) {
  chain.entry('app')
    .clear()
    .add(appPaths.resolve.app('.quasar/entry-client.js'))

  injectClientSpecifics(chain, cfg)
  injectHotUpdate(chain, cfg)

  chain.plugin('vue-ssr-client')
    .use(VueSSRClientPlugin, [{
      filename: '../vue-ssr-client-manifest.json'
    }])

  if (cfg.ctx.prod && (cfg.ssr.customServer || cfg.ssr.proxy || cfg.ssr.https)) {
    chain.plugin('copy-webpack')
      .tap(args => {
        if (cfg.ssr.customServer) {
          args[0].push({
            from: appPaths.resolve.ssr('custom-server.js'),
            to: '../server.js'
          })
        }
        else {
          cfg.ssr.proxy && args[0].push({
            from: appPaths.resolve.ssr('proxy-definitions.js'),
            to: '..'
          })

          cfg.ssr.https && args[0].push(
            {
              from: cfg.ssr.https.key,
              to: '../key.pem'
            },
            {
              from: cfg.ssr.https.cert,
              to: '../cert.pem'
            }
          )
        }

        return args
      })
  }
}
