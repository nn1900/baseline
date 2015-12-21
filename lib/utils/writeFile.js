var fs = require('fs');
var pathutil = require('path');
var mkdirp = require('mkdirp');

/**
 * Write the contents to the a file at the given path.
 * @param {String} path path of the file to write.
 * @param {String} contents contents of the file.
 * @returns {Promise}
 */
module.exports = function (path, contents) {
  // console.log('writing ' + path + '... '); 
  const dirname = pathutil.dirname(path);
  return new Promise((resolve, reject) => {
    mkdirp(dirname, err => {
      if (err) reject(err);
      else {
        fs.writeFile(path, contents, 'utf8', err => {
          if (err) reject(err);
          else resolve();
        });
      }
    });
  });
}
