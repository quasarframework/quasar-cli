const
  fs = require('fs'),
  fse = require('fs-extra'),
  path = require('path'),
  chalk = require('chalk'),
  webpack = require('webpack'),
  merge = require('webpack-merge'),
  { VueLoaderPlugin } = require('vue-loader'),
  ProgressBarPlugin = require('progress-bar-webpack-plugin'),
  HtmlWebpackPlugin = require('html-webpack-plugin')

const
  appPaths = require('./app-paths'),
  cssUtils = require('./get-css-utils')

function legacyVerify (cfg) {
  let file, content

  file = appPaths.resolve.app(cfg.sourceFiles.indexHtmlTemplate)
  if (!fs.existsSync(file)) {
    warn('Missing index html file...')
    warn()
    process.exit(1)
  }
  content = fs.readFileSync(file, 'utf-8')
  if (content.indexOf('<base href') > -1) {
    console.log(`Your newer Quasar CLI requires a minor change to /src/index.template.html
  Please remove this tag completely:
  <base href="<%= htmlWebpackPlugin.options.appBase %>">
  `)
    process.exit(1)
  }

  file = appPaths.resolve.app('.babelrc')
  if (!fs.existsSync(file)) {
    warn('Missing .babelrc file...')
    warn()
    process.exit(1)
  }
  content = fs.readFileSync(file, 'utf-8')
  if (content.indexOf('"transform-runtime"') > -1) {
    console.log()
    console.log(' WARNING')
    console.log(` Your newer Quasar CLI requires a change to .babelrc file.`)
    console.log(` Doing it automatically. Please review the changes.`)
    console.log()

    fse.copySync(
      appPaths.resolve.cli('templates/app/babelrc'),
      appPaths.resolve.app('.babelrc')
    )
  }
}

function getHeadScripts (cfg) {
  let output = ''
  if (cfg.build.appBase) {
    output += `<base href="${cfg.build.appBase}">`
  }
  if (cfg.ctx.mode.electron && cfg.ctx.dev) {
    output += `
      <script>
        require('module').globalPaths.push('${appPaths.resolve.app('node_modules').replace(/\\/g, '\\\\')}')
      </script>
    `
  }
  return output
}

function getBodyScripts (cfg) {
  let output = ''
  if (cfg.ctx.mode.cordova) {
    output += `<script type="text/javascript" src="cordova.js"></script>`
  }
  if (cfg.ctx.dev) {
    output += `
      <script>
        console.info('[Quasar] Running ${cfg.ctx.modeName.toUpperCase()} with ${cfg.ctx.themeName.toUpperCase()} theme.')
      </script>
    `

    if (cfg.ctx.mode.pwa) {
      output += `
        <script>
          console.info('[Quasar] PWA: a no-op service worker is being supplied in dev mode in order to reset any previous registered one. This ensures HMR works correctly.')
          console.info('[Quasar] Do not run Lighthouse test in dev mode.')
        </script>
      `
    }
  }
  if (cfg.ctx.mode.electron && cfg.ctx.prod) {
    // set statics path in production;
    // the reason we add this is here is because the folder path
    // needs to be evaluated at runtime
    output += `
      <script>
        window.__statics = require('path').join(__dirname, 'statics').replace(/\\\\/g, '\\\\')
      </script>
    `
  }
  return output
}

