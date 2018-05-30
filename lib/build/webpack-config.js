const
  path = require('path'),
  chalk = require('chalk'),
  webpack = require('webpack'),
  WebpackChain = require('webpack-chain'),
  VueLoaderPlugin = require('vue-loader/lib/plugin'),
  ProgressBarPlugin = require('progress-bar-webpack-plugin'),
  HtmlWebpackPlugin = require('html-webpack-plugin')

const
  appPaths = require('./app-paths'),
  injectStyleRules = require('./inject-style-rules'),
  legacyValidations = require('./legacy-validations'),
  HtmlAddonsPlugin = require('./webpack-plugin-html-addons')

module.exports = function (cfg) {
  legacyValidations(cfg)

  const chain = new WebpackChain()
  const resolveModules = [
    appPaths.resolve.app('node_modules'),
    appPaths.resolve.cli('node_modules')
  ]

  chain.entry('app').add(appPaths.entryFile)
  chain.mode(cfg.ctx.dev ? 'development' : 'production')
  chain.devtool(cfg.build.sourceMap ? cfg.build.devtool : false)

  chain.resolve.extensions
    .merge([ '.js', '.vue', '.json' ])

  chain.resolve.modules
    .merge(resolveModules)

  chain.resolve.alias
    .merge({
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
    })

  if (cfg.build.vueCompiler) {
    chain.resolve.alias.set('vue$', 'vue/dist/vue.esm.js')
  }

  chain.resolveLoader.modules
    .merge(resolveModules)

  chain.module.rule('vue')
    .test(/\.vue$/)
    .use('vue-loader')
      .loader('vue-loader')
      .options({
        productionMode: cfg.ctx.prod,
        compilerOptions: {
          preserveWhitespace: false
        },
        transformAssetUrls: {
          video: 'src',
          source: 'src',
          img: 'src',
          image: 'xlink:href'
        }
      })

  chain.module.rule('babel')
    .test(/\.js$/)
    .include
      .add(appPaths.srcDir)
      .add(appPaths.resolve.app('.quasar'))
      .end()
    .use('babel-loader')
      .loader('babel-loader')
        .options({
          extends: appPaths.resolve.app('.babelrc')
        })

  chain.module.rule('images')
    .test(/\.(png|jpe?g|gif|svg)(\?.*)?$/)
    .use('url-loader')
      .loader('url-loader')
      .options({
        limit: 10000,
        name: 'img/[name].[hash:7].[ext]'
      })

  chain.module.rule('fonts')
    .test(/\.(woff2?|eot|ttf|otf)(\?.*)?$/)
    .use('url-loader')
      .loader('url-loader')
      .options({
        limit: 10000,
        name: 'fonts/[name].[hash:7].[ext]'
      })

  chain.module.rule('media')
    .test(/\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/)
    .use('url-loader')
      .loader('url-loader')
      .options({
        limit: 10000,
        name: 'media/[name].[hash:7].[ext]'
      })

  injectStyleRules(chain, {
    rtl: cfg.build.rtl,
    sourceMap: cfg.build.sourceMap,
    extract: cfg.build.extractCSS,
    minimize: cfg.build.minify
  })

  chain.plugin('vue-loader')
    .use(VueLoaderPlugin)

  chain.plugin('define')
    .use(webpack.DefinePlugin, [ cfg.build.env ])

  chain.plugin('progress-bar')
    .use(ProgressBarPlugin, [{
      format: ` [:bar] ${chalk.bold(':percent')} (:msg)`
    }])

  chain.plugin('html-webpack')
    .use(HtmlWebpackPlugin, [{
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
      cache: true,

      // custom ones
      ctx: cfg.ctx,
      productName: cfg.build.productName,
      productDescription: cfg.build.productDescription
    }])

  chain.plugin('html-addons')
    .use(HtmlAddonsPlugin, [ cfg ])

  chain.performance
    .hints(false)
    .maxAssetSize(500000)

  if (cfg.ctx.mode.electron) {
    chain.node
      .merge({
        __dirname: cfg.ctx.dev,
        __filename: cfg.ctx.dev
      })

    chain.resolve.extensions
      .add('.node')

    chain.target('electron-renderer')

    chain.module.rule('node')
      .test(/\.node$/)
      .use('node-loader')
        .loader('node-loader')
  }
  else {
    chain.node
      .merge({
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
      })
  }

  if (cfg.ctx.mode.pwa) {
    const PwaManifestPlugin = require('./webpack-plugin-pwa-manifest')

    // write manifest.json file
    chain.plugin('pwa-manifest')
      .use(PwaManifestPlugin, [{ manifest: cfg.pwa.manifest }])
  }

  // DEVELOPMENT build
  if (cfg.ctx.dev) {
    const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')

    chain.optimization
      .noEmitOnErrors(true)

    chain.plugin('friendly-errors')
      .use(FriendlyErrorsPlugin, [{
        compilationSuccessInfo: ['spa', 'pwa'].includes(cfg.ctx.modeName) ? {
          messages: [
            `App [${chalk.red(cfg.ctx.modeName.toUpperCase())} with ${chalk.red(cfg.ctx.themeName.toUpperCase())} theme] at ${cfg.build.APP_URL}\n`
          ],
        } : undefined,
        clearConsole: true
      }])

    if (cfg.devServer.hot) {
      chain.optimization
        .namedModules(true) // HMR shows filenames in console on update

      chain.plugin('hot-module-replacement')
        .use(webpack.HotModuleReplacementPlugin)
    }
  }
  // PRODUCTION build
  else {
    // generate dist files
    chain.output
      .path(cfg.build.distDir)
      .publicPath(cfg.build.publicPath)
      .filename(`js/[name].[chunkhash:8].js`)
      .chunkFilename('js/[name].[chunkhash:8].js')

    if (cfg.ctx.mode.electron) {
      chain.output
        .libraryTarget('commonjs2')
    }

    chain.optimization
      .splitChunks({
        cacheGroups: {
          commons: {
            test: /node_modules|\/quasar\//,
            name: 'vendor',
            chunks: 'all'
          }
        }
      })

    // keep module.id stable when vendor modules does not change
    chain.plugin('hashed-module-ids')
      .use(webpack.HashedModuleIdsPlugin)

    // extract webpack runtime and module manifest to its own file in order to
    // prevent vendor hash from being updated whenever app bundle is updated
    if (cfg.build.webpackManifest) {
      chain.optimization
        .runtimeChunk(true)
    }

    // copy statics to dist folder
    const CopyWebpackPlugin = require('copy-webpack-plugin')
    chain.plugin('copy-webpack')
      .use(CopyWebpackPlugin, [
        [{
          from: appPaths.resolve.src(`statics`),
          to: path.join(cfg.build.distDir, 'statics'),
          ignore: ['.*']
        }]
      ])

    if (cfg.build.preloadChunks && !['cordova', 'electron'].includes(cfg.ctx.modeName)) {
      const PreloadPlugin = require('preload-webpack-plugin')
      chain.plugin('preload')
        .use(PreloadPlugin, [{
          rel: 'preload',
          include: 'initial',
          fileBlacklist: [/\.map$/, /hot-update\.js$/]
        }])
      chain.plugin('prefetch')
        .use(PreloadPlugin, [{
          rel: 'prefetch',
          include: 'asyncChunks'
        }])
    }

    // Scope hoisting ala Rollupjs
    if (cfg.build.scopeHoisting) {
      chain.optimization
        .concatenateModules(true)
    }

    if (cfg.build.minify) {
      const UglifyJSPlugin = require('uglifyjs-webpack-plugin')

      chain.optimization
        .minimizer([
          new UglifyJSPlugin({
            uglifyOptions: cfg.build.uglifyOptions,
            cache: true,
            parallel: true,
            sourceMap: cfg.build.sourceMap
          })
        ])
    }

    // configure CSS extraction & optimize
    if (cfg.build.extractCSS) {
      const MiniCssExtractPlugin = require('mini-css-extract-plugin')

      // extract css into its own file
      chain.plugin('mini-css-extract')
        .use(MiniCssExtractPlugin, [{
          filename: '[name].[contenthash:8].css',
          chunkFilename: '[id].[contenthash:8].css'
        }])

      // dedupe CSS & minimize only if minifying
      if (cfg.build.minify) {
        const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')

        const cssProcessorOptions = {
          safe: true,
          autoprefixer: { disable: true },
          mergeLonghand: false
        }
        if (cfg.build.sourceMap) {
          cssProcessorOptions.map = { inline: false }
        }

        // Compress extracted CSS. We are using this plugin so that possible
          // duplicated CSS = require(different components) can be deduped.
        chain.plugin('optimize-css')
          .use(OptimizeCSSPlugin, [{
            canPrint: false,
            cssProcessorOptions
          }])
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

      chain.plugin('workbox')
        .use(WorkboxPlugin[pluginMode], [
          Object.assign(
            defaultOptions,
            cfg.pwa.workboxOptions,
            { swDest: 'service-worker.js' }
          )
        ])

      chain.plugin('html-pwa')
        .use(HtmlPwaPlugin, [{ manifest: cfg.pwa.manifest }])
    }

    // also produce a gzipped version
    if (cfg.build.gzip) {
      const CompressionWebpackPlugin = require('compression-webpack-plugin')
      chain.plugin('compress-webpack')
        .use(CompressionWebpackPlugin, [ cfg.build.gzip ])
    }

    if (cfg.build.analyze) {
      const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
      chain.plugin('bundle-analyzer')
        .use(BundleAnalyzerPlugin, [ Object.assign({}, cfg.build.analyze) ])
    }
  }

  return chain
}
