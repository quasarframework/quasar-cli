'use strict';

var
  gulp = require('gulp'),
  fs = require('fs'),
  yaml = require('js-yaml'),
  path = require('path'),
  glob = require('glob'),
  _ = require('lodash')
  ;

var
  pageLen = (gulp._.config.base + '/pages/').length,
  layoutLen = (gulp._.config.base + '/layouts/').length
  ;

function getName(manifestPath, len) {
  return path.dirname(manifestPath).substring(len);
}

function getManifest(prefix, len, globFiles) {
  var
    manifests = glob.sync(globFiles),
    pages = {},
    config, pageName, cssFile
    ;

  _.forEach(manifests, function(manifestPath) {
    config = yaml.load(fs.readFileSync(manifestPath)) || {};
    pageName = getName(manifestPath, len);

    if (!config.css) {
      cssFile = path.dirname(manifestPath) + '/' + prefix + '.' + pageName;

      if (fs.existsSync(cssFile + '.styl')) {
        config.css = cssFile.substring(4) + '.css';
      }
    }

    pages[pageName] = config;
  });

  return pages;
}

module.exports = function() {
  return JSON.stringify({
    pages: getManifest('style', pageLen, gulp._.config.appManifest.watch.pages),
    layouts: getManifest('layout', layoutLen, gulp._.config.appManifest.watch.layouts)
  });
};
