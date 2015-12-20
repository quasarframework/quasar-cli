'use strict';

var
  gulp = require('gulp'),
  fs = require('fs'),
  yaml = require('js-yaml'),
  path = require('path'),
  glob = require('glob'),
  _ = require('lodash')
  ;

var len = (gulp._.config.base + '/pages/').length;

function getPageName(manifestPath) {
  return path.dirname(manifestPath).substring(len);
}

function getAppManifest() {
  var
    manifests = glob.sync(gulp._.config.appManifest.watch),
    appConfig = {pages: {}},
    config, pageName, cssFile
    ;

  _.forEach(manifests, function(manifestPath) {
    config = yaml.load(fs.readFileSync(manifestPath)) || {};
    pageName = getPageName(manifestPath);

    if (!config.css) {
      cssFile = path.dirname(manifestPath) + '/style.' + pageName;

      if (fs.existsSync(cssFile + '.styl')) {
        config.css = cssFile.substring(4) + '.css';
      }
    }

    appConfig.pages[pageName] = config;
  });

  return JSON.stringify(appConfig);
}

module.exports = getAppManifest;
