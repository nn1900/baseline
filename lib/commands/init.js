/**
 * the init command handler.
 */
var fs = require('fs');
var pathutil = require('path');
var factory = require('../factory');
var changelog = require('../changelog');
var writeFile = require('../utils/writeFile');
var rmdir = require('../utils/rmdir');
var log = require('../utils/logger');
var getDbPath = require('../utils/getDbPath'); 

/**
 * Init the given database specified as the config.
 * @param {Object} dbConfig the database config.
 * @returns {Promise}
 */
function init(dbConfig, force) {
  const dialect = dbConfig.dialect;
  const provider = factory.getProvider(dialect);
  provider.init(dbConfig);
  const dbName = dbConfig.name;
  const dbPath = getDbPath(dbConfig);

  // check if the baseline already exists.
  return provider.doesTableExist(dbName, '_change_log').then(exists => {
    if (exists) {
      if (force) {
        log.warn(
          'database %s already has baseline inited, ' +
          'and --force option is used. ' +
          'rebuiling the baseline...  ',
          dbName
        );
      } else {
        throw new Error(
          `baseline of database ${dbName} has already been inited. ` +
          `use --force option to rebuild the baseline. `
        );
      }
    }
  }).then(() => {
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
    });
  })
  .then(() => {
    log.info('baseline of database %s has been successfully built.', dbName);
    provider.dispose();
  })
  .catch(e => {
    provider.dispose();
    throw e;
  });
}

/**
 * init changelogs for all databases in the config.
 * @param {Object} config storage configurations.
 * @param {Boolean} [force=false] if force init if the baseline already exists.
 * @returns {Promise}
 */
module.exports = function(config, force) {
  return config.databases.reduce((sequencer, dbConfig) => {
    return sequencer.then(() => init(dbConfig, force));
  }, Promise.resolve());
}
