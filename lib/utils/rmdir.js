var exec = require('child_process').exec;

/**
 * Delete a non-empty directory.
 * @param {String} path path of the directory to delete.
 * @returns {Promise}
 */
module.exports = function(path) {
  return new Promise((resolve, reject) => {
    exec(`rm -rf "${path}"`, function(err, stdout, stderr) {
      if (err) reject(err);
      else resolve();
    });
  }); 
};
