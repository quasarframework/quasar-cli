const
  fs = require('fs'),
  mkdirp = require('fs-extra').mkdirpSync,
  dirname = require('path').dirname,
  compileTemplate = require('lodash.template')

const
  log = require('./helpers/logger')('app:generator')
  appPaths = require('./build/app-paths')

class Generator {
  constructor (quasarConfig) {
    const content = fs.readFileSync(appPaths.entryTemplateFile, 'utf-8')
    this.template = compileTemplate(content)
    this.quasarConfig = quasarConfig
  }

  build () {
    log(`Generating Webpack entry point`)
    const data = this.quasarConfig.getBuildConfig()
    // console.log(this.template(data))
    // process.exit(0)

    mkdirp(dirname(appPaths.entryFile))
    fs.writeFileSync(appPaths.entryFile, this.template(data), 'utf-8')

    const
      now = Date.now() / 1000,
      then = now - 10

    fs.utimes(appPaths.entryFile, then, then, function (err) { if (err) throw err })
  }
}

module.exports = Generator
