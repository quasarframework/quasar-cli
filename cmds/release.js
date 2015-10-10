'use strict';

var release = require('../lib/release-management');

module.exports = function(program) {
    program
        .command('release <type>')
        .description('Release a version type <patch, minor, major, ...>')
        .action(function(type) {
            if (!release.validRelease(type)) {
                program.log.error(type, 'unrecognized');
                return;
            }

            program.log.info('Current version:', release.getVersion());
            var version = release.a(type);
            program.log.info('Successfully released version', version);
        });

    program
        .command('release:recommend')
        .description('Recommend a release type: patch, minor, major')
        .action(function() {
            program.log.info('Current version:', release.getVersion());
            release.recommend(function(version) {
                program.log.info('It is recommended to do a', version, 'release type.');
            });
        });

    program
        .command('release:version <version>')
        .description('Recommend a release type: patch, minor, major')
        .action(function(version) {
            program.log.info('Current version:', release.getVersion());
            release.version(version);
            program.log.info('Successfully released version', version);
        });
};