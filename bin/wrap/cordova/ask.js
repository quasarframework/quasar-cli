var inquirer = require('inquirer')

module.exports = function(done) {
  inquirer
  .prompt([{
    type: 'confirm',
    name: 'withCrosswalk',
    message: 'Install Crosswalk WebView plugin for Android Apps (HIGHLY recommended)',
    default: true
  }])
  .then(function (answer) {
    done(answer)
  })
}