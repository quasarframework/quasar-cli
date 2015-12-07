'use strict';

require('colors');
var
  _ = require('lodash'),
  symbols = require('log-symbols')
  ;

var messageTypes = {
  success: symbols.success,
  error: symbols.error,
  info: symbols.info,
  warning: symbols.warning,
  debug: '[DEBUG]'.gray
};

function showMessage() {
  var args = Array.prototype.slice.call(arguments);

  if (args[0].length === 0) {
    return console.log();
  }

  var array = Array.prototype.slice.call(args[0]);

  if (args.length === 2) {
    array.unshift(args[1]);
  }

  console.log.apply(console, array);
}

var debug = false;
var methods = function() {
  showMessage(arguments);
};

_.forEach(messageTypes, function(prompt, name) {
  methods[name] = function() {
    if (name === 'debug' && !debug) {
      // do nothing if debug is not enabled
      return;
    }
    showMessage(arguments, ' ' + prompt);
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
