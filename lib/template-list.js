var request = require('request')

module.exports = function (callback) {
  request({
    url: 'https://api.github.com/repos/rstoenescu/quasar-templates/branches',
    headers: {
      'User-Agent': 'quasar-cli'
    }
  }, function (err, res, branches) {
    if (err) {
      callback({code: err, response: res})
      return
      // ^^^ EARLY EXIT
    }

    callback(
      null,
      JSON.parse(branches).filter(function (branch) {
        return branch.name !== 'master'
      }).map(function (branch) {
        return branch.name
      })
    )
  })
}
