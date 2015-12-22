'use strict';

var fs = require('fs');
var yaml = require('js-yaml');

/**
 * Read the configuration from a file at the given path.
 * @param {String} path the path of the configuration file.
 * @param {String} [type] specify the format of the file.
 * @returns {Object} configuration object.
 * @desc config file can be either JSON or YAML formatted.
 */
function readFromFile(path, type) {
  return new Promise(function(resolve, reject) {
    fs.readFile(path, 'utf8', function(err, contents) {
      if (err) reject(err);
      else {
        try {
          if (/\.ya?ml$/i.test(path) || type === 'yaml') { // yaml
            resolve(yaml.safeLoad(contents));
          } else if (/\.js$/i.test(path) || type === 'module' || type === 'js') { // node module
            resolve(require(path));
          } else if (/\.json$/i.test(path) || type === 'json') { // json
            resolve(JSON.parse(contents));
          } else {
            var result = null; // keep track the try result.

            // try each type against the given file util we found one. 
            ['yaml', 'json', 'module'].reduce((sequencer, type) => {
              return sequencer.then(() => {
                return result || readFromFile(path, type).then(config => {
                  if (typeof config === 'object') {
                    return (result = config);
                  } else {
                    throw Error();
                  }
                }).catch(e => null);
              });
            }, Promise.resolve()).then(() => {
              if (!result) {
                reject(new Error('unexpected config file format, expected yaml, json or node module. '));
              } else {
                resolve(result);
              }
            });
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

module.exports.readFromFile = readFromFile;
