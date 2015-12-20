'use strict';

var fs = require('fs');
var yaml = require('js-yaml');

/**
 * Read the configuration from a file at the given path.
 * @param {String} path the path of the configuration file.
 * @returns {Object} configuration object.
 */
module.exports.readFromFile = function(path) {
  return new Promise(function(resolve, reject) {
    function callback(err, contents) {
      if (err) reject(err);
      else {
        try {
          if (/\.ya?ml$/i.test(path)) {
            resolve(yaml.safeLoad(contents));
          } else {
            resolve(JSON.parse(contents));
          }
        } catch (e) {
          reject(
            new Error('Error parse the configuration file: ' + e.message)
          );
        }
      }
    }
    fs.readFile(path, 'utf8', callback);
  });
};
