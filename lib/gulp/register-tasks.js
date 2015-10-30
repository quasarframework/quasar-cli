var requireDir = require('require-dir');

requireDir('./tasks/', {recurse: true});

module.exports = require('gulp');
