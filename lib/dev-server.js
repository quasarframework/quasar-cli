const
  fs = require('fs'),
  path = require('path'),
  opn = require('opn'),
  webpack = require('webpack')

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
    const webpackDevServer = require('webpack-dev-server')

    this.compiler = webpack(webpackConfig.renderer || webpackConfig)
    this.compiler.hooks.done.tap('dev-server-done-compiling', compiler => {
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
    this.server = new webpackDevServer(this.compiler, cfg.devServer)
  }

  listenSSR (webpackConfig, cfg, resolve) {
    const
      fs = require('fs'),
      path = require('path'),
      LRU = require('lru-cache'),
      express = require('express'),
      // favicon = require('serve-favicon'),
      compression = require('compression'),
      microcache = require('route-cache'),
      { createBundleRenderer } = require('vue-server-renderer')

    const serverInfo =
      `express/${require('express/package.json').version} ` +
      `vue-server-renderer/${require('vue-server-renderer/package.json').version}`

    const app = express()

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

    let renderer
    let readyPromise
    const templatePath = appPaths.resolve.src('index.template.html')
    // In development: setup the dev server with watch and hot-reload,
    // and create a new renderer on bundle / index template update.
    readyPromise = this.setupSsrServer(
      app,
      templatePath,
      webpackConfig,
      cfg,
      (bundle, options) => {
        renderer = createRenderer(bundle, options)
      }
    )

    const serve = (path, cache) => express.static(appPaths.resolve.src(path), {
      maxAge: 0
    })

    app.use(compression({ threshold: 0 }))
    // app.use(favicon(appPaths.resolve.src('statics/logo-48.png')))
    // app.use('/dist', serve('./dist', true))
    app.use('/statics', serve('statics', true))
    // app.use('/manifest.json', serve('./manifest.json', true))
    // app.use('/service-worker.js', serve('./dist/service-worker.js'))

    // since this app has no user-specific content, every page is micro-cacheable.
    // if your app involves user-specific content, you need to implement custom
    // logic to determine whether a request is cacheable based on its url and
    // headers.
    // 1-second microcache.
    // https://www.nginx.com/blog/benefits-of-microcaching-nginx/
    app.use(microcache.cacheSeconds(1, req => req.originalUrl))

    function render (req, res) {
      const s = Date.now()

      res.setHeader('Content-Type', 'text/html')
      res.setHeader('Server', serverInfo)

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
          console.error(`error during render : ${req.url}`)
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
        console.log(`whole request: ${Date.now() - s}ms`)
      })
    }

    app.get('*', (req, res) => {
      readyPromise.then(() => render(req, res))
    })

    readyPromise.then(() => {
      this.server = app.listen(cfg.devServer.port, () => {
        console.log(`server started at localhost:${cfg.devServer.port}`)
        resolve()
      })
    })
  }

  setupSsrServer (app, templatePath, webpackConfig, cfg, cb) {
    let
      bundle,
      template,
      clientManifest

    const
      chokidar = require('chokidar'),
      MFS = require('memory-fs'),
      clientConfig = webpackConfig.client,
      serverConfig = webpackConfig.server

    let ready
    const readyPromise = new Promise(r => { ready = r })
    const update = () => {
      if (bundle && clientManifest) {
        ready()
        cb(bundle, {
          template,
          clientManifest
        })
      }
    }

    const readFile = (fs, file) => {
      try {
        return JSON.parse(fs.readFileSync(
          path.join(clientConfig.output.path, file),
          'utf-8'
        ))
      } catch (e) {}
    }
    const readIndexHtml = () => {
      const template = fs.readFileSync(templatePath, 'utf-8')
      return cfg.build.appBase
        ? template.replace('<head>', `<head><base href="${cfg.build.appBase}">`)
        : template
    }

    // read template from disk and watch
    template = readIndexHtml()
    chokidar.watch(templatePath).on('change', () => {
      template = readIndexHtml()
      console.log('index.template.html template updated.')
      update()
    })

    // modify client config to work with hot middleware
    clientConfig.entry.app = ['webpack-hot-middleware/client?reload=true'].concat(clientConfig.entry.app)
    clientConfig.output.path = path.join(__dirname, '..')
    clientConfig.plugins.push(
      new webpack.HotModuleReplacementPlugin()
    )

    // dev middleware
    const clientCompiler = webpack(clientConfig)
    const devMiddleware = require('webpack-dev-middleware')(clientCompiler, {
      publicPath: clientConfig.output.publicPath,
      noInfo: true
    })
    clientCompiler.hooks.done.tapAsync('client-compile-done', ({ compilation: { errors, warnings } }, cb) => {
      errors.forEach(err => console.error(err))
      warnings.forEach(err => console.warn(err))

      if (errors.length > 0) { return }

      clientManifest = readFile(
        devMiddleware.fileSystem,
        'vue-ssr-client-manifest.json'
      )

      update()
      cb()
    })
    app.use(devMiddleware)
    app.use(require('webpack-hot-middleware')(clientCompiler, { heartbeat: 5000 }))

    // watch and update server renderer
    serverConfig.output.path = path.join(__dirname, '..')

    const serverCompiler = webpack(serverConfig)
    const mfs = new MFS()
    serverCompiler.outputFileSystem = mfs
    serverCompiler.watch({}, (err, stats) => {
      if (err) { throw err }
      stats = stats.toJson()
      if (stats.errors.length) { return }

      // read bundle generated by vue-ssr-webpack-plugin
      bundle = readFile(mfs, 'vue-ssr-server-bundle.json')
      update()
    })

    return readyPromise
  }

  stop () {
    if (this.server) {
      log(`Shutting down`)
      this.server.close()
      this.server = null
    }
  }
}
