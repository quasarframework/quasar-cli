const
  fs = require('fs'),
  fse = require('fs-extra'),
  path = require('path'),
  compileTemplate = require('lodash.template')

const
  log = require('./helpers/logger')('app:generator')
  appPaths = require('./app-paths'),
  quasarFolder = appPaths.resolve.app('.quasar')

class Generator {
  constructor (quasarConfig) {
    const ctx = quasarConfig.getBuildConfig().ctx

    this.quasarConfig = quasarConfig

    const paths = [
      'common/import-quasar.js'
    ].concat(
      ctx.mode.ssr
        ? [
          'ssr/app.js',
          'ssr/entry-client.js',
          'ssr/entry-server.js'
        ]
        : [
          'csr/entry.js'
        ]
    )

    this.files = paths.map(file => {
      const content = fs.readFileSync(appPaths.resolve.cli(`templates/${file}`, 'utf-8'))
      return {
        filename: path.basename(file),
        template: compileTemplate(content)
      }
    })
  }

  prepare () {
    const
      now = Date.now() / 1000,
      then = now - 100,
      appVariablesFile = appPaths.resolve.cli('templates/app/variables.styl'),
      appStylFile = appPaths.resolve.cli('templates/app/app.styl'),
      emptyStylFile = path.join(quasarFolder, 'empty.styl')

    function copy (file) {
      const dest = path.join(quasarFolder, path.basename(file))
      fse.copySync(file, dest)
      fs.utimes(dest, then, then, function (err) { if (err) throw err })
    }

    copy(appStylFile)
    copy(appVariablesFile)

    fs.writeFileSync(emptyStylFile, '', 'utf-8'),
    fs.utimes(emptyStylFile, then, then, function (err) { if (err) throw err })
  }

  build () {
    log(`Generating Webpack entry point`)
    const data = this.quasarConfig.getBuildConfig()

    this.files.forEach(file => {
      fs.writeFileSync(file.filename, file.template(data), 'utf-8')
    })

    const
      now = Date.now() / 1000,
      then = now - 120

    this.files.forEach(file => {
      fs.utimes(this.filename, then, then, function (err) { if (err) throw err })
    })
  }
}

module.exports = Generator
