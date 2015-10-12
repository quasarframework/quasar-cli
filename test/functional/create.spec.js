'use strict';

var
  exec = require('child_process').exec,
  path = require('path'),
  fs = require('fs'),
  fse = require('fs-extra');

describe('bin: create', function() {

  describe('project', function() {

    var projectFolder = 'test-project';

    before(function() {
      this.cmd = 'node ' + path.join(__dirname, '../../bin/quasar-cli') + ' ';
    });

    after(function() {
      fse.removeSync(path.join(process.cwd(), projectFolder));
    });


    it('should run "create ' + projectFolder + '" without error', function(done) {
      exec(this.cmd + 'create ' + projectFolder, function(error, stdout, stderr) {
        expect(error).to.not.exist;
        expect(fs.existsSync(path.join(process.cwd(), projectFolder))).to.be.ok;
        done();
      });
    });

    it('should return error when initializing a project already containing a project', function(done) {
      exec(this.cmd + 'create ' + projectFolder, function(error, stdout, stderr) {
        expect(error).to.exist;
        expect(error.code).to.equal(1);
        done();
      });
    });

  });

});
