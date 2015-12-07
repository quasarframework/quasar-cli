'use strict';

var
  fs = require('../../lib/file-system'),
  logger = require('../../lib/logger'),
  _ = require('lodash'),
  asset = require('../../lib/cmds/assets')
  ;

describe('individual asset command', function() {

  function getTestFile(type, assetName, ext) {
    if (type === 'page') {
      return '/js/script.' + assetName + '.js';
    }

    return '/layout.' + assetName + (ext || '.js');
  }

  var assetName = 'test-asset';

  var program = {
    normalize: function() {
      return '';
    },
    option: function() {}
  };

  logger(program);

  _.forEach(['page', 'layout'], function(assetType) {
    describe(assetType + ':', function() {
      var
        root = process.cwd() + '/src/' + assetType + 's/',
        folder = root + assetName,
        file = folder + getTestFile(assetType, assetName)
        ;

      beforeEach(function() {
        fs.remove(process.cwd() + '/src');
      });
      after(function() {
        fs.remove(process.cwd() + '/src');
      });

      describe('create', function() {

        it('should be able to generate one', function() {
          var result = asset.create(assetType, program, assetName);

          expect(result).to.equal(0);
          expect(fs.exists(folder)).to.equal(true);
          expect(fs.exists(file)).to.equal(true);
        });

        it('should be able to generate two', function() {
          var tmpName = 'page2';
          var result = asset.create(assetType, program, assetName);
          var result2 = asset.create(assetType, program, tmpName);

          expect(result).to.equal(0);
          expect(fs.exists(folder)).to.equal(true);
          expect(fs.exists(file)).to.equal(true);

          expect(result2).to.equal(0);
          expect(fs.exists(root + tmpName)).to.equal(true);
          expect(fs.exists(root + tmpName + getTestFile(assetType, tmpName))).to.equal(true);
        });

        it('should output error when generating over existing folder', function() {
          asset.create(assetType, program, assetName);
          var result = asset.create(assetType, program, assetName);

          expect(result).to.not.equal(0);
        });

      });

      describe('rename', function() {

        it('should be able to rename existing asset', function() {
          var tmpName = 'tmpName';

          asset.create(assetType, program, assetName);
          var result = asset.rename(assetType, program, assetName, tmpName);

          expect(result).to.equal(0);
          expect(fs.exists(root + tmpName + getTestFile(assetType, tmpName))).to.equal(true);
        });

        it('should output error when asset does not exists', function() {
          var result = asset.rename(assetType, program, 'bogusName', assetName);

          expect(result).to.not.equal(0);
        });

        it('should output error when asset with new name already exists', function() {
          asset.create(assetType, program, 'name1');
          asset.create(assetType, program, 'name2');

          var result = asset.rename(assetType, program, 'name1', 'name2');

          expect(result).to.not.equal(0);
          expect(fs.exists(root + 'name2' + getTestFile(assetType, 'name2'))).to.equal(true);
        });

        it('should be able to rename existing asset with missing optionals', function() {
          asset.create(assetType, program, 'asset');

          if (fs.exists(root + 'asset/html')) {
            fs.remove(root + 'asset/html');
          }
          if (fs.exists(root + 'asset/layout.asset.html')) {
            fs.remove(root + 'asset/layout.asset.html');
          }

          expect(asset.rename(assetType, program, 'asset', 'asset2')).to.equal(0);
        });

      }); // describe

    }); // describe assetType

  }); // foreach

});
