'use strict';

require('colors');
var _ = require('lodash');

var messageTypes = {
  success: '[SUCCESS]'.green,
  error: '['.red + 'ERROR'.underline.red + ']'.red,
  info: '[INFO]'.blue,
  warning: '[WARN]'.yellow,
  debug: '[DEBUG]'.gray
};

function showMessage() {
  var args = Array.prototype.slice.call(arguments);

  if (args[1].length === 0) {
    return console.log();
  }

  console.log.apply(console, [args[0]].concat(Array.prototype.slice.call(args[1])));
}

var debug = false;
var methods = function() {
  showMessage('', arguments);
};

_.forEach(messageTypes, function(prompt, name) {
  methods[name] = function() {
    if (name === 'debug' && !debug) {
      // do nothing if debug is not enabled
      return;
    }
    showMessage(prompt, arguments);
  };
});

module.exports = function(program) {
  /*
   * Enables/Disables 'debug' method
   */
  var argv = program.normalize(process.argv);

  program.option('-d, --debug', 'enable debugger');
  debug = program.debug = argv.indexOf('-d') > -1 || argv.indexOf('--debug') > -1; // Need this early

  /*
   * Inject methods
   */
  program.log = methods;
};
