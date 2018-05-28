const
  path = require('path'),
  fs = require('fs'),
  merge = require('webpack-merge'),
  chokidar = require('chokidar'),
  debounce = require('lodash.debounce')

const
  generateWebpackConfig = require('./build/webpack-config'),
  appPaths = require('./build/app-paths'),
  logger = require('./helpers/logger'),
  log = logger('app:quasar-conf'),
  warn = logger('app:quasar-conf', 'red')

function getQuasarConfigCtx (opts) {
  const ctx = {
    dev: opts.dev || false,
    prod: opts.prod || false,
    theme: {},
    themeName: opts.theme,
    mode: {},
    modeName: opts.mode,
    target: {},
    targetName: opts.target,
    emulator: opts.emulator,
    arch: {},
    archName: opts.arch,
    bundler: {},
    bundlerName: opts.bundler,
    debug: opts.debug
  }
  ctx.theme[opts.theme] = true
  ctx.mode[opts.mode] = true
  if (opts.target) {
    ctx.target[opts.target] = true
  }
  if (opts.arch) {
    ctx.arch[opts.arch] = true
  }
  if (opts.bundler) {
    ctx.bundler[opts.bundler] = true
  }
  return ctx
}

function encode (obj) {
  return JSON.stringify(obj, (key, value) => {
    return typeof value === 'function'
      ? `/fn(${value.toString()})`
      : value
  })
}

function formatPublicPath (path) {
  if (!path) {
    return path
  }
  if (!path.startsWith('/')) {
    path = `/${path}`
  }
  if (!path.endsWith('/')) {
    path = `${path}/`
  }
  return path
}

/*
 * this.buildConfig           - Compiled Object from quasar.conf.js
 * this.webpackConfig         - Webpack config object for main thread
 * this.electronWebpackConfig - Webpack config object for electron main thread
 */

class QuasarConfig {
  constructor (opts) {
    this.filename = appPaths.resolve.app('quasar.conf.js')
    this.storeFile = appPaths.resolve.src('store/index.js')
    this.pkg = require(appPaths.resolve.app('package.json'))
    this.opts = opts
    this.ctx = getQuasarConfigCtx(opts)
    this.watch = opts.onBuildChange || opts.onAppChange

    if (this.watch) {
      // Start watching for quasar.config.js changes
      chokidar
        .watch(this.filename, { watchers: { chokidar: { ignoreInitial: true } } })
        .on('change', debounce(async () => {
          let err = false
          console.log()
          log(`quasar.conf.js changed`)

          try {
            await this.prepare()
          }
          catch (e) {
            if (e.message !== 'NETWORK_ERROR') {
              console.log(e)
              warn(`quasar.conf.js has JS errors. Please fix them then save file again.`)
              warn()
            }

            return
          }

          this.compile()

          if (this.webpackConfigChanged) {
            opts.onBuildChange()
          }
          else {
            opts.onAppChange()
          }
        }), 2500)
    }
  }

  // synchronous for build
  async prepare () {
    this.readConfig()

    const cfg = merge({
      ctx: this.ctx,
      css: false,
      plugins: false,
      animations: false,
      extras: false
    }, this.quasarConfigFunction(this.ctx))

    if (this.ctx.dev) {
      cfg.devServer = cfg.devServer || {}

      if (this.opts.host) {
        cfg.devServer.host = this.opts.host
      }
      else if (!cfg.devServer.host) {
        cfg.devServer.host = '0.0.0.0'
      }

      if (this.opts.port) {
        cfg.devServer.port = this.opts.port
      }
      else if (!cfg.devServer.port) {
        cfg.devServer.port = 8080
      }

      if (
        this.address &&
        this.address.from.host === cfg.devServer.host &&
        this.address.from.port === cfg.devServer.port
      ) {
        cfg.devServer.host = this.address.to.host
        cfg.devServer.port = this.address.to.port
      }
      else {
        const addr = {
          host: cfg.devServer.host,
          port: cfg.devServer.port
        }
        const to = await this.opts.onAddress(addr)

        // if network error while running
        if (to === null) {
          throw new Error('NETWORK_ERROR')
        }

        cfg.devServer = merge(cfg.devServer, to)
        this.address = {
          from: addr,
          to: {
            host: cfg.devServer.host,
            port: cfg.devServer.port
          }
        }
      }
    }

    this.quasarConfig = cfg
  }

  getBuildConfig () {
    return this.buildConfig
  }

  getWebpackConfig () {
    return this.webpackConfig
  }

  getElectronWebpackConfig () {
    return this.electronWebpackConfig
  }

