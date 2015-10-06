var path = require('path'),
    fs = require('fs'),
    findRoot = require('./find-root'),
    recommend = require('conventional-recommended-bump'),
    semver = require('semver')
;


function getFilePath() {
  var root = findRoot(__dirname);
  return path.join(root, 'package.json');
}

function readFile() {
  return JSON.parse(fs.readFileSync(getFilePath(), 'utf8'));
}

function writeFile(json) {
  var string = JSON.stringify(json, null, '  ') + '\n';
  fs.writeFileSync(getFilePath(), string, 'utf8');
}



module.exports.version = function() {
  var pkg = readFile();
  return pkg.version;
};

module.exports.recommend = function(callback, preset) {
  if (!callback) {
    throw new Error('No callback specified.');
  }

  recommend({ preset: (preset || 'angular') }, function(err, recommendation) {
    callback(recommendation);
  });
};

module.exports.bump = function(type) {
  if (!type) {
    throw new Error('No type specified.');
  }

  var pkg = readFile();
  pkg.version = semver.inc(pkg.version, type);
  console.log('New version', pkg.version);

  writeFile(pkg);
};