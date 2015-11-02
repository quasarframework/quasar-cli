'use strict';

var
  exec = require('child_process').exec,
  path = require('path'),
  _ = require('lodash')
  ;

describe('bin', function() {

  var cmd = 'node ' + path.join(__dirname, '../../bin/quasar-cli') + ' ';

  function run(done, command, code) {
    exec(cmd + (command ? command : ''), function(error) {
      if (_.isNumber(code)) {
        expect(error).to.exist;
        expect(error.code).to.equal(code);
      }
      else {
        expect(error).to.not.exist;
      }
      done();
    });
  }


  it('should run --help without errors', function(done) {
    run(done, '--help');
  });

  it('should run --version without errors', function(done) {
    run(done, '--version');
  });

  it('should return error on missing command', function(done) {
    this.timeout(4000);
    run(done, '', 1);
  });

  it('should return error on unknown command', function(done) {
    this.timeout(4000);
    run(done, 'junkcmd', 1);
  });

});
