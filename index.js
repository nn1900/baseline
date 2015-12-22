#! /usr/bin/env node

var fs = require('fs');
var pathutil = require('path');
var options = require('./lib/options');
var log = require('./lib/utils/logger');
var getMergedDbConfig = require('./lib/utils/getMergedDbConfig');
var readFromFile = require('./lib/config').readFromFile;
var stat = require('./lib/utils/stat');
var init = require('./lib/commands/init');
var up = require('./lib/commands/up');
var colors = require('colors/safe');

/**
 * the main entry point for the program.
 * @param {Object} config configuration information loaded
 *  from config file specified via --config or .baselinerc.
 */
function main(config) {
  if (!config.databases) {
    log.error('Config error: at lease one database should be configured. ');
    return;
  }

  // merge database configurations
  var map = {};
  for (var i = 0; i < config.databases.length; i++) {
    var dbConfig = getMergedDbConfig(config.databases[i], config);
    config.databases[i] = dbConfig;

    // check the required information of database config.
    if (!dbConfig.name) {
      log.error('Config error: missing name of database #%d. ', i);
      return;
    }

    if (map[dbConfig.name.toLowerCase()]) {
      log.error('Config error: database \'%s\' already exists. ');
      return;
    }

    var required = ['host', 'user', 'password', 'dialect'];
    for (var k = 0; k < required.length; k++) {
      if (!dbConfig[required[k]]) {
        log.error(
          'Config error: missing %s of database \'%s\'. ',
          colors.underline(required[k]),
          dbConfig.name
        );
        return;
      }
    }

    map[dbConfig.name.toLowerCase()] = dbConfig;
  }

  if (/^init$/i.test(options.command)) {
    init(config, options.force).catch(e => {
      log.error(e.message);
    })
  } else if (/^up$/i.test(options.command)) {
    up(config);
  }
}

if (!/^(init|up)$/i.test(options.command)) {
  log.error('Error: unknown command \'%s\'', options.command);
  return;
}

// if the config option is not specified, try to load the
// .baselinerc from the current working directory.
if (!options.config) {
  options.config = pathutil.join(process.cwd(), '.baselinerc');

  // check if the .baselinerc config file exists
  stat(options.config).then(() => {
    // yes, try to load config from it.
    readFromFile(options.config).then(result => {
      main(result);
    }).catch(e => {
      log.error(
        'Error load config from .baselinerc: %s',
        e.message
      );
    });
  }).catch(e => {
    log.warn(
      'Error: configuration file is not specified. You can specify\n' +
      'the config file via --config option or .baselinerc in the\n' +
      'directory where you call baseline. Use --help for more information. '
    );
  });
} else {
  readFromFile(options.config).then(result => {
    main(result);
  }).catch(e => {
    log.error('Error load config file: %s', e.message);
  });
}
