'use strict';

var exec = require('child_process').exec;
var path = require('path');

describe('bin', function() {

  before(function() {
    this.cmd = 'node ' + path.join(__dirname, '../../bin/quasar-cli') + ' ';
  });

  it('should run --help without errors', function(done) {
    exec(this.cmd + '--help', function(error) {
      expect(error).to.not.exist;
      done();
    });
  });

  it('should run --version without errors', function(done) {
    exec(this.cmd + '--version', function(error) {
      expect(error).to.not.exist;
      done();
    });
  });

  it('should return error on missing command', function(done) {
    this.timeout(4000);

    exec(this.cmd, function(error) {
      expect(error).to.exist;
      expect(error.code).to.equal(1);
      done();
    });
  });

  it('should return error on unknown command', function(done) {
    this.timeout(4000);

    exec(this.cmd + 'junkcmd', function(error) {
      expect(error).to.exist;
      expect(error.code).to.equal(1);
      done();
    });
  });

});
