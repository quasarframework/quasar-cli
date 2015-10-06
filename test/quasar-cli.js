'use strict';

var exec = require('child_process').exec;
var path = require('path');
var expect = require('chai').expect;

describe('main functionality', function(){
    var cmd = 'node '+path.join(__dirname, '../bin/quasar-cli')+' ';
    console.log(cmd);

    it('--help should run without errors', function(done) {
        exec(cmd+'--help', function (error, stdout, stderr) {
            expect(error).to.not.exist;
            done();
        });
    });

    it('--version should run without errors', function(done) {
        exec(cmd+'--version', function (error, stdout, stderr) {
            expect(error).to.not.exist;
            done();
        });
    });

    it('should return error on missing command', function(done) {
        this.timeout(4000);

        exec(cmd, function (error, stdout, stderr) {
            expect(error).to.exist;
            expect(error.code).to.equal(1);
            done();
        });
    });

    it('should return error on unknown command', function(done) {
        this.timeout(4000);

        exec(cmd+'junkcmd', function (error, stdout, stderr) {
            expect(error).to.exist;
            expect(error.code).to.equal(1);
            done();
        });
    });
});