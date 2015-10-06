'use strict';

var exec = require('child_process').exec;
var path = require('path');
var expect = require('chai').expect;

describe('bin: package', function () {
    before(function () {
        this.cmd = 'node '+path.join(__dirname, '../bin/quasar-cli')+' ';
    });
    

    it('should run "package" without error', function (done) {
        exec(this.cmd+'package', function (error, stdout, stderr) {
            expect(error).to.not.exist;
            done();
        });
    });


});