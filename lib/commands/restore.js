/**
 * @file: restore.js
 * @author: eric <eric.blueplus@gmail.com>
 * @copyright: (c) 2015-2017 beego co., ltd
 */

var factory = require('../factory');
var log = require('../utils/logger');

function restore(dbConfig, backupFile, dropDatabase) {
  const dialect = dbConfig.dialect;
  const provider = factory.getProvider(dialect);
  provider.init(dbConfig);

  const dbName = dbConfig.name;

  return provider.doesDbExist(dbName).then(exists => {
    if (exists && dropDatabase) {
      return provider.dropDatabase(dbName);
    }
  }).then(() => {
    log.debug('%s > restoring up database... ', dbName);
    return provider.restoreDb(dbName, backupFile).then(() => {
      log.info('%s > successfully restored. ', dbName);
    });
  }).catch(err => {
    log.error('%s > restore failed: %s', dbName, err.stack);
  }).then(() => {
    provider.dispose();
  });
}

/**
 * Perform backup for the databases in the config.
 * @param {Object} config storage configurations.
 * @returns {Promise}
 */
module.exports = function (config, dbName, backupFile, dropDatabase) {
  const dbConfig = config.databases.find(x => x.name === dbName);
  if (!dbConfig) {
    log.error('Cannot find database configuration for %s', dbName);
    process.exit(1);
  }
  return restore(dbConfig, backupFile, dropDatabase);
};