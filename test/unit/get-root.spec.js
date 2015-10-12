'use strict';

describe('lib: get-root', function() {

  before(function() {
    this.module = '../lib/get-root';
  });

  it('should search for package.json when called with no param', function(done) {
    var fs = {
      existsSync: function(path) {
        return path === '/foo/package.json';
      }
    };

    var getRoot = moquire(this.module, {fs: fs});
    var result = getRoot('/foo');

    expect(result).to.exist;
    expect(result).to.equal('/foo');
    done();
  });

  it('should search for filename', function(done) {
    var fs = {
      existsSync: function(path) {
        return path === '/foo/file.json';
      }
    };

    var getRoot = moquire(this.module, {fs: fs});
    var result = getRoot('/foo', 'file.json');

    expect(result).to.exist;
    expect(result).to.equal('/foo');
    done();
  });

  it('should search recursively', function(done) {
    var checked = [];
    var fs = {
      existsSync: function(path) {
        checked.push(path);
        return path === '/foo/file.json';
      }
    };
    var paths = [
      '/foo/bar/baz/file.json',
      '/foo/bar/file.json',
      '/foo/file.json'
    ];

    var getRoot = moquire(this.module, {fs: fs});
    var result = getRoot('/foo/bar/baz', 'file.json');

    expect(result).to.exist;
    expect(result).to.equal('/foo');
    expect(checked).to.deep.equal(paths);
    done();
  });

  it('should throw error when no such file exists', function(done) {
    var fs = {
      existsSync: function(path) {
        return false;
      }
    };

    var getRoot = moquire(this.module, {fs: fs});

    expect(function() {
      getRoot('/foo/bar');
    }).to.throw(/not found/);
    done();
  });

});
