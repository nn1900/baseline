var fs = require('fs');

/**
 * Read contents of file at the given path.
 * @param {String} path path of the file to read
 * @returns {Promise}
 */
module.exports = function(path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, 'utf8', (err, contents) => {
      if (err) reject(err);
      else resolve(contents);
    })
  });
};
