/**
 * @author: eric <eric.blueplus@gmail.com>
 * @copyright: (c) 2012-2016 reefoo co., ltd.
 */

'use strict'; 

var mkdirp = require('mkdirp');

/**
 * mkdir -p
 * @param {String} dirname dir path
 */
module.exports = function(dirname) {
  return new Promise((resolve, reject) => {
    mkdirp(dirname, err => {
      if (err) reject(err);
      else {
        resolve(dirname);
      }
    });
  });
}