module.exports = function (cfg) {
  legacyVerify(cfg)

  const resolveModules = [
    appPaths.resolve.app('node_modules'),
    appPaths.resolve.cli('node_modules')
  ]

  const webpackConfig = {
    entry: {
      app: [ appPaths.entryFile ]
    },
    mode: cfg.ctx.dev ? 'development' : 'production',
    devtool: cfg.build.sourceMap ? cfg.build.devtool : false,
    resolve: {
      extensions: [
        '.js', '.vue', '.json'
      ],
      modules: resolveModules,
      alias: {
        quasar: appPaths.resolve.app(`node_modules/quasar-framework/dist/quasar.${cfg.ctx.themeName}.esm.js`),
        src: appPaths.srcDir,
        components: appPaths.resolve.src(`components`),
        layouts: appPaths.resolve.src(`layouts`),
        pages: appPaths.resolve.src(`pages`),
        assets: appPaths.resolve.src(`assets`),
        plugins: appPaths.resolve.src(`plugins`),
        variables: appPaths.resolve.app(`.quasar/variables.styl`),

        // CLI using these ones:
        'quasar-app-styl': appPaths.resolve.app(`.quasar/app.styl`),
        'quasar-app-variables': appPaths.resolve.src(`css/themes/variables.${cfg.ctx.themeName}.styl`),
        'quasar-styl': appPaths.resolve.app(`node_modules/quasar-framework/dist/quasar.${cfg.ctx.themeName}.styl`)
      }
    },
    resolveLoader: {
      modules: resolveModules
    },
    module: {
      rules: [
        {
          test: /\.vue$/,
          loader: 'vue-loader',
          options: {
            productionMode: cfg.ctx.prod,
            transformAssetUrls: {
              video: 'src',
              source: 'src',
              img: 'src',
              image: 'xlink:href'
            }
          }
        },
        {
          test: /\.js$/,
          loader: 'babel-loader',
          include: [
            appPaths.srcDir,
            appPaths.entryFile
          ]
        },
        {
          test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: 'img/[name].[hash:7].[ext]'
          }
        },
        {
          test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: 'fonts/[name].[hash:7].[ext]'
          }
        },
        {
          test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: 'media/[name].[hash:7].[ext]'
          }
        },
        ...cssUtils.styleLoaders({
          rtl: cfg.build.rtl,
          postCSS: true,
          sourceMap: cfg.build.sourceMap,
          extract: cfg.build.extractCSS,
          minimize: cfg.build.minify
        })
      ]
    },
    plugins: [
      new VueLoaderPlugin(),
      new webpack.DefinePlugin(cfg.build.env),
      new ProgressBarPlugin({
        format: ` [:bar] ${chalk.bold(':percent')} (:msg)`
      }),
      // https://github.com/ampedandwired/html-webpack-plugin
      new HtmlWebpackPlugin({
        filename: cfg.ctx.dev
          ? 'index.html'
          : path.join(cfg.build.distDir, cfg.build.htmlFilename),
        template: appPaths.resolve.app(cfg.sourceFiles.indexHtmlTemplate),
        minify: cfg.build.minify
          ? {
            removeComments: true,
            collapseWhitespace: true,
            removeAttributeQuotes: true
            // more options:
            // https://github.com/kangax/html-minifier#options-quick-reference
          }
          : undefined,
        // necessary to consistently work with multiple chunks via CommonsChunkPlugin
        chunksSortMode: 'none',
        // inject script tags for bundle
        inject: true,

        // custom ones
        ctx: cfg.ctx,
        rtl: cfg.build.rtl || false,
        productName: cfg.build.productName,
        productDescription: cfg.build.productDescription,
        pwaManifest: cfg.ctx.mode.pwa ? cfg.pwa.manifest : null,
        headScripts: getHeadScripts(cfg),
        bodyScripts: getBodyScripts(cfg)
      })
    ],
    performance: {
      hints: false,
      maxAssetSize: 500000
    },
    optimization: {}
  }

  if (cfg.build.vueCompiler) {
    webpackConfig.resolve.alias['vue$'] = 'vue/dist/vue.esm.js'
  }

  if (cfg.ctx.mode.electron) {
    webpackConfig.node = {
      __dirname: cfg.ctx.dev,
      __filename: cfg.ctx.dev
    }
    webpackConfig.resolve.extensions.push('.node')
    webpackConfig.target = 'electron-renderer'
  }

  if (cfg.ctx.mode.pwa) {
    // write manifest.json file
    webpackConfig.plugins.push({
      apply (compiler) {
        compiler.hooks.emit.tapAsync('manifest.json', (compiler, callback) => {
          const source = JSON.stringify(cfg.pwa.manifest)

          compiler.assets['manifest.json'] = {
            source: () => new Buffer(source),
            size: () => Buffer.byteLength(source)
          }

          callback()
        })
      }
    })
  }

  // DEVELOPMENT build
  if (cfg.ctx.dev) {
    const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')

    webpackConfig.optimization.noEmitOnErrors = true
    webpackConfig.plugins.push(
      new FriendlyErrorsPlugin({
        compilationSuccessInfo: ['spa', 'pwa'].includes(cfg.ctx.modeName) ? {
          messages: [
            `App [${chalk.red(cfg.ctx.modeName.toUpperCase())} with ${chalk.red(cfg.ctx.themeName.toUpperCase())} theme] at ${cfg.build.APP_URL}\n`
          ],
        } : undefined,
        onErrors: cfg.build.useNotifier
          ? (severity, errors) => {
            if (severity !== 'error') {
              return
            }

            const error = errors[0]
            require('../helpers/notifier')({
              message: `${severity}:${error.name}`,
              subtitle: error.file.split('!').pop()
            })
          }
          : undefined,
        clearConsole: true
      })
    )

    if (cfg.devServer.hot) {
      require('webpack-dev-server').addDevServerEntrypoints(webpackConfig, cfg.devServer)
      webpackConfig.optimization.namedModules = true // HMR shows filenames in console on update
      webpackConfig.plugins.push(
        new webpack.HotModuleReplacementPlugin()
      )
    }
  }
  // PRODUCTION build
  else {
    // generate dist files
    webpackConfig.output = {
      path: cfg.build.distDir,
      publicPath: cfg.build.publicPath,
      filename: `js/[name].[chunkhash].js`,
      chunkFilename: 'js/[id].[chunkhash].js',
      libraryTarget: cfg.ctx.mode.electron
        ? 'commonjs2'
        : undefined
    }

    // init it, we'll fill it in later
    webpackConfig.optimization.minimizer = []

    webpackConfig.optimization.splitChunks = {
      cacheGroups: {
        commons: {
          test: /node_modules|\/quasar\//,
          name: 'vendor',
          chunks: 'all'
        }
      }
    }

    webpackConfig.plugins.push(
      // keep module.id stable when vendor modules does not change
      new webpack.HashedModuleIdsPlugin()
    )

    // extract webpack runtime and module manifest to its own file in order to
    // prevent vendor hash from being updated whenever app bundle is updated
    if (cfg.build.webpackManifest) {
      webpackConfig.optimization.runtimeChunk = true
    }

    // copy statics to dist folder
    const CopyWebpackPlugin = require('copy-webpack-plugin')
    webpackConfig.plugins.push(
      new CopyWebpackPlugin([
        {
          from: appPaths.resolve.src(`statics`),
          to: path.join(cfg.build.distDir, 'statics'),
          ignore: ['.*']
        }
      ])
    )

    // Scope hoisting ala Rollupjs
    if (cfg.build.scopeHoisting) {
      webpackConfig.optimization.concatenateModules = true
    }

    if (cfg.build.minify) {
      const UglifyJSPlugin = require('uglifyjs-webpack-plugin')

      webpackConfig.optimization.minimizer.push(
        new UglifyJSPlugin({
          parallel: true,
          sourceMap: cfg.build.sourceMap
        })
      )
    }

    // configure CSS extraction & optimize
    if (cfg.build.extractCSS) {
      const MiniCssExtractPlugin = require('mini-css-extract-plugin')

      // extract css into its own file
      webpackConfig.plugins.push(
        new MiniCssExtractPlugin({
          filename: '[name].[contenthash].css',
          chunkFilename: '[id].css'
        })
      )

      // dedupe CSS & minimize only if minifying
      if (cfg.build.minify) {
        const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')

        webpackConfig.optimization.minimizer.push(
          // Compress extracted CSS. We are using this plugin so that possible
          // duplicated CSS = require(different components) can be deduped.
          new OptimizeCSSPlugin({
            cssProcessorOptions: cfg.build.sourceMap
              ? { safe: true, map: { inline: false } }
              : { safe: true }
          })
        )
      }
    }

    if (cfg.ctx.mode.pwa) {
      let defaultOptions
      const
        workboxPlugin = require('workbox-webpack-plugin'),
        pluginMode = cfg.pwa.workboxPluginMode,
        log = require('../helpers/logger')('app:workbox')

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

      const workboxConfig = Object.assign(
        defaultOptions,
        cfg.pwa.workboxOptions,
        { swDest: 'service-worker.js' }
      )

      webpackConfig.plugins.push(
        new workboxPlugin[pluginMode](workboxConfig)
      )
    }

    // also produce a gzipped version
    if (cfg.build.gzip) {
      const CompressionWebpackPlugin = require('compression-webpack-plugin')

      webpackConfig.plugins.push(
        new CompressionWebpackPlugin(cfg.build.gzip)
      )
    }

    if (cfg.build.analyze) {
      const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
      webpackConfig.plugins.push(
        new BundleAnalyzerPlugin(Object.assign({}, cfg.build.analyze))
      )
    }
  }

  return webpackConfig
}
