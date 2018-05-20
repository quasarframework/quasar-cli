const
  chalk = require('chalk'),
  path = require('path'),
  opn = require('opn'),
  express = require('express'),
  webpack = require('webpack'),
  webpackDevServer = require('webpack-dev-server')

const
  appPaths = require('./build/app-paths'),
  log = require('./helpers/logger')('app:dev-server')

let alreadyNotified = false

class DevServer {
  constructor (quasarConfig) {
    this.quasarConfig = quasarConfig
  }

  async listen () {
    const
      webpackConfig = this.quasarConfig.getWebpackConfig(),
      cfg = this.quasarConfig.getBuildConfig()

    log(`Booting up...`)
    log()

    return new Promise((resolve, reject) => {
      this.compiler = webpack(webpackConfig)
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

      if (cfg.ctx.mode.pwa) {
        // inject noop service worker which resets a possible previous
        // registered one on same host:port

        const fs = require('fs')
        const resetScript = fs.readFileSync(
          appPaths.resolve.cli('templates/pwa-dev/service-worker-dev.js'),
          'utf-8'
        )

        this.server.use(function (req, res, next) {
          if (req.url === '/service-worker.js') {
            res.setHeader('Content-Type', 'text/javascript')
            res.send(resetScript)
          }
          else {
            next()
          }
        })
      }
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

module.exports = DevServer
