/**
 * @file backup.js
 * @author eric <xuxiang@chachazhan.com>
 * @copyright (c) 2015-2017 mingchuan co., ltd.
 */

var fs = require('fs');
var pathutil = require('path');
var factory = require('../factory');
var changelog = require('../changelog');
var mkdirp = require('../utils/mkdirp');
var log = require('../utils/logger');
var colors = require('colors/safe');
var getDbPath = require('../utils/getDbPath');

function backup(dbConfig, output, outputFile) {
  const dialect = dbConfig.dialect;
  const provider = factory.getProvider(dialect);
  provider.init(dbConfig);
  const dbPath = getDbPath(dbConfig);
  const dbName = dbConfig.name;

  return provider.doesDbExist(dbName).then(exists => {
    if (!exists) {
      log.error(dbName + ' does not exist. ');
      return;
    }

    return changelog.head(provider, dbName).then(version => {
      let backupPath = output || pathutil.join(
        dbPath,
        dbConfig.backupDir || 'backups/',
        outputFile || (dbName + '-' + version + '.sql')
      );
      const dirname = pathutil.dirname(backupPath);
      const filename = pathutil.basename(backupPath);
      const extname = pathutil.extname(backupPath);
      const filenameWithoutExt = filename.substr(0, filename.length - extname.length);
      let i = 1;
      while (true) {
        if (!fs.existsSync(backupPath)) { break; }
        const name = `${filenameWithoutExt}-${i++}.sql`;
        backupPath = pathutil.join(dirname, name);
      }

      log.debug('%s > backing up database... ', dbName);
      return mkdirp(pathutil.dirname(backupPath))
        .then(() => {
          return provider.backupDb(dbName, backupPath).then(() => {
            log.debug('%s > %s', dbName, backupPath);
            log.info('%s > successfully backed up. ', dbName);
          });
        });
    }).catch(err => {
      log.error(
        dbName + ' has not integrated w/ baseline yet: %s',
        err.stack
      );
    }).then(() => {
      provider.dispose();
    });
  });
}

/**
 * Perform backup for the databases in the config.
 * @param {Object} config storage configurations.
 * @returns {Promise}
 */
module.exports = function (config, output, outputFile) {
  if (config.databases.length > 1) {
    output = null;
    outputFile = null;
  }
  return config.databases.reduce((sequencer, dbConfig) => {
    return sequencer.then(() => backup(dbConfig, output, outputFile));
  }, Promise.resolve());
};