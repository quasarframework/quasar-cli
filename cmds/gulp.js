'use strict';

var
  _ = require('lodash'),
  prettyTime = require('pretty-hrtime')
  ;

var commands = [
  {
    name: 'build',
    description: 'Build Quasar App for Development',
    task: 'build',
    message: 'Building Quasar App for ' + 'Development'.yellow
  },
  {
    name: 'dist',
    description: 'Build Quasar App for PRODUCTION',
    task: 'dist',
    message: 'Building Quasar App for ' + 'PRODUCTION'.red
  },
  {
    name: 'preview',
    description: 'Live Preview Quasar App',
    task: 'preview',
    message: 'Live Previewing Quasar App'
  },
  {
    name: 'rpreview',
    description: 'Live Preview Quasar App - Responsive View',
    task: 'rpreview',
    message: 'Live Previewing Quasar App with Responsive View'
  },
  {
    name: 'monitor',
    description: 'Monitor Quasar App & auto-build',
    task: 'monitor',
    message: 'Monitoring Quasar App source files'
  },
  {
    name: 'clean',
    description: 'Clean Quasar App',
    task: 'clean:all',
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

module.exports = function(program) {

  _.forEach(commands, function(command) {
    program
    .command(command.name)
    .description(command.description)
    .action(function() {
      program.helpers.assertInsideAppFolder();

      program.log();
      program.log.info(command.message);
      program.log();

      process.chdir(require('../lib/file-system').getAppPath());

      injectDebug(
        program,
        require('../lib/gulp/load-tasks').start(command.task)
      );
    });
  });

};
