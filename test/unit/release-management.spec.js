'use strict';

describe('lib: release-management', function() {

  before(function() {
    this.release = require('../../lib/release-management');
  });


  it('should return false when calling validRelease with wrong type', function() {
    expect(this.release.validRelease('qwerty')).to.be.false;
  });

  it('should return true when calling validRelease with a good type', function() {
    expect(this.release.validRelease('patch')).to.be.true;
    expect(this.release.validRelease('minor')).to.be.true;
  });


  it('should throw error when calling release.a() with invalid release type', function() {
    expect(function() {
      this.release.a('qazqaz');
    }.bind(this)).to.throw(/Invalid release type/);
  });


  it('should recommend a version when calling release.recommend()', function(done) {
    expect(function() {
      this.release.recommend(function() {});
    }.bind(this)).to.not.throw();

    this.release.recommend(function(result) {
      expect(result).to.exist;
      done();
    });
  });

  it('should return current version when calling release.getVersion()', function() {
    var result;

    expect(function() {
      result = this.release.getVersion();
    }.bind(this)).not.to.throw();

    expect(result).to.exist;
  });

});
