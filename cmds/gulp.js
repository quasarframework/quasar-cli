'use strict';

var prettyTime = require('pretty-hrtime');

var commands = [
  {
    name: 'build',
    description: 'Build Quasar App',
    task: 'dev',
    message: '[Development]'.yellow + ' Building Quasar App',
    options: [
      {
        name: ['p', 'production', 'Build for ' + 'PRODUCTION'.red],
        task: 'prod',
        message: '[PRODUCTION]'.red + ' Building Quasar App'
      }
    ]
  },
  {
    name: 'preview',
    description: 'Live Preview Quasar App',
    task: 'preview:dev',
    message: '[Development]'.yellow + ' Live Previewing Quasar App',
    options: [
      {
        name: ['p', 'production', 'Production Preview'],
        task: 'preview:prod',
        message: '[PRODUCTION]'.red + ' Live Previewing Quasar App'
      }
    ]
  },
  {
    name: 'responsive',
    description: 'Live Preview Quasar App with Responsive View',
    task: 'responsive:dev',
    message: '[Development]'.yellow + ' Live Previewing Quasar App with Responsive View',
    options: [
      {
        name: ['p', 'production', 'Production Responsive Preview'],
        task: 'responsive:prod',
        message: '[PRODUCTION]'.red + ' Live Previewing Quasar App with Responsive View'
      }
    ]
  },
  {
    name: 'monitor',
    description: 'Monitor Quasar App & auto rebuild',
    task: 'monitor:dev',
    message: '[Development]'.yellow + ' Monitoring Quasar App',
    options: [
      {
        name: ['p', 'production', 'Production Monitoring'],
        task: 'monitor:prod',
        message: '[PRODUCTION]'.red + ' Monitoring Quasar App'
      }
    ]
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
  },
  {
    name: 'task <task>',
    description: 'Run Quasar App Specific Task',
    message: 'Running Quasar App Task: '
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
      program.log.error('!!! \'' + e.task.cyan + '\'', 'errored after'.red, prettyTime(e.hrDuration).magenta);
    })
    .on('err', function() {
      program.log.error('\n\n!!! FAILED task above. Bailing out!!!\n\n'.red);
    });

  return runner;
}

function parseCommand(opts, command) {
  var config;

  if (command.name === 'task <task>') {
    return {
      message: command.message + '[' + opts.yellow + ']',
      task: opts
    };
  }

  if (command.options) {
    Object.keys(command.options).forEach(function(key) {
      var option = command.options[key];

      if (!config && opts[option.name[1]]) {
        config = {
          message: option.message,
          task: option.task
        };
      }
    });
  }

  if (config) {
    return config;
  }

  return {
    message: command.message,
    task: command.task
  };
}

module.exports = function(program) {

  commands.forEach(function(command) {
    var cmd = program.command(command.name);

    if (command.options) {
      Object.keys(command.options).forEach(function(key) {
        var option = command.options[key];

        cmd.option('-' + option.name[0] + ', --' + option.name[1], option.name[2]);
      });
    }

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
