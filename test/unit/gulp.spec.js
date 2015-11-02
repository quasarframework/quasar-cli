'use strict';

var
  project = require('../../lib/cmds/project'),
  fs = require('../../lib/file-system'),
  logger = require('../../lib/logger'),
  exec = require('child_process').exec,
  path = require('path'),
  _ = require('lodash')
  ;

describe('gulp', function() {

  var folder = process.cwd() + '/test-project/';
  var program = {
    normalize: function() {return '';},
    option: function() {}
  };
  var cmd = 'node ' + path.join(__dirname, '../../bin/quasar-cli') + ' ';
  var timeout = 20 * 1000;

  logger(program);

  function run(done, command, code) {
    exec(cmd + (command ? command : '') + ' -d', {timeout: timeout - 2000}, function(error, out) {
      console.log(out);
      console.log('Error received:');
      console.dir(error);
      if (_.isNumber(code)) {
        expect(error).to.exist;
        expect(error.code).to.equal(code);
      }
      else if (error && !error.killed) {
        expect(error).to.not.exist;
      }
      expect(out).to.not.contain('[ERROR]');
      done();
    });
  }

  before(function() {
    fs.remove(folder);
    project.create(program, 'test-project');
    process.chdir('./test-project');
  });
  after(function() {
    process.chdir('../');
    fs.remove(folder);
  });

  it('should be able to build', function(done) {
    this.timeout(timeout);
    run(function() {
      expect(fs.exists('build')).to.equal(true);
      expect(fs.exists('build/js/app.js')).to.equal(true);
      expect(fs.exists('build/pages/index/js/page.index.js')).to.equal(true);
      done();
    }, 'build');
  });

  it('should be able to dist', function(done) {
    this.timeout(timeout);
    run(function() {
      expect(fs.exists('dist')).to.equal(true);
      expect(fs.exists('dist/js/app.js')).to.equal(true);
      expect(fs.exists('dist/pages/index/js/page.index.js')).to.equal(true);
      done();
    }, 'dist');
  });

  it('should be able to preview', function(done) {
    this.timeout(timeout);
    setTimeout(function() {
      var request = require('sync-request');

      expect(fs.exists('build')).to.equal(true);
      var req = request('GET', 'http://localhost:3000', {
        timeout: 100
      });

      expect(req.statusCode).to.equal(200);
    }, timeout - 300);
    setTimeout(function() {
      done();
    }, timeout - 2);
    run(function() {}, 'preview');
  });

  it('should be able to clean', function(done) {
    this.timeout(timeout);
    run(function() {
      expect(fs.exists('build')).to.equal(false);
      expect(fs.exists('dist')).to.equal(false);
      done();
    }, 'clean');
  });

});
