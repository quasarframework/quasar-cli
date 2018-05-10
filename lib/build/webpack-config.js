const
  path = require('path'),
  chalk = require('chalk'),
  webpack = require('webpack'),
  merge = require('webpack-merge'),
  VueLoaderPlugin = require('vue-loader/lib/plugin'),
  ProgressBarPlugin = require('progress-bar-webpack-plugin'),
  HtmlWebpackPlugin = require('html-webpack-plugin')

const
  appPaths = require('./app-paths'),
  cssUtils = require('./get-css-utils'),
  legacyValidations = require('./legacy-validations'),
  HtmlAddonsPlugin = require('./webpack-plugin-html-addons')

module.exports = function (cfg) {
  legacyValidations(cfg)

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

        chunksSortMode: 'none',
        // inject script tags for bundle
        inject: true,

        // custom ones
        ctx: cfg.ctx,
        productName: cfg.build.productName,
        productDescription: cfg.build.productDescription
      }),
      new HtmlAddonsPlugin(cfg)
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
  else {
    webpackConfig.node = {
      // prevent webpack from injecting useless setImmediate polyfill because Vue
      // source contains it (although only uses it if it's native).
      setImmediate: false,
      // process is injected via DefinePlugin, although some 3rd party
      // libraries may require a mock to work properly (#934)
      process: 'mock',
      // prevent webpack from injecting mocks to Node native modules
      // that does not make sense for the client
      dgram: 'empty',
      fs: 'empty',
      net: 'empty',
      tls: 'empty',
      child_process: 'empty'
    }
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

    if (cfg.build.preloadChunks && !['cordova', 'electron'].includes(cfg.ctx.modeName)) {
      const PreloadPlugin = require('preload-webpack-plugin')
      webpackConfig.plugins.push(
        new PreloadPlugin({
          rel: 'preload',
          include: 'initial',
          fileBlacklist: [/\.map$/, /hot-update\.js$/]
        }),
        new PreloadPlugin({
          rel: 'prefetch',
          include: 'asyncChunks'
        })
      )
    }

    // Scope hoisting ala Rollupjs
    if (cfg.build.scopeHoisting) {
      webpackConfig.optimization.concatenateModules = true
    }

    if (cfg.build.minify) {
      const UglifyJSPlugin = require('uglifyjs-webpack-plugin')

      webpackConfig.optimization.minimizer.push(
        new UglifyJSPlugin({
          uglifyOptions: cfg.build.uglifyOptions,
          cache: true,
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
        WorkboxPlugin = require('workbox-webpack-plugin'),
        HtmlPwaPlugin = require('./webpack-plugin-html-pwa'),
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
        new WorkboxPlugin[pluginMode](workboxConfig),
        new HtmlPwaPlugin({ manifest: cfg.pwa.manifest })
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
