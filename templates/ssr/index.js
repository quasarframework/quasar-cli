/*
 * This file runs in a Node context (it's NOT transpiled by Babel), so use only
 * the ES6 features that are supported by your Node version. https://node.green/
 *
 * All content of this folder will be copied as is to the output folder. So only import:
 *  1. node_modules (and add your deps through quasar.conf > ssr > extendPackageJson(pkg))
 *  2. create files in this folder and import only those with the relative path
 *
 * Example adding a dependency to the generated package.json:
 *   // quasar.conf
 *   module.exports = function (ctx) {
 *     return {
 *       // ...
 *       ssr: {
 *         extendPackageJson (pkg) {
 *           // adds "my-dep" npm package version 1.0.2
 *           pkg.dependencies['my-dep'] = '1.0.2'
 *         }
 *       }
 *     }
 *   }
 *
 * Note: This file is used only for PRODUCTION. It is not picked up while in dev mode.
 */

const
  fs = require('fs'),
  express = require('express'),
  compression = require('compression')

const
  ssr = require('../ssr'),
  app = express(),
  port = process.env.PORT || 3000

const serve = (path, cache) => express.static(ssr.resolveWWW(path), {
  maxAge: cache ? 1000 * 60 * 60 * 24 * 30 : 0
})

// gzip
app.use(compression({ threshold: 0 }))

// serve this with no cache, if it exists:
if (fs.existsSync(ssr.resolveWWW('service-worker.js'))) {
  app.use('/service-worker.js', serve('service-worker.js'))
}

// serve "www" folder
app.use('/', serve('.', true))

// this should be last get(), rendering with SSR
app.get('*', (req, res) => {
  res.setHeader('Content-Type', 'text/html')
  ssr.renderToString({ req, res }, (err, html) => {
    if (err) {
      if (err.url) {
        res.redirect(err.url)
      }
      else if (err.code === 404) {
        res.status(404).send('404 | Page Not Found')
      }
      else {
        // Render Error Page or Redirect
        res.status(500).send('500 | Internal Server Error')
      }
    }
    else {
      res.send(html)
    }
  })
})

// finally, start listening
app.listen(port, () => {
  console.log(`Server started at port ${port}\n`)
})
