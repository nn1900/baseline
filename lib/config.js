'use strict';

var fs = require('fs');
var yaml = require('js-yaml');

/**
 * Read the configuration from a file at the given path.
 * @param {String} path the path of the configuration file.
 * @returns {Object} configuration object.
 * @desc config file can be either JSON or YAML formatted.
 */
module.exports.readFromFile = function(path) {
  return new Promise(function(resolve, reject) {
    fs.readFile(path, 'utf8', function(err, contents) {
      if (err) reject(err);
      else {
        try {
          if (/\.ya?ml$/i.test(path)) { // yaml
            resolve(yaml.safeLoad(contents));
          } else if (/\.js$/i.test(path)) { // node module
            resolve(require(path));
          } else { // json
            resolve(JSON.parse(contents));
          }
        } catch (e) {
          if (/ENOENT: no such file or directory/.test(e.message)) {
            reject(e);
          } else {
            reject(
              new Error('Error parse the configuration file: ' + e.message)
            );
          }
        }
      }
    });
  });
};
