const
  fs = require('fs'),
  fse = require('fs-extra'),
  path = require('path'),
  compileTemplate = require('lodash.template')

const
  log = require('./helpers/logger')('app:generator')
  appPaths = require('./build/app-paths'),
  quasarFolder = appPaths.resolve.app('.quasar')

class Generator {
  constructor () {
    this.entryTemplate = compileTemplate(fs.readFileSync(appPaths.entryTemplateFile, 'utf-8'))
    this.quasarTemplate = compileTemplate(fs.readFileSync(appPaths.quasarTemplateFile, 'utf-8'))
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

  build (quasarConfig) {
    log(`Generating Webpack entry point`)
    const data = quasarConfig.getBuildConfig()

    fse.mkdirpSync(quasarFolder)
    fs.writeFileSync(appPaths.entryFile, this.entryTemplate(data), 'utf-8')
    fs.writeFileSync(appPaths.quasarFile, this.quasarTemplate(data), 'utf-8')

    const
      now = Date.now() / 1000,
      then = now - 100

    fs.utimes(appPaths.entryFile, then, then, function (err) { if (err) throw err })
    fs.utimes(appPaths.quasarFile, then, then, function (err) { if (err) throw err })
  }
}

module.exports = Generator
