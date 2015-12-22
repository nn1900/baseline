/**
 * General logger functions w/ coloring support.
 */
var util = require('util');
var colors = require('colors/safe');
var logLevel = require('../options').logLevel;

const LOG_LEVELS = {
  verbose: 0,
  debug: 1,
  info: 2,
  warn: 3,
  error: 4,
  fatal: 5
}

colors.setTheme({
  silly: 'rainbow',
  input: 'grey',
  verbose: 'grey',
  prompt: 'grey',
  info: 'green',
  data: 'grey',
  help: 'cyan',
  warn: 'yellow',
  debug: 'cyan',
  error: 'red'
});

Object.assign(module.exports, {
  /**
   * log verbose message.
   */
  verbose: function() {
    LOG_LEVELS[logLevel] <= LOG_LEVELS['verbose'] && console.log(
      colors.verbose(util.format.apply(util, arguments))
    );
  },

  /**
   * log debugging message.
   */
  debug: function() {
    LOG_LEVELS[logLevel] <= LOG_LEVELS['debug'] && console.log(
      colors.debug(util.format.apply(util, arguments))
    );
  },

  /**
   * log informal message.
   */
  info: function() {
    LOG_LEVELS[logLevel] <= LOG_LEVELS['info'] && console.log(
      colors.info(util.format.apply(util, arguments))
    );
  },

  /**
   * log warning message.
   */
  warn: function() {
    LOG_LEVELS[logLevel] <= LOG_LEVELS['warn'] && console.log(
      colors.warn(util.format.apply(util, arguments))
    );
  },

  /**
   * log error message.
   */
  error: function() {
    LOG_LEVELS[logLevel] <= LOG_LEVELS['warn'] && console.log(
      colors.error(util.format.apply(util, arguments))
    );
  }
});
