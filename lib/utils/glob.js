var glob = require('glob');

/**
 * The glob function wrapper.
 * @param {String} pattern glob pattern
 * @param {Object} [options] glob options
 * @returns {Promise}
 */
module.exports = function(pattern, options) {
  return new Promise((resolve, reject) => {
    glob(pattern, options || {}, (err, files) => {
      if (err) reject(err);
      else resolve(files);
    });
  });
}
