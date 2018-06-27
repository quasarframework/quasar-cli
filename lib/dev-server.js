const
  fs = require('fs'),
  path = require('path'),
  opn = require('opn'),
  webpack = require('webpack'),
  WebpackDevServer = require('webpack-dev-server')

const
  appPaths = require('./app-paths'),
  log = require('./helpers/logger')('app:dev-server')

let alreadyNotified = false

module.exports = class DevServer {
  constructor (quasarConfig) {
    this.quasarConfig = quasarConfig
  }

  async listen () {
    const
      webpackConfig = this.quasarConfig.getWebpackConfig(),
      cfg = this.quasarConfig.getBuildConfig()

    log(`Booting up...`)
    log()

    return new Promise((resolve, reject) => (
      cfg.ctx.mode.ssr
        ? this.listenSSR(webpackConfig, cfg, resolve)
        : this.listenCSR(webpackConfig, cfg, resolve)
    ))
  }

  listenCSR (webpackConfig, cfg, resolve) {
    const compiler = webpack(webpackConfig.renderer || webpackConfig)
    compiler.hooks.done.tap('dev-server-done-compiling', compiler => {
      if (this.__started) { return }

      // start dev server if there are no errors
      if (compiler.compilation.errors && compiler.compilation.errors.length > 0) {
        return
      }

      this.__started = true

      this.server.listen(cfg.devServer.port, cfg.devServer.host, () => {
        resolve()

        if (alreadyNotified) { return }
        alreadyNotified = true

        if (cfg.devServer.open && ['spa', 'pwa'].includes(cfg.ctx.modeName)) {
          opn(cfg.build.APP_URL)
        }
      })
    })

    // start building & launch server
    this.server = new WebpackDevServer(compiler, cfg.devServer)
  }

  listenSSR (webpackConfig, cfg, resolve) {
    const
      fs = require('fs'),
      LRU = require('lru-cache'),
      express = require('express'),
      chokidar = require('chokidar'),
      { createBundleRenderer } = require('vue-server-renderer')

    let renderer
    const
      { getIndexHtml } = require('./ssr/html-template'),
      templatePath = appPaths.resolve.src('index.template.html')

    function createRenderer (bundle, options) {
      // https://github.com/vuejs/vue/blob/dev/packages/vue-server-renderer/README.md#why-use-bundlerenderer
      return createBundleRenderer(bundle, Object.assign(options, {
        // for component caching
        cache: LRU({
          max: 1000,
          maxAge: 1000 * 60 * 15
        }),
        // this is only needed when vue-server-renderer is npm-linked
        basedir: resolve('./dist'),
        // recommended for performance
        runInNewContext: false
      }))
    }

    const serve = (path, cache) => express.static(appPaths.resolve.src(path), {
      maxAge: 0
    })

    // app.use(compression({ threshold: 0 }))
    // app.use(favicon(appPaths.resolve.src('statics/logo-48.png')))
    // app.use('/dist', serve('./dist', true))
    // >>>> app.use('/statics', serve('statics', true))
    // app.use('/manifest.json', serve('./manifest.json', true))
    // app.use('/service-worker.js', serve('./dist/service-worker.js'))

    // since this app has no user-specific content, every page is micro-cacheable.
    // if your app involves user-specific content, you need to implement custom
    // logic to determine whether a request is cacheable based on its url and
    // headers.
    // 1-second microcache.
    // https://www.nginx.com/blog/benefits-of-microcaching-nginx/
    // app.use(microcache.cacheSeconds(1, req => req.originalUrl))

    function render (req, res) {
      const startTime = Date.now()

      res.setHeader('Content-Type', 'text/html')

      const handleError = err => {
        if (err.url) {
          res.redirect(err.url)
        }
        else if (err.code === 404) {
          res.status(404).send('404 | Page Not Found')
        }
        else {
          // Render Error Page or Redirect
          res.status(500).send(`
            <html>
              <head>
                <title>500 | Internal Server Error</title>
              </head>
              <body>
                <div>500 | Internal Server Error</div>
                <div>
                  <pre>${err.stack}</pre>
                </div>
              </body>
            </html>
          `)
          console.error(`${req.url} -> error during render`)
          console.error(err.stack)
        }
      }

      const context = {
        title: 'Quasar', // default title
        url: req.url,
        req,
        res,
        bodyClasses: '',
        htmlAttrs: ''
      }
      renderer.renderToString(context, (err, html) => {
        if (err) {
          return handleError(err)
        }
        res.send(html)
        console.log(`${req.url} -> request took: ${Date.now() - startTime}ms`)
      })
    }

    let
      bundle,
      template,
      clientManifest,
      pwa

    let ready
    const readyPromise = new Promise(r => { ready = r })
    function update () {
      if (bundle && clientManifest) {
        renderer = createRenderer(bundle, {
          template,
          clientManifest
        })
        ready()
      }
    }

    // read template from disk and watch
    function getTemplate () {
      return getIndexHtml(fs.readFileSync(templatePath, 'utf-8'), cfg)
    }

    template = getTemplate()
    chokidar.watch(templatePath).on('change', () => {
      template = getTemplate()
      console.log('index.template.html template updated.')
      update()
    })

    const compiler = webpack([
      webpackConfig.server,
      webpackConfig.client
    ])

    compiler.compilers[0].hooks.done.tapAsync('done-compiling', ({ compilation: { errors, warnings, assets }}, cb) => {
      console.log('DONE COMPILING SERVER')
      errors.forEach(err => console.error(err))
      warnings.forEach(err => console.warn(err))

      if (errors.length > 0) { return }

      bundle = JSON.parse(assets['vue-ssr-server-bundle.json'].source())
      update()

      cb()
    })

    compiler.compilers[1].hooks.done.tapAsync('done-compiling', ({ compilation: { errors, warnings, assets }}, cb) => {
      console.log('DONE COMPILING CLIENT')
      errors.forEach(err => console.error(err))
      warnings.forEach(err => console.warn(err))

      if (errors.length > 0) { return }

      if (cfg.ctx.mode.pwa) {
        pwa = {
          manifest: assets['manifest.json'].source(),
          serviceWorker: assets['service-worker.js'].source()
        }
      }

      clientManifest = JSON.parse(assets['vue-ssr-client-manifest.json'].source())
      update()

      cb()
    })

    // start building & launch server
    this.server = new WebpackDevServer(compiler, Object.assign(
      {
        after: app => {
          if (cfg.ctx.mode.pwa) {
            app.use('/manifest.json', (req, res) => {
              res.setHeader('Content-Type', 'application/json')
              res.send(pwa.manifest)
            })
            app.use('/service-worker.js', (req, res) => {
              res.setHeader('Content-Type', 'text/javascript')
              res.send(pwa.serviceWorker)
            })
          }
          app.use('/statics', serve('statics', true))
          app.get('*', render)
        }
      },
      cfg.devServer
    ))

    readyPromise.then(() => {
      this.server.listen(cfg.devServer.port, cfg.devServer.host, () => {
        console.log(`server started at localhost:${cfg.devServer.port}`)
        resolve()
      })
    })
  }

  stop () {
    if (this.server) {
      log(`Shutting down`)
      this.server.close()
      this.server = null
    }
  }
}
