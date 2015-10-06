'use strict';

var exec = require('child_process').exec;
var expect = require('chai').expect;

describe('lib: package-json', function () {

    before(function () {
        this.pkg = require('../lib/package-json');
    });


    it('should not throw error when calling version', function (done) {
        expect(function() {
            this.pkg.version();
        }.bind(this)).to.not.throw();

        done();
    });

    it('should return version when calling version', function (done) {
        var result = this.pkg.version();
        expect(result).to.exist;
        done();
    });


    it('should throw error when calling recommend with no callback', function (done) {
        expect(function() {
            this.pkg.recommend();
        }.bind(this)).to.throw(/No callback/);

        done();
    });

    it('should return recommendation when calling recommend', function (done) {
        expect(function() {
            this.pkg.recommend(function() {});
        }.bind(this)).to.not.throw();

        this.pkg.recommend(function(type) {
            expect(type).to.exist;
            done();
        });
    });


    it('should throw error when calling bump with no params', function (done) {
        expect(function() {
            this.pkg.bump();
        }.bind(this)).to.throw(/No type/);

        done();
    });

});