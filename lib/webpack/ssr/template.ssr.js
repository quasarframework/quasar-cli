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

const rendererOptions = {
  template,
  clientManifest,
  // for component caching
  cache: LRU(<%= JSON.stringify(opts.componentCache) %>),
  basedir: __dirname,
  // recommended for performance
  runInNewContext: false
}

// https://github.com/vuejs/vue/blob/dev/packages/vue-server-renderer/README.md#why-use-bundlerenderer
let renderer = createBundleRenderer(bundle, rendererOptions)

module.exports.renderToString = function ({ req, res }, cb) {
  renderer.renderToString({
    url: req.url,
    req,
    res
  }, cb)
}

module.exports.renderToStream = function ({ req, res }) {
  return renderer.renderToSteam({
    url: req.url,
    req,
    res
  })
}

module.exports.resolveWWW = function (file) {
  return resolve('www/' + file)
}

module.exports.mergeRendererOptions = function (opts) {
  renderer = createBundleRenderer(
    bundle,
    Object.assign(rendererOptions, opts)
  )
}
