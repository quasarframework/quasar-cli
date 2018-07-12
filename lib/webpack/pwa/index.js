const
  appPaths = require('../../app-paths'),
  PwaManifestPlugin = require('./plugin.pwa-manifest')

module.exports = function (chain, cfg) {
  // write manifest.json file
  chain.plugin('pwa-manifest')
    .use(PwaManifestPlugin, [ cfg ])

  let defaultOptions
  const
    WorkboxPlugin = require('workbox-webpack-plugin'),
    pluginMode = cfg.pwa.workboxPluginMode,
    log = require('../../helpers/logger')('app:workbox')

  if (pluginMode === 'GenerateSW') {
    const pkg = require(appPaths.resolve.app('package.json'))

    defaultOptions = {
      cacheId: pkg.name || 'quasar-pwa-app'
    }

    log('[GenerateSW] Will generate a service-worker file. Ignoring your custom written one.')
  }
  else {
    defaultOptions = {
      swSrc: appPaths.resolve.app(cfg.sourceFiles.serviceWorker)
    }

    log('[InjectManifest] Using your custom service-worker written file')
  }

  let finalOptions = Object.assign(
    defaultOptions,
    cfg.pwa.workboxOptions,
    { swDest: 'service-worker.js' }
  )

  if (cfg.ctx.dev) {
    log('⚠️  Forcing PWA into the network-first approach to not break Hot Module Replacement while developing.')
    // forcing network-first strategy
    finalOptions.chunks = [ 'quasar-bogus-chunk' ]
    if (finalOptions.excludeChunks) {
      delete finalOptions.excludeChunks
    }

    if (pluginMode === 'GenerateSW') {
      finalOptions.runtimeCaching = finalOptions.runtimeCaching || []
      finalOptions.runtimeCaching.push({
        urlPattern: /^http/,
        handler: 'networkFirst'
      })
    }
  }

  chain.plugin('workbox')
    .use(WorkboxPlugin[pluginMode], [ finalOptions ])

  if (!cfg.ctx.mode.ssr) {
    const HtmlPwaPlugin = require('./plugin.html-pwa').plugin
    chain.plugin('html-pwa')
      .use(HtmlPwaPlugin, [ cfg ])
  }
}
