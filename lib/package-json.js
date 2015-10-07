var path = require('path'),
    fs = require('fs'),
    findRoot = require('./find-root')
;


function getFilePath() {
  var root = findRoot(process.cwd());
  return path.join(root, 'package.json');
}

function readFile() {
  return JSON.parse(fs.readFileSync(getFilePath(), 'utf8'));
}

function writeFile(json) {
  var string = JSON.stringify(json, null, '  ') + '\n';
  fs.writeFileSync(getFilePath(), string, 'utf8');
}



module.exports.getVersion = function() {
  var pkg = readFile();
  return pkg.version;
};

module.exports.setVersion = function(version) {
  var pkg = readFile();
  pkg.version = version;
  writeFile(pkg);
};

module.exports.getContent = function() {
  return readFile();
};