'use strict';

var
    _ = require('lodash'),
    recommend = require('conventional-recommended-bump'),
    semver = require('semver'),
    pkg = require('./package-json')
;

var releaseTypes = [
    'prepatch', 'patch',
    'preminor', 'minor',
    'premajor', 'major',
    'prerelease'
];


module.exports.validRelease = function(type) {
    return _(releaseTypes).includes(type);
};

module.exports.a = function(type) {
    if (!this.validRelease(type)) {
        throw new Error('Invalid release type');
    }

    var currentVersion = pkg.getVersion();
    var newVersion = semver.inc(currentVersion, type);

    release(newVersion);
    return newVersion;
};

module.exports.version = function(version) {
    if (!version) {
        throw new Error('No version supplied');
    }

    release(version);
}

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



function recommendVersion(callback) {
    recommend({ preset: 'angular' }, function(err, recommendation) {
        if (err) {
            throw new Error('Error recommending a release type...');
        }
        callback(recommendation);
    });
}

function release(version) {
    pkg.setVersion(version);
    //changelog
    //commit
    //tag
    //push
}