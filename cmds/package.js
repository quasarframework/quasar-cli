'use strict';

var pkg = require('../lib/package-json');
var commands = {};


commands.version = function(program, options) {
    program.log.info('Current version is: ', pkg.version());
    pkg.recommend(function(recommendation) {
        program.log.info('Recommending a '+recommendation+' bump.');
    });
};

commands.bump = function(program, options) {
    program.log.info('Current version is: ', pkg.version());

    if (!options.type) {
        pkg.recommend(function(recommendation) {
            pkg.bump(recommendation);
        })
    }
    else {
        pkg.bump(options.type);
    }
};


module.exports = function(program) {
    program
        .command('package [cmd]')
        .description('Project versioning helper')
        .option('-t, --type <type>', 'Bump type')
        .option('-p, --preset <type>', 'Versioning preset type. Default: angular')
        .action(function(cmd, options) {
            if (cmd) {
                if (!commands[cmd]) {
                    program.log.error(cmd, "unrecognized");
                    return;
                }
                commands[cmd](program, options);
            }
            else {
                commands.version(program, options);
            }

        });
};