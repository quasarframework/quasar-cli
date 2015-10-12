'use strict';

var path = require('path');
var fs = require('fs');
var _ = require('lodash');

function getRoot(start, filename) {
  start = start || process.cwd();
  filename = filename || 'package.json';

  if (_(start).isString()) {
    if (start[start.length - 1] !== path.sep) {
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

  return getRoot(start, filename);
}

module.exports = getRoot;
