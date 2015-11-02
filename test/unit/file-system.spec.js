'use strict';

var
  fs = require('fs'),
  fse = require('fs-extra'),
  path = require('path'),
  quasarfs = require('../../lib/file-system')
  ;

describe('lib: file-system', function() {

  describe('path', function() {

    it('should tell CLI working path', function() {
      expect(quasarfs.getWorkingPath()).to.equal(process.cwd());
    });

    it('should get project root', function() {
      expect(quasarfs.getProjectPath()).to.equal(process.cwd());
    });

    it('should be able to join paths', function() {
      expect(quasarfs.joinPath('a', 'b', 'c')).to.equal('a/b/c');
    });

    it('should get path to assets', function() {
      expect(
        quasarfs.getPathToAsset('project')
      ).to.equal(
        path.join(process.cwd(), 'assets/project')
      );
    });

    it('should get path to a folder within the project', function() {
      expect(
        quasarfs.getPathToFolderFromProject('cmds/whatever.js')
      ).to.equal(
        path.join(process.cwd(), 'cmds/whatever.js')
      );
    });

  });

  describe('inode methods', function() {
    var dest = path.join(process.cwd(), '.tmp');
    var finalDest = path.join(process.cwd(), '.tmp2');

    describe('folder', function() {
      var src = quasarfs.getPathToAsset('page/___page___');

      it('should copy', function() {
        quasarfs.copy(src, dest);
        expect(fs.existsSync(dest)).to.equal(true);
        expect(fs.existsSync(dest + '/js')).to.equal(true);
      });
      it('should test', function() {
        expect(quasarfs.exists(dest)).to.equal(true);
        expect(quasarfs.exists(dest + '/js')).to.equal(true);
        expect(quasarfs.exists(dest + '/js/page.___page___.js')).to.equal(true);
      });
      it('should rename', function() {
        quasarfs.move(dest, finalDest);
        expect(fs.existsSync(finalDest)).to.equal(true);
        expect(fs.existsSync(finalDest + '/js')).to.equal(true);
      });
      it('should remove', function() {
        quasarfs.remove(finalDest);
        expect(fs.existsSync(finalDest)).to.equal(false);
      });
    });

    describe('file', function() {
      var src = quasarfs.getPathToAsset('page/___page___/js/page.___page___.js');

      it('should copy', function() {
        quasarfs.copy(src, dest);
        expect(fs.existsSync(dest)).to.equal(true);
      });
      it('should test', function() {
        expect(quasarfs.exists(dest)).to.equal(true);
      });
      it('should rename', function() {
        quasarfs.move(dest, finalDest);
        expect(fs.existsSync(finalDest)).to.equal(true);
      });
      it('should remove', function() {
        quasarfs.remove(finalDest);
        expect(fs.existsSync(finalDest)).to.equal(false);
      });
    });
  });

});
