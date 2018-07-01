/*
 * This file runs in a Node context (it's NOT transpiled by Babel), so use only
 * the ES6 features that are supported by your Node version. https://node.green/
 *
 * If you need proxying then make sure to enable it from
 * quasar.conf > ssr > proxy: true, otherwise this file won't be picked up by
 * the build.
 *
 * These are the proxy rules that will be supplied to http-proxy-middleware:
 * https://github.com/chimurai/http-proxy-middleware
 *
 * Example:
 *   { path: '/api', rule: {target: 'http://www.example.org', changeOrigin: true} }
 * --> this becomes (in the generated server.js):
 *   const proxy = require('http-proxy-middleware')
 *   app.use('/api', proxy(rule))
 */

module.exports = [
  // { path: '/api', rule: {...} }
]
