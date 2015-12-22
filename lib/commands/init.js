/**
 * the init command handler.
 */
var fs = require('fs');
var pathutil = require('path');
var factory = require('../factory');
var changelog = require('../changelog');
var writeFile = require('../utils/writeFile');
var rmdir = require('../utils/rmdir');

/**
 * Init the given database specified as the config.
 * @param {Object} dbConfig the database config.
 * @returns {Promise}
 */
function init(dbConfig) {
  const dialect = dbConfig.dialect;
  const provider = factory.getProvider(dialect);
  provider.init(dbConfig);
  const dbName = dbConfig.name;
  const dbPath = pathutil.join(dbConfig.rootPath, dbName);
  return Promise.all([
    provider.getTables(dbName, ['_change_log']),
    provider.getViews(dbName),
    rmdir(dbPath),
    changelog.init(provider, dbName).then(() => changelog.empty(provider, dbName))
  ]).then(result => {
    const tables = result[0];
    const views = result[1];
    const exportTables = Promise.all(tables.map(table => {
      return Promise.all([
        provider.exportTableSchema(table.tableSchema, table.tableName),
        provider.exportTableIndexes(table.tableSchema,table.tableName),
        provider.exportTableConstraints(table.tableSchema,table.tableName)
      ]).then(result => {
        const tableSchemaSql = result[0];
        const tableIndexesSql = result[1];
        const tableConstaintsSql = result[2];
        return Promise.all([
          writeFile(`${pathutil.join(dbPath, 'tables/', table.tableName + '.sql')}`, tableSchemaSql),
          tableIndexesSql ? writeFile(`${pathutil.join(dbPath, 'indexes/', table.tableName + '.sql')}`, tableIndexesSql) : Promise.resolve(),
          tableConstaintsSql ? writeFile(`${pathutil.join(dbPath, 'constraints/', table.tableName + '.sql')}`, tableConstaintsSql) : Promise.resolve()
        ]);
      });
    }));
    const exportViews = Promise.all(
      views.map(viewName => {
        return provider.exportViewDefinition(dbName, viewName).then(viewDefinition => {
          return writeFile(`${pathutil.join(dbPath, 'views/', viewName + '.sql')}`, viewDefinition);
        });
      })
    );
    return Promise.all([exportTables, exportViews]);
  })
  .then(() => provider.dispose())
  .catch(e => {
    provider.dispose();
    throw e;
  }); 
}

/**
 * init changelogs for all databases in the config.
 * @param {Object} config storage configurations.
 * @returns {Promise}
 */
module.exports = function(config) {
  if (!config.rootPath) {
    config.rootPath = pathutil.join(__dirname, 'migrations');
  }
  if (!pathutil.isAbsolute(config.rootPath)) {
    config.rootPath = pathutil.join(__dirname, config.rootPath);
  }
  return Promise.all(
    config.databases.map(dbConfig => {
      dbConfig = Object.assign({}, {
        host: config.host,
        port: config.port,
        user: config.user,
        password: config.password,
        dialect: config.dialect,
        rootPath: config.rootPath
      }, dbConfig);
      return init(dbConfig);
  }));
}
