/**
 * Export modules to global scope as necessary
 * (only for testing)
 */

var chai = require('chai');

global.expect = chai.expect;
global.moquire = require('moquire');
global.sinon = require('sinon');

var sinonChai = require('sinon-chai');

chai.use(sinonChai);
