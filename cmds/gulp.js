'use strict';

var
  _ = require('lodash'),
  prettyTime = require('pretty-hrtime')
  ;

var commands = [
  {
    name: 'build',
    description: 'Build Quasar Project for Development',
    task: 'build',
    message: 'Building Quasar Project for ' + 'Development'.yellow
  },
  {
    name: 'dist',
    description: 'Build Quasar Project for PRODUCTION',
    task: 'dist',
    message: 'Building Quasar Project for ' + 'PRODUCTION'.red
  },
  {
    name: 'preview',
    description: 'Live Preview Quasar Project',
    task: 'preview',
    message: 'Live Previewing Quasar Project'
  },
  {
    name: 'monitor',
    description: 'Monitor Quasar Project & auto-build',
    task: 'monitor',
    message: 'Monitoring Quasar Project source files'
  },
  {
    name: 'clean',
    description: 'Clean Quasar Project',
    task: 'clean:all',
    message: 'Cleaning Quasar Project'
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
    .on('err', function(e) {
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
      program.log();
      program.log.info(command.message);
      program.log();

      injectDebug(
        program,
        require('../lib/gulp/load-tasks').start(command.task)
      );
    });
  });

};
