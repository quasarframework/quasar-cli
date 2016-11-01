var request = require('request')

module.exports = function (callback) {
  request({
    url: 'https://raw.githubusercontent.com/quasarframework/quasar-cli/master/lists/app-templates.json',
    headers: {
      'User-Agent': 'quasar-cli'
    }
  }, function (err, res, list) {
    if (err) {
      callback({code: err, response: res})
      return
      // ^^^ EARLY EXIT
    }

    callback(null, JSON.parse(list))
  })
}
