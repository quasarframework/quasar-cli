'use strict';

var
  project = require('../../lib/cmds/project'),
  fs = require('../../lib/file-system'),
  logger = require('../../lib/logger')
  ;

describe('command: project', function() {
  var folder = process.cwd() + '/test-project/';
  var program = {
    normalize: function() {
      return '';
    },
    option: function() {}
  };

  logger(program);

  before(function() {
    fs.remove(folder);
  });
  beforeEach(function() {
    sinon.spy(console, 'log');
  });
  afterEach(function() {
    console.log.restore();
  });
  after(function() {
    fs.remove(folder);
  });

  it('should be able to generate one', function() {
    expect(fs.exists(folder)).to.equal(false);
    var result = project.create(program, 'test-project');

    expect(result).to.equal(0);
    expect(fs.exists(folder)).to.equal(true);
    expect(fs.exists(folder + 'package.json')).to.equal(true);
  });

  it('should output error when generating over existing folder', function() {
    expect(fs.exists(folder)).to.equal(true);
    var result = project.create(program, 'test-project');

    expect(result).to.not.equal(0);
    expect(console.log).to.have.been.calledOnce;
  });

});
