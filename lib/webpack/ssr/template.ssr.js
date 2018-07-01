/**
 * THIS FILE IS GENERATED AUTOMATICALLY.
 * DO NOT EDIT.
 **/

const
  fs = require('fs'),
  path = require('path'),
  LRU = require('lru-cache'),
  { createBundleRenderer } = require('vue-server-renderer')

const
  resolve = file => path.join(__dirname, file),
  template = fs.readFileSync(resolve('template.html'), 'utf-8'),
  bundle = require('./vue-ssr-server-bundle.json'),
  clientManifest = require('./vue-ssr-client-manifest.json')

// https://github.com/vuejs/vue/blob/dev/packages/vue-server-renderer/README.md#why-use-bundlerenderer
const renderer = createBundleRenderer(bundle, {
  template,
  clientManifest,
  // for component caching
  cache: LRU(<%= JSON.stringify(opts.componentCache) %>),
  basedir: __dirname,
  // recommended for performance
  runInNewContext: false
})

module.exports.render = function ({ req, res, ssrContext }, cb) {
  const context = Object.assign({
    url: req.url,
    req,
    res
  }, ssrContext)

  renderer.renderToString(context, cb)
}

module.exports.resolveWWW = function (file) {
  return resolve('www/' + file)
}
