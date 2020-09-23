/**
 * Gets the command and options from argv.
 */

var colors = require('colors/safe');

var yargs = require('yargs')
  .usage('Usage: $0 <command> [options]')
  .command('init', 'init the baselines of configured databases')
  .command('up', 'migrate the configured databases up from the baselines')
  .command('backup', 'backup the configured databases')
  .demand(1, colors.red('error: missing command to use, specify --help for available command and options'))
  .options({
    'config': {
      alias: 'c',
      describe: 'the database configurations to use with baseline'
    },
    'db': {
      alias: 'd',
      describe: 'the target database to use with the command'
    },
    'force': {
      alias: 'f',
      describe: 'used with init command, force init if baseline exists'
    },
    'production': {
      alias: 'p',
      describe: 'use production config (`.baselinerc.production`)'
    },
    'log-level': {
      describe: 'logging level: ' + colors.underline('verbose') + ' (default), ' + ['debug', 'info', 'warn', 'error'].map(level => colors.underline(level)).join(', ')
    },
    'output': {
      alias: 'o',
      describe: 'the output path of the database backup'
    },
    'output-file': {
      describe: 'the output file name of the database backup'
    }
  })
  .help('help', 'show help information')
  .showHelpOnFail(false)
  .version(function () {
    return require('../package').version;
  })
  .epilog('Copyright 2015, MIT licensed. ');

// remove the boolean type annoations at the usage option lines.
// see https://github.com/bcoe/yargs/issues/319
yargs.getOptions().boolean.splice(-2);

var argv = yargs.argv;

module.exports = {
  command: argv._[0],
  config: argv.config,
  production: !!argv.production,
  force: !!argv.force,
  logLevel: argv['log-level'] || 'verbose',
  output: argv.output,
  outputFile: argv.outputFile,
  yargs
};
