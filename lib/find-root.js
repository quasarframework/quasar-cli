var path = require('path');
var fs = require('fs');
var _ = require('lodash');

function findRoot(start, filename) {
  start = start || __dirname;
  filename = filename || "package.json";

  if (_(start).isString()) {
    if (start[start.length-1] !== path.sep) {
      start += path.sep;
    }
    start = start.split(path.sep);
  }

  if (!start.length) {
    throw new Error(filename + ' not found in path.');
  }

  start.pop();
  var dir = start.join(path.sep);

  if (fs.existsSync(path.join(dir, filename))) {
    return dir;
  }

  return findRoot(start, filename);
}

module.exports = findRoot;