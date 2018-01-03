const
  fs = require('fs'),
  path = require('path')

module.exports = function () {
  let dir = process.cwd()

  while (dir.length > 1) {
    if (fs.existsSync(path.join(dir, 'quasar.conf.js'))) {
      return dir
    }

    dir = path.normalize(path.join(dir, '..'))
  }
}
