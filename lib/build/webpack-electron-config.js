const
  fs = require('fs'),
  path = require('path'),
  chalk = require('chalk'),
  webpack = require('webpack'),
  ProgressBarPlugin = require('progress-bar-webpack-plugin')

const
  appPaths = require('./app-paths')

module.exports = function (cfg) {
  const
    { dependencies:appDeps = {} } = require(appPaths.resolve.cli('package.json')),
    { dependencies:cliDeps = {} } = require(appPaths.resolve.app('package.json'))

  const resolveModules = [
    appPaths.resolve.app('node_modules'),
    appPaths.resolve.cli('node_modules')
  ]

  const webpackConfig = {
    target: 'electron-main',
    mode: cfg.ctx.dev ? 'development' : 'production',
    node: {
      __dirname: cfg.ctx.dev,
      __filename: cfg.ctx.dev
    },
    entry: {
      'electron-main': appPaths.resolve.app(
        cfg.ctx.dev ? cfg.sourceFiles.electronMainDev : cfg.sourceFiles.electronMain
      )
    },
    output: {
      filename: 'electron-main.js',
      libraryTarget: 'commonjs2',
      path: cfg.ctx.dev
        ? appPaths.resolve.app('.quasar/electron')
        : cfg.build.distDir
    },
    externals: [
      ...Object.keys(cliDeps),
      ...Object.keys(appDeps)
    ],
    module: {
      rules: [
        {
          test: /\.js$/,
          use: 'babel-loader',
          exclude: /node_modules/
        },
        {
          test: /\.node$/,
          use: 'node-loader'
        }
      ]
    },
    resolve: {
      modules: resolveModules,
      extensions: ['.js', '.json', '.node']
    },
    resolveLoader: {
      modules: resolveModules
    },
    optimization: {
      noEmitOnErrors: true
    },
    plugins: [
      new ProgressBarPlugin({
        format: ` [:bar] ${chalk.bold(':percent')} (:msg)`
      }),
      new webpack.DefinePlugin(cfg.build.env)
    ]
  }

  if (cfg.ctx.prod) {
    // init it, we'll fill it in later
    webpackConfig.optimization.minimizer = []

    if (cfg.build.minify) {
      const UglifyJSPlugin = require('uglifyjs-webpack-plugin')

      webpackConfig.optimization.minimizer.push(
        new UglifyJSPlugin({
          parallel: true,
          sourceMap: cfg.build.sourceMap
        })
      )
    }

    // write package.json file
    webpackConfig.plugins.push({
      apply (compiler) {
        compiler.hooks.emit.tapAsync('package.json', (compiler, callback) => {
          const pkg = require(appPaths.resolve.app('package.json'))

          pkg.dependencies = cfg.electron.dependencies || pkg.dependencies
          pkg.main = './electron-main.js'
          const source = JSON.stringify(pkg)

          compiler.assets['package.json'] = {
            source: () => new Buffer(source),
            size: () => Buffer.byteLength(source)
          }

          callback()
        })
      }
    })
  }

  return webpackConfig
}
