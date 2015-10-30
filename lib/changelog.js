'use strict';

var
  path = require('path'),
  fs = require('fs'),
  getRoot = require('find-root'),
  changelog = require('conventional-changelog')
  ;


function getFilePath() {
  return path.join(getRoot(), 'CHANGELOG.md');
}

function readFile() {
  return fs.readFileSync(getFilePath(), 'utf8');
}




module.exports.getContent = function() {
  return readFile();
};

module.exports.update = function() {
  changelog({preset: 'angular'}).pipe(fs.createWriteStream(getFilePath()));
};
