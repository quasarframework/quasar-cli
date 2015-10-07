var
  path = require('path'),
  fs = require('fs'),
  getRoot = require('./get-root'),
  changelog = require('conventional-changelog')
;


function getFilePath() {
  var root = getRoot();
  return path.join(root, 'CHANGELOG.md');
}

function readFile() {
  return fs.readFileSync(getFilePath(), 'utf8');
}

function writeFile(content) {
  fs.writeFileSync(getFilePath(), content, 'utf8');
}



module.exports.getContent = function() {
  return readFile();
};

module.exports.update = function() {
  changelog({ preset: 'angular' })
    .pipe(fs.createWriteStream(getFilePath()));
};