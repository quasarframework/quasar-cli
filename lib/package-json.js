var path = require('path'),
    fs = require('fs'),
    getRoot = require('./get-root')
;


function getFilePath(startingPath) {
  startingPath = startingPath || process.cwd();

  var root = getRoot(startingPath);
  return path.join(root, 'package.json');
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
}

module.exports.getVersion = function(/* optional */ startingPath) {
  var pkg = readFile(startingPath);
  return pkg.version;
};

module.exports.setVersion = function(version, /* optional */ startingPath) {
  var pkg = readFile(startingPath);
  pkg.version = version;
  writeFile(pkg, startingPath);
};

module.exports.getContent = function() {
  return readFile();
};