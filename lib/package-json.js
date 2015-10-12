'use strict';

var
  path = require('path'),
  fs = require('fs'),
  getRoot = require('./get-root');


function getFilePath(startingPath) {
  startingPath = startingPath || process.cwd();
  return path.join(getRoot(startingPath), 'package.json');
}

function readFile(startingPath) {
  return JSON.parse(fs.readFileSync(getFilePath(startingPath), 'utf8'));
}

function writeFile(json, startingPath) {
  var string = JSON.stringify(json, null, '  ') + '\n';

  fs.writeFileSync(getFilePath(startingPath), string, 'utf8');
}


module.exports.getPath = function(/* optional */ startingPath) {
  return getFilePath(startingPath);
};

module.exports.getVersion = function(/* optional */ startingPath) {
  return readFile(startingPath).version;
};

module.exports.setVersion = function(version, /* optional */ startingPath) {
  var pkg = readFile(startingPath);

  pkg.version = version;
  writeFile(pkg, startingPath);
};

module.exports.getContent = function() {
  return readFile();
};
