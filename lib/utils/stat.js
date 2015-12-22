var fs = require('fs');

/**
 * Check if the given file or directory exists.
 * @param {String} path path of the file or directory
 * @param {Boolean} [silence] ignore ENOENT error and returns null instead.
 * @returns {Promise}
 */
module.exports = function(path, silence) {
  return new Promise((resolve, reject) => {
    fs.stat(path, (err, stats) => {
      if (err) {
        if (silence && /ENOENT/.test(err.message)) {
          resolve(null);
        } else {
          reject(err);
        }
      }
      else resolve(stats);
    })
  });
};
