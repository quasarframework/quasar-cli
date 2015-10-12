'use strict';

var exec = require('child_process').exec;
var path = require('path');

describe('bin: release', function() {

  before(function() {
    this.cmd = 'node ' + path.join(__dirname, '../../bin/quasar-cli') + ' ';
  });


  it('should run "release:recommend" without error', function(done) {
    exec(this.cmd + 'release:recommend', function(error, stdout, stderr) {
      expect(error).to.not.exist;
      done();
    });
  });

});
