var pathutil = require('path');

/**
 * Gets the database config object w/ information at the root level merged.
 * @param {Object} dbConfig the database config object
 * @param {Object} config the root level config object
 * @returns {Object} merged database config object
 */
module.exports = function(dbConfig, config) {
  if (!config.rootPath) {
    config.rootPath = pathutil.join(process.cwd(), 'baseline');
  }
  if (!pathutil.isAbsolute(config.rootPath)) {
    config.rootPath = pathutil.join(process.cwd(), config.rootPath);
  }

  dbConfig = Object.assign({}, {
    host: config.host,
    port: config.port,
    user: config.user,
    password: config.password,
    charset: config.charset,
    collate: config.collate,
    dialect: config.dialect,
    rootPath: config.rootPath,
    backupDir: config.backupDir
  }, dbConfig);

  if (!pathutil.isAbsolute(dbConfig.rootPath)) {
    dbConfig.rootPath = pathutil.join(process.cwd(), dbConfig.rootPath);
  }

  return dbConfig; 
}
