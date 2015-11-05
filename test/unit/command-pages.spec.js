'use strict';

var
  pages = require('../../lib/cmds/pages'),
  fs = require('../../lib/file-system'),
  logger = require('../../lib/logger')
  ;

describe('command: pages', function() {
  function getTestFile(pageName) {
    return '/js/script.' + pageName + '.js';
  }

  var pageName = 'test-page';
  var root = process.cwd() + '/src/pages/';
  var folder = root + pageName;
  var file = folder + getTestFile(pageName);

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
  afterEach(function() {
    //fs.remove(process.cwd() + '/src');
  });

  describe('create', function() {
    it('should be able to generate one', function() {
      var result = pages.create(program, pageName);

      expect(result).to.equal(0);
      expect(fs.exists(folder)).to.equal(true);
      expect(fs.exists(file)).to.equal(true);
    });

    it('should be able to generate two', function() {
      var tmpName = 'page2';
      var result = pages.create(program, pageName);
      var result2 = pages.create(program, tmpName);

      expect(result).to.equal(0);
      expect(fs.exists(folder)).to.equal(true);
      expect(fs.exists(file)).to.equal(true);

      expect(result2).to.equal(0);
      expect(fs.exists(root + tmpName)).to.equal(true);
      expect(fs.exists(root + tmpName + getTestFile(tmpName))).to.equal(true);
    });

    it('should output error when generating over existing folder', function() {
      pages.create(program, pageName);
      var result = pages.create(program, pageName);

      expect(result).to.not.equal(0);
    });
  });

  describe('rename', function() {
    it('should be able to rename existing page', function() {
      var tmpName = 'tmpName';

      pages.create(program, pageName);
      var result = pages.rename(program, pageName, tmpName);

      expect(result).to.equal(0);
      expect(fs.exists(root + tmpName + getTestFile(tmpName))).to.equal(true);
    });

    it('should output error when page does not exists', function() {
      var result = pages.rename(program, 'bogusName', pageName);

      expect(result).to.not.equal(0);
    });
    it('should output error when page with new name already exists', function() {
      pages.create(program, 'name1');
      pages.create(program, 'name2');

      var result = pages.rename(program, 'name1', 'name2');

      expect(result).to.not.equal(0);
    });
  });

  describe('remove', function() {
    it('should be able to remove existing page', function() {
      var tmpName = 'page2';

      pages.create(program, pageName);
      pages.create(program, tmpName);

      var result = pages.remove(program, pageName);

      expect(result).to.equal(0);
      expect(fs.exists(folder)).to.equal(false);
      expect(fs.exists(root + tmpName + getTestFile(tmpName))).to.equal(true);
    });

    it('should output error when removing inexisting page', function() {
      var result = pages.remove(program, pageName);

      expect(result).to.not.equal(0);
    });
  });

});
