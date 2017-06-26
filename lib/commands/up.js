/**
 * the up migration command handler.
 */
'use strict';

var fs = require('fs');
var pathutil = require('path');
var factory = require('../factory');
var changelog = require('../changelog');
var stat = require('../utils/stat');
var readFile = require('../utils/readFile');
var writeFile = require('../utils/writeFile');
var rmdir = require('../utils/rmdir');
var glob = require('../utils/glob');
var mkdirp = require('../utils/mkdirp');
var moment = require('moment');
var log = require('../utils/logger');
var colors = require('colors/safe');
var getDbPath = require('../utils/getDbPath');

var RE_CHANGE_SCRIPT_FILE_NAME = /^(\d{2}\.\d{2}\.\d{4})\.sql$/i;

/**
 * Execute sql script in the given file.
 * @param {Object} provider the database provider
 * @param {String} path the path of the sql script
 * @returns {Promise}
 */
function execSqlFile(provider, path, dbConfig) {
  return stat(path).then(stats => {
    if (!stats.isFile()) {
      throw new Error('SQL file expected, but directory is received. ');
    }
  }).then(() => readFile(path)).then(contents => {
    log.verbose(
      '%s > exec %s... ',
      dbConfig.name,
      path.substr(dbConfig.rootPath.length + dbConfig.name.length + 1)
    );
    return provider.query(contents);
  });
}

/**
 * Execute all sql scripts in the given directory.
 * @param {Object} provider the database provider
 * @param {String} path the path of the directory
 * @returns {Promise}
 */
function execSqlFilesInDir(provider, path, dbConfig) {
  return stat(path, true).then(stats => {
    if (stats && !stats.isDirectory()) {
      throw new Error('Directory expected, but file is received. ');
    }
    return stats ? glob('*.sql', { cwd: path }) : [];
  }).then(files => {
    // execute the script files in sequence.
    return files.reduce((p, file) => {
      return p.then(() => execSqlFile(
        provider, pathutil.join(path, file), dbConfig
      ));
    }, Promise.resolve());
  });
}

/**
 * Migrate the given database up.
 * @param {Object} dbConfig the database config.
 * @returns {Promise}
 */
function migrateUp(dbConfig) {
  const dialect = dbConfig.dialect;
  const provider = factory.getProvider(dialect);
  provider.init(dbConfig);
  const dbName = dbConfig.name;
  const dbPath = getDbPath(dbConfig);
  var filesApplied = [];
  return provider.doesDbExist(dbName).then(exists => {
    if (!exists) {
      // if the database does not exists, try to create it
      // from the baseline produced by the init command.
      log.warn('%s > database does not exist, creating it... ', dbConfig.name);
      return provider.createDb(dbName, dbConfig.charset, dbConfig.collate)
        .then(() => provider.query(`use ${dbName}; `))
        .then(() => changelog.init(provider, dbName))
        .then(() =>
          ['tables', 'indexes', 'constraints', 'views'].reduce(
            (p, dir) => p.then(() =>
              execSqlFilesInDir(
                provider,
                pathutil.join(dbPath, dir),
                dbConfig
              )
            ),
            Promise.resolve()
          )
        );
    } else {
      return changelog.init(provider, dbName)
        .then(() =>
          ['tables', 'indexes', 'constraints', 'views'].reduce(
            (p, dir) => p.then(() =>
              execSqlFilesInDir(
                provider,
                pathutil.join(dbPath, dir),
                dbConfig
              )
            ),
            Promise.resolve()
          )
        );
    }
  })
  .then(() => changelog.head(provider, dbName))
  .then(headVersion => {
    // then load the change script files from the 'changes' sub dir.
    if (!headVersion) headVersion = '00.00.0000';
    log.debug('%s > current version (HEAD) is %s', dbConfig.name, headVersion);
    return glob('*.sql', {cwd: pathutil.join(dbPath, 'changes')})
      .then(files => {
        // the, calculate the set of change scripts to apply
        var match = null;
        return files.filter(x =>
          (match = RE_CHANGE_SCRIPT_FILE_NAME.exec(x)) &&
          match[1] > headVersion
        ).sort();
      });
  }).then(files => {
    // then, backup the database before applying changes to it.
    if (!files.length) return { files };
    const timestamp = moment().format('YYYYMMDD_HHmmss_SSSS');
    const backupPath = pathutil.join(dbPath, 'backups/', timestamp + '.sql');
    log.debug('%s > backing up database... ', dbConfig.name);
    return mkdirp(pathutil.dirname(backupPath))
      .then(() => provider.backupDb(dbName, backupPath))
      .then(() => ({ files, backupPath }));
  }).then(args => {
    var backupPath = args.backupPath;
    var files = args.files;

    filesApplied = files;

    // then, apply change scripts to the current database.
    log.debug('%s > applying changes... ', dbConfig.name);
    return files.reduce(
      (p, file) => p.then(() => {
        var match = RE_CHANGE_SCRIPT_FILE_NAME.exec(file);
        var parts = match[1].split('.');
        var changeLog = {
          majorVersion: parts[0],
          minorVersion: parts[1],
          revision: parts[2],
          changeScript: file
        };
        return execSqlFile(
          provider,
          pathutil.join(dbPath, 'changes/', file),
          dbConfig
        ).then(() => changelog.insert(provider, dbName, changeLog));
      }),
      Promise.resolve()
    ).catch(e => {
      const err = e;
      // in case error occurrs while applying changes
      // restore the database using the backup.
      log.error(
        '%s > error applying changes: %s. ',
        dbConfig.name,
        colors.underline(e.message.replace(/\n/gi, ' ').replace(/\s+/, ' '))
      );
      log.warn('%s > try to restore the database... ', dbConfig.name);
      return provider.dropDb(dbName).catch(e => {
        log.error(
          '%s > cannot drop the database before restoring: %s',
          dbConfig.name,
          e.message.replace(/\n/gi, ' ').replace(/\s+/, ' ')
        );
        throw e;
      })
      .then(() => provider.restoreDb(dbConfig, backupPath))
      .catch(e => {
        log.error(
          '%s > error restoring the database: %s',
          dbConfig.name,
          e.message.replace(/\n/gi, ' ').replace(/\s+/, ' ')
        );
      })
      .then(() => {
        log.warn('%s > database successfully restored. ', dbConfig.name);
        throw err;
      });
    });
  })
  .then(() => {
    log.info('%s > successfully applied %d changes', dbConfig.name, filesApplied.length);
    provider.dispose();
  })
  .catch(e => {
    log.error('%s > error migrate up the datebase: %s ', dbConfig.name, e.message);
    provider.dispose();
    throw e;
  });
}

/**
 * Perform up migration for the databases in the config.
 * @param {Object} config storage configurations.
 * @returns {Promise}
 */
module.exports = function(config) {
  return config.databases.reduce((sequencer, dbConfig) => {
    return sequencer.then(() => migrateUp(dbConfig));
  }, Promise.resolve());
}
