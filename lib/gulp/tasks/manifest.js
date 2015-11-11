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

gulp.task('manifest', function() {
  var
    manifests = glob.sync(gulp._.config.js.yml),
    appConfig = {pages: {}},
    config, pageName
    ;

  _.forEach(manifests, function(manifestPath) {
    config = yaml.load(fs.readFileSync(manifestPath)) || {};
    pageName = getPageName(manifestPath);

    appConfig.pages[pageName] = config;
  });

  fs.writeFileSync(gulp._.config.appManifest.dest, JSON.stringify(appConfig));
});
