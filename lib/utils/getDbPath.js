var path = require('path');

/**
 * Get db path from the given dbConfig.
 * @param {Object} dbConfig the database config.
 */
function getDbPath(dbConfig) {
  const dbName = dbConfig.alias || dbConfig.name;
  return path.join(dbConfig.rootPath, dbName);
}

module.exports = getDbPath;
