const
  appPaths = require('../app-paths'),
  injectClientSpecifics = require('../inject.client-specifics'),
  injectHotUpdate = require('../inject.hot-update'),
  injectPreload = require('../inject.preload'),
  VueSSRClientPlugin = require('vue-server-renderer/client-plugin')

module.exports = function (chain) {
  chain.entry('app')
    .clear()
    .add(appPaths.resolve.app('.quasar/ssr/entry-client.js'))

  injectClientSpecifics(chain, cfg)
  injectHotUpdate(chain, cfg)
  injectPreload(chain, cfg)

  chain.plugin('vue-ssr-client')
    .use(VueSSRClientPlugin)
}
