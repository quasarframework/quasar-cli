'use strict';

var
  _ = require('lodash'),
  prettyTime = require('pretty-hrtime')
  ;

var commands = [
  {
    name: 'build',
    description: 'Build Quasar App',
    task: 'dev',
    message: 'Building Quasar App for ' + 'Development'.yellow,
    options: [
      {
        name: ['p', 'production', 'Build for ' + 'PRODUCTION'.red],
        task: 'prod',
        message: 'Building Quasar App for ' + 'PRODUCTION'.red
      }
    ]
  },
  {
    name: 'preview',
    description: 'Live Preview Quasar App',
    task: 'preview',
    message: 'Live Previewing Quasar App',
    options: [
      {
        name: ['r', 'responsive', 'with Responsive View'],
        task: 'preview-resp',
        message: 'Live Previewing Quasar App with Responsive View'
      }
    ]
  },
  {
    name: 'monitor',
    description: 'Monitor Quasar App & auto rebuild',
    task: 'monitor',
    message: 'Monitoring Quasar App source files'
  },
  {
    name: 'clean',
    description: 'Clean Quasar App from build artifacts',
    task: 'clean',
    message: 'Cleaning Quasar App'
  },
  {
    name: 'test',
    description: 'Run Quasar App test suites',
    task: 'test',
    message: 'Testing Quasar App'
  }
];

function injectDebug(program, runner) {
  if (!program.debug) {
    return runner;
  }

  runner
    .on('task_start', function(e) {
      program.log('Starting task', e.task.cyan);
    })
    .on('task_stop', function(e) {
      program.log.success('Finished task', e.task.cyan, 'after', prettyTime(e.hrDuration).magenta);
    })
    .on('task_err', function(e) {
      program.log.error('\'' + e.task.cyan + '\'', 'errored after'.red, prettyTime(e.hrDuration).magenta);
    })
    .on('err', function() {
      program.log.error('FAILED');
    });

  return runner;
}

function parseCommand(opts, command) {
  var config;

  _.forEach(command.options, function(option) {
    if (!config && opts[option.name[1]]) {
      config = {
        message: option.message,
        task: option.task
      };
    }
  });

  if (config) {
    return config;
  }

  return {
    message: command.message,
    task: command.task
  };
}

module.exports = function(program) {

  _.forEach(commands, function(command) {
    var cmd = program.command(command.name);

    _.forEach(command.options, function(option) {
      cmd.option('-' + option.name[0] + ', --' + option.name[1], option.name[2]);
    });

    cmd
    .description(command.description)
    .action(function(opts) {
      program.helpers.assertInsideAppFolder();

      var config = parseCommand(opts, command);

      program.log.info(config.message);
      program.log();

      process.chdir(require('../lib/file-system').getAppPath());

      injectDebug(
        program,
        require('../lib/gulp/load-tasks').start(config.task)
      );
    });
  });

};
