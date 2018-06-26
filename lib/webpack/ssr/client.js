const
  appPaths = require('../../app-paths'),
  injectClientSpecifics = require('../inject.client-specifics'),
  // injectHotUpdate = require('../inject.hot-update'),
  // injectPreload = require('../inject.preload'),
  VueSSRClientPlugin = require('vue-server-renderer/client-plugin')

module.exports = function (chain, cfg) {
  chain.entry('app')
    .clear()
    .add(appPaths.resolve.app('.quasar/entry-client.js'))

  chain.plugin('define')
    .tap(args => {
      const { 'process.env': env, ...rest } = args[0]
      return [{
        'process.env': Object.assign(
          { VUE_ENV: '"client"' },
          env
        ),
        ...rest
      }]
    })

  injectClientSpecifics(chain, cfg)
  // injectHotUpdate(chain, cfg)
  // injectPreload(chain, cfg)

  chain.plugin('vue-ssr-client')
    .use(VueSSRClientPlugin)
}
