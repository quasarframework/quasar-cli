'use strict';

var
    _ = require('lodash'),
    recommend = require('conventional-recommended-bump'),
    semver = require('semver'),
    pkg = require('./package-json'),
    changelog = require('./changelog'),
    git = require('./git')
;

var releaseTypes = [
    'prepatch', 'patch',
    'preminor', 'minor',
    'premajor', 'major',
    'prerelease'
];

function recommendVersion(callback) {
    recommend({ preset: 'angular' }, function(err, recommendation) {
        if (err) {
            throw new Error('Error recommending a release type...');
        }
        callback(recommendation);
    });
}

function release(version, callback) {
    // set new version in package.json
    pkg.setVersion(version);

    // changelog
    changelog.update();

    // perform GIT actions
    git('add *', function() {
        git('commit -a -m "[release]'+version+'"', function() {
            git('tag v'+version, function() {
                git('push', function() {
                    git('push origin --tags', callback);
                });
            });
        });
    });
}



module.exports.validRelease = function(type) {
    return _(releaseTypes).includes(type);
};

module.exports.a = function(type, callback) {
    if (!this.validRelease(type)) {
        throw new Error('Invalid release type');
    }

    var currentVersion = pkg.getVersion();
    var newVersion = semver.inc(currentVersion, type);

    release(newVersion, function() {
        if (callback) {
            callback(newVersion);
        }
    });
};

module.exports.version = function(version, callback) {
    if (!version) {
        throw new Error('No version supplied');
    }

    release(version, callback);
};

module.exports.recommend = function(callback) {
    if (!callback) {
        throw new Error('No callback specified');
    }
    
    recommendVersion(function(recommendation) {
        callback(recommendation);
    });
};

module.exports.getVersion = function() {
    return pkg.getVersion();
};
