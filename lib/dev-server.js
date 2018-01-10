const
  chalk = require('chalk'),
  path = require('path'),
  opn = require('opn'),
  express = require('express'),
  webpack = require('webpack'),
  webpackDevServer = require('webpack-dev-server')

const
  log = require('./helpers/logger')('app:dev-server'),
  notify = require('./helpers/notifier'),
  appPaths = require('./build/app-paths'),
  findPort = require('../lib/helpers/net').findClosestOpenPort

let alreadyNotified = false

class DevServer {
  constructor (quasarConfig) {
    this.webpackConfig = quasarConfig.getWebpackConfig()

    const cfg = quasarConfig.getBuildConfig()
    this.ctx = cfg.ctx
    this.notify = cfg.build.useNotifier
    this.opts = cfg.devServer
    this.listenAdressChanged = quasarConfig.listenAdressChanged
    this.APP_URL = cfg.build.APP_URL
  }

  async listen () {
    if (this.listenAdressChanged) {
      const { port, host } = this.opts
      log(`Checking listening address availability (${host}:${port})...`)

      const openPort = await findPort(port, host)
      if (port !== openPort) {
        warn()
        warn(`Setting port to closest one available: ${openPort}`)
        warn()

        this.opts.port = openPort
      }
    }

    log(`Booting up...`)
    log()

    return new Promise((resolve, reject) => {
      this.compiler = webpack(this.webpackConfig)
      this.compiler.plugin('done', compiler => {
        if (this.__started) { return }

        // don't start dev server until there are no errors
        if (compiler.compilation.errors && compiler.compilation.errors.length > 0) {
          return
        }

        this.__started = true

        this.server.listen(this.opts.port, this.opts.host, () => {
          resolve()

          if (alreadyNotified) { return }
          alreadyNotified = true

          if (this.ctx.mode.cordova) {
            return
          }

          if (this.opts.open) {
            opn(this.APP_URL)
          }
          else if (this.notify) {
            notify({
              subtitle: `App is ready for dev`,
              message: `Listening at ${this.APP_URL}`,
              onClick: () => {
                opn(this.APP_URL)
              }
            })
          }
        })
      })

      // start building & launch server
      this.server = new webpackDevServer(this.compiler, this.opts)
    })
  }

  stop () {
    log(`Shutting down`)
    this.server.close()
  }
}

module.exports = DevServer