  readConfig () {
    log(`Reading quasar.conf.js`)

    if (fs.existsSync(this.filename)) {
      delete require.cache[this.filename]
      this.quasarConfigFunction = require(this.filename)
    }
    else {
      warn(`⚠️  [FAIL] Could not load quasar.conf.js config file`)
      process.exit(1)
    }
  }

  compile () {
    let cfg = this.quasarConfig

    if (cfg.vendor) {
      console.log()
      console.log(`⚠️  Quasar CLI no longer supports quasar.conf.js > vendor property.`)
      console.log(`   Please remove this property and try again.`)
      console.log()
      process.exit(1)
    }

    // if watching for changes,
    // then determine the type (webpack related or not)
    if (this.watch) {
      const newConfigSnapshot = [
        cfg.build ? encode(cfg.build) : '',
        cfg.devServer ? encode(cfg.devServer) : '',
        cfg.vendor ? encode(cfg.vendor) : '',
        cfg.pwa ? encode(cfg.pwa) : '',
        cfg.electron ? encode(cfg.electron) : ''
      ].join('')

      if (this.oldConfigSnapshot) {
        this.webpackConfigChanged = newConfigSnapshot !== this.oldConfigSnapshot
      }

      this.oldConfigSnapshot = newConfigSnapshot
    }

    // make sure it exists
    cfg.supportIE = this.ctx.mode.electron
      ? false
      : (cfg.supportIE || false)

    cfg.build = merge({
      productName: this.pkg.productName,
      productDescription: this.pkg.description,
      extractCSS: this.ctx.prod,
      sourceMap: this.ctx.dev,
      minify: this.ctx.prod,
      distDir: path.join('dist', `${this.ctx.modeName}-${this.ctx.themeName}`),
      htmlFilename: 'index.html',
      webpackManifest: this.ctx.prod,
      vueRouterMode: 'hash',
      preloadChunks: true,
      devtool: this.ctx.dev
        ? '#cheap-module-eval-source-map'
        : '#source-map',
      env: {
        NODE_ENV: `"${this.ctx.prod ? 'production' : 'development'}"`,
        DEV: this.ctx.dev,
        PROD: this.ctx.prod,
        THEME: `"${this.ctx.themeName}"`,
        MODE: `"${this.ctx.modeName}"`
      },
      uglifyOptions: {
        compress: {
          // turn off flags with small gains to speed up minification
          arrows: false,
          collapse_vars: false, // 0.3kb
          comparisons: false,
          computed_props: false,
          hoist_funs: false,
          hoist_props: false,
          hoist_vars: false,
          inline: false,
          loops: false,
          negate_iife: false,
          properties: false,
          reduce_funcs: false,
          reduce_vars: false,
          switches: false,
          toplevel: false,
          typeofs: false,

          // a few flags with noticable gains/speed ratio
          // numbers based on out of the box vendor bundle
          booleans: true, // 0.7kb
          if_return: true, // 0.4kb
          sequences: true, // 0.7kb
          unused: true, // 2.3kb

          // required features to drop conditional branches
          conditionals: true,
          dead_code: true,
          evaluate: true
        },
        mangle: {
          /*
            Support non-standard Safari 10/11.
            By default `uglify-es` will not work around
            Safari 10/11 bugs.
          */
          safari10: true
        }
      }
    }, cfg.build || {})

    if (cfg.framework === void 0 || cfg.framework === 'all') {
      cfg.framework = {
        all: true
      }
    }
    cfg.framework.cfg = cfg.framework.cfg || {}

    if (this.ctx.dev || this.ctx.debug) {
      cfg.build.minify = false
      cfg.build.extractCSS = false
      cfg.build.gzip = false
    }
    if (this.ctx.debug) {
      cfg.build.sourceMap = true
      cfg.build.extractCSS = true
    }

    if (this.ctx.mode.cordova || this.ctx.mode.electron) {
      cfg.build.htmlFilename = 'index.html'
      cfg.build.vueRouterMode = 'hash'
      cfg.build.gzip = false
      cfg.build.webpackManifest = false
    }

    if (this.ctx.mode.cordova) {
      cfg.build.distDir = appPaths.resolve.app(path.join('src-cordova', 'www'))
    }
    else if (!path.isAbsolute(cfg.build.distDir)) {
      cfg.build.distDir = appPaths.resolve.app(cfg.build.distDir)
    }

    if (this.ctx.mode.electron) {
      cfg.build.packagedElectronDist = cfg.build.distDir
      cfg.build.distDir = path.join(cfg.build.distDir, 'UnPackaged')
    }

    cfg.build.publicPath =
      this.ctx.prod && cfg.build.publicPath && !['cordova', 'electron'].includes(this.ctx.modeName)
        ? formatPublicPath(cfg.build.publicPath)
        : (cfg.build.vueRouterMode !== 'hash' ? '/' : '')
    cfg.build.appBase = cfg.build.vueRouterMode === 'history'
      ? cfg.build.publicPath
      : ''

    cfg.sourceFiles = merge({
      rootComponent: 'src/App.vue',
      router: 'src/router',
      store: 'src/store',
      indexHtmlTemplate: 'src/index.template.html',
      registerServiceWorker: 'src-pwa/register-service-worker.js',
      serviceWorker: 'src-pwa/custom-service-worker.js',
      electronMainDev: 'src-electron/main-process/electron-main.dev.js',
      electronMainProd: 'src-electron/main-process/electron-main.js'
    }, cfg.sourceFiles || {})

    if (this.ctx.dev) {
      const
        initialPort = cfg.devServer && cfg.devServer.port,
        initialHost = cfg.devServer && cfg.devServer.host

      cfg.devServer = merge({
        publicPath: cfg.build.publicPath,
        hot: true,
        inline: true,
        overlay: true,
        quiet: true,
        historyApiFallback: true,
        noInfo: true,
        disableHostCheck: true,
        open: true
      }, cfg.devServer || {}, {
        contentBase: [ appPaths.srcDir ]
      })

      if (this.ctx.mode.cordova || this.ctx.mode.electron) {
        cfg.devServer.https = false
        cfg.devServer.open = false
        cfg.devServer.compress = false
      }

      if (this.ctx.mode.cordova) {
        cfg.devServer.contentBase.push(
          appPaths.resolve.cordova(`platforms/${this.ctx.targetName}/platform_www`)
        )
      }
    }

    if (cfg.build.gzip) {
      let gzip = cfg.build.gzip === true
        ? {}
        : cfg.build.gzip
      let ext = ['js', 'css']

      if (gzip.extensions) {
        ext = gzip.extensions
        delete gzip.extensions
      }

      cfg.build.gzip = merge({
        asset: '[path].gz[query]',
        algorithm: 'gzip',
        test: new RegExp('\\.(' + ext.join('|') + ')$'),
        threshold: 10240,
        minRatio: 0.8
      }, gzip)
    }

    if (this.ctx.mode.pwa) {
      cfg.build.webpackManifest = false

      cfg.pwa = merge({
        workboxPluginMode: 'GenerateSW',
        workboxOptions: {},
        manifest: {
          name: this.pkg.productName || this.pkg.name || 'Quasar App',
          short_name: this.pkg.name || 'quasar-pwa',
          description: this.pkg.description,
          display: 'standalone',
          start_url: '.'
        }
      }, cfg.pwa || {})

      if (!['GenerateSW', 'InjectManifest'].includes(cfg.pwa.workboxPluginMode)) {
        console.log()
        console.log(`⚠️  Workbox webpack plugin mode "${cfg.pwa.workboxPluginMode}" is invalid.`)
        console.log(`   Valid Workbox modes are: GenerateSW, InjectManifest`)
        console.log()
        process.exit(1)
      }
      if (cfg.pwa.cacheExt) {
        console.log()
        console.log(`⚠️  Quasar CLI now uses Workbox, so quasar.conf.js > pwa > cacheExt is no longer relevant.`)
        console.log(`   Please remove this property and try again.`)
        console.log()
        process.exit(1)
      }
      if (
        fs.existsSync(appPaths.resolve.pwa('service-worker-dev.js')) ||
        fs.existsSync(appPaths.resolve.pwa('service-worker-prod.js'))
      ) {
        console.log()
        console.log(`⚠️  Quasar CLI now uses Workbox, so src-pwa/service-worker-dev.js and src-pwa/service-worker-prod.js are obsolete.`)
        console.log(`   Please remove and add PWA mode again:`)
        console.log(`    $ quasar mode -r pwa # Warning: this will delete /src-pwa !`)
        console.log(`    $ quasar mode -a pwa`)
        console.log()
        process.exit(1)
      }

      cfg.pwa.manifest.icons = cfg.pwa.manifest.icons.map(icon => {
        icon.src = `${cfg.build.publicPath}${icon.src}`
        return icon
      })
    }

    if (this.ctx.dev) {
      const host = cfg.devServer.host === '0.0.0.0'
        ? 'localhost'
        : cfg.devServer.host
      cfg.build.APP_URL = `http${cfg.devServer.https ? 's' : ''}://${host}:${cfg.devServer.port}/${cfg.build.vueRouterMode === 'hash' ? cfg.build.htmlFilename : ''}`
    }
    else if (this.ctx.mode.cordova) {
      cfg.build.APP_URL = 'index.html'
    }
    else if (this.ctx.mode.electron) {
      cfg.build.APP_URL = `file://" + __dirname + "/index.html`
    }

    const vueRouterBase = this.ctx.prod && cfg.build.vueRouterMode === 'history'
      ? cfg.build.publicPath
      : '/'

    cfg.build.env = merge(cfg.build.env || {}, {
      VUE_ROUTER_MODE: `"${cfg.build.vueRouterMode}"`,
      VUE_ROUTER_BASE: `"${vueRouterBase}"`,
      APP_URL: `"${cfg.build.APP_URL}"`
    })

    if (this.ctx.mode.pwa) {
      cfg.build.env.SERVICE_WORKER_FILE = `"${vueRouterBase}service-worker.js"`
    }

    cfg.build.env = {
      'process.env': cfg.build.env
    }

    if (this.ctx.mode.electron) {
      if (this.ctx.dev) {
        cfg.build.env.__statics = `"${appPaths.resolve.src('statics').replace(/\\/g, '\\\\')}"`
      }
    }
    else {
      cfg.build.env.__statics = `"${this.ctx.dev ? '/' : cfg.build.publicPath || '/'}statics"`
    }

    log(`Generating Webpack config`)
    const chainConfig = generateWebpackConfig(cfg)

    if (typeof cfg.build.chainWebpack === 'function') {
      log(`Chaining ${this.ctx.mode.electron ? 'renderer process ' : ''}Webpack config`)
      cfg.build.chainWebpack(chainConfig)
    }

    const webpackConfig = chainConfig.toConfig()

    if (typeof cfg.build.extendWebpack === 'function') {
      log(`Extending ${this.ctx.mode.electron ? 'renderer process ' : ''}Webpack config`)
      cfg.build.extendWebpack(webpackConfig)
    }

    if (this.ctx.dev && cfg.devServer.hot) {
      // tap entries for HMR
      require('webpack-dev-server').addDevServerEntrypoints(webpackConfig, cfg.devServer)
    }

    this.webpackConfig = webpackConfig

    if (this.ctx.mode.cordova && !cfg.cordova) {
      cfg.cordova = {}
    }

    if (this.ctx.mode.electron) {
      if (this.ctx.prod) {
        const bundler = require('./electron/bundler')

        cfg.electron = merge({
          packager: {
            asar: true,
            icon: appPaths.resolve.electron('icons/icon'),
            overwrite: true
          },
          builder: {
            appId: 'quasar-app',
            productName: this.pkg.productName || this.pkg.name || 'Quasar App',
            directories: {
              buildResources: appPaths.resolve.electron('')
            }
          }
        }, cfg.electron || {}, {
          packager: {
            dir: cfg.build.distDir,
            out: cfg.build.packagedElectronDist
          },
          builder: {
            directories: {
              app: cfg.build.distDir,
              output: path.join(cfg.build.packagedElectronDist, 'Packaged')
            }
          }
        })

        if (cfg.ctx.bundlerName) {
          cfg.electron.bundler = cfg.ctx.bundlerName
        }
        else if (!cfg.electron.bundler) {
          cfg.electron.bundler = bundler.getDefaultName()
        }

        if (cfg.electron.bundler === 'packager') {
          if (cfg.ctx.targetName) {
            cfg.electron.packager.platform = cfg.ctx.targetName
          }
          if (cfg.ctx.archName) {
            cfg.electron.packager.arch = cfg.ctx.archName
          }
        }
        else {
          cfg.electron.builder = {
            platform: cfg.ctx.targetName,
            arch: cfg.ctx.archName,
            config: cfg.electron.builder
          }

          bundler.ensureBuilderCompatibility()
        }

        bundler.ensureInstall(cfg.electron.bundler)
      }

      log(`Generating Electron Webpack config`)
      const
        electronWebpack = require('./build/webpack-electron-config'),
        electronChainConfig = electronWebpack(cfg)

      if (typeof cfg.electron.chainWebpack === 'function') {
        log(`Chaining main process Webpack config`)
        cfg.electron.chainWebpack(electronChainConfig)
      }

      const electronWebpackConfig = electronChainConfig.toConfig()

      if (typeof cfg.electron.extendWebpack === 'function') {
        log(`Extending main process Webpack config`)
        cfg.electron.extendWebpack(electronWebpackConfig)
      }

      this.electronWebpackConfig = electronWebpackConfig
    }

    cfg.store = fs.existsSync(this.storeFile)

    this.buildConfig = cfg
  }
}

module.exports = QuasarConfig
