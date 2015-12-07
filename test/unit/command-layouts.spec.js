'use strict';

var
  layouts = require('../../lib/cmds/layouts'),
  fs = require('../../lib/file-system'),
  logger = require('../../lib/logger')
  ;

describe('command: layout', function() {
  function getJsFile(layoutName) {
    return '/layout.' + layoutName + '.js';
  }
  function getHtmlFile(layoutName) {
    return '/layout.' + layoutName + '.html';
  }

  var
    layoutName = 'test-layout',
    root = process.cwd() + '/src/layouts/',
    folder = root + layoutName,
    jsFile = folder + getJsFile(layoutName),
    htmlFile = folder + getHtmlFile(layoutName)
    ;

  var program = {
    normalize: function() {
      return '';
    },
    option: function() {}
  };

  logger(program);

  beforeEach(function() {
    fs.remove(process.cwd() + '/src');
  });
  after(function() {
    fs.remove(process.cwd() + '/src');
  });

  describe('create', function() {
    it('should be able to generate one', function() {
      var result = layouts.create(program, layoutName);

      expect(result).to.equal(0);
      expect(fs.exists(folder)).to.equal(true);
      expect(fs.exists(jsFile)).to.equal(true);
      expect(fs.exists(htmlFile)).to.equal(true);
    });

    it('should be able to generate two', function() {
      var tmpName = 'layout2';
      var result = layouts.create(program, layoutName);
      var result2 = layouts.create(program, tmpName);

      expect(result).to.equal(0);
      expect(fs.exists(folder)).to.equal(true);
      expect(fs.exists(jsFile)).to.equal(true);
      expect(fs.exists(htmlFile)).to.equal(true);

      expect(result2).to.equal(0);
      expect(fs.exists(root + tmpName)).to.equal(true);
      expect(fs.exists(root + tmpName + getJsFile(tmpName))).to.equal(true);
      expect(fs.exists(root + tmpName + getHtmlFile(tmpName))).to.equal(true);
    });

    it('should output error when generating over existing folder', function() {
      layouts.create(program, layoutName);
      var result = layouts.create(program, layoutName);

      expect(result).to.not.equal(0);
    });
  });

  describe('rename', function() {
    it('should be able to rename existing layout', function() {
      var tmpName = 'tmpName';

      layouts.create(program, layoutName);
      var result = layouts.rename(program, layoutName, tmpName);

      expect(result).to.equal(0);
      expect(fs.exists(root + tmpName + getJsFile(tmpName))).to.equal(true);
    });

    it('should output error when layout does not exists', function() {
      var result = layouts.rename(program, 'bogusName', layoutName);

      expect(result).to.not.equal(0);
    });

    it('should output error when layout with new name already exists', function() {
      layouts.create(program, 'name1');
      layouts.create(program, 'name2');

      var result = layouts.rename(program, 'name1', 'name2');

      expect(result).to.not.equal(0);
    });
  });

});
