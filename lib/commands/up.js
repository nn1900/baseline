/**
 * the up migration command handler.
 */
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
var colors = require('colors');

var RE_CHANGE_SCRIPT_FILE_NAME = /^(\d{2}\.\d{2}\.\d{4})\.sql$/i;

/**
 * Execute sql script in the given file.
 * @param {Object} provider the database provider
 * @param {String} path the path of the sql script
 * @returns {Promise}
 */
function execSqlFile(provider, path) {
  return stat(path).then(stats => {
    if (!stats.isFile()) {
      throw new Error('SQL file expected, but directory is received. ');
    }
  }).then(() => readFile(path)).then(contents => {
    console.log(`exec ${path}... `);
    return provider.query(contents);
  });
}

/**
 * Execute all sql scripts in the given directory.
 * @param {Object} provider the database provider
 * @param {String} path the path of the directory
 * @returns {Promise}
 */
function execSqlFilesInDir(provider, path) {
  return stat(path, true).then(stats => {
    if (stats && !stats.isDirectory()) {
      throw new Error('Directory expected, but file is received. ');
    }
    return stats ? glob('*.sql', { cwd: path }) : [];
  }).then(files => {
    // execute the script files in sequence.
    return files.reduce((p, file) => {
      return p.then(() => execSqlFile(provider, pathutil.join(path, file)));
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
  const dbPath = pathutil.join(dbConfig.rootPath, dbName);
  return provider.doesDbExist(dbName).then(exists => {
    if (!exists) {
      // if the database does not exists, try to create it
      // from the baseline produced by the init command.
      return provider.createDb(dbName, dbConfig.charset, dbConfig.collate)
        .then(() => changelog.init(provider, dbName))
        .then(() =>
          ['tables', 'indexes', 'constraints', 'views'].reduce(
            (p, dir) => p.then(() => execSqlFilesInDir(provider, pathutil.join(dbPath, dir))),
            Promise.resolve()
          )
        );
    }
  })
  .then(() => changelog.head(provider, dbName))
  .then(headVersion => {
    // then load the change script files from the 'changes' sub dir.
    if (!headVersion) headVersion = '00.00.0000';
    return glob('*.sql', {cwd: pathutil.join(dbPath, 'changes')})
      .then(files => {
        // the, calculate the set of change scripts to apply
        var match = null;
        return files.filter(x =>
          (match = RE_CHANGE_SCRIPT_FILE_NAME.exec(x)) &&
          match[1] > headVersion
        );
      });
  }).then(files => {
    // then, backup the database before applying changes to it.
    if (!files.length) return { files };
    const timestamp = moment().format('YYYYMMDD_HHmmss_SSSS');
    const backupPath = pathutil.join(dbPath, 'backups/', timestamp + '.sql');
    return mkdirp(pathutil.dirname(backupPath))
      .then(() => provider.backupDb(dbName, backupPath))
      .then(() => ({ files, backupPath }));
  }).then(args => {
    var backupPath = args.backupPath;
    var files = args.files;

    // then, apply change scripts to the current database.
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
        return execSqlFile(provider, pathutil.join(dbPath, 'changes/', file))
          .then(() => changelog.insert(provider, dbName, changeLog));
      }),
      Promise.resolve()
    ).catch(err => {
      // in case error occurrs while applying changes
      // restore the database using the backup.
      console.log(colors.red(`Error applying changes: ${err.message}, restoring... `));
      const restore = () => {
        return provider.restoreDb(dbName, backupPath).then(() => {
          console.log(colors.yellow('Database successfully restored. '));
          throw err;
        });
      };
      return provider.dropDb(dbName).catch(err => {
          console.log(colors.red(`Cannot drop the database before restoring: ${e.message}`));
          throw err;
        }).then(restore);
    });
  })
  .then(() => {
    provider.dispose();
  })
  .catch(e => {
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
  if (!config.rootPath) {
    config.rootPath = pathutil.join(__dirname, 'migrations');
  }
  if (!pathutil.isAbsolute(config.rootPath)) {
    config.rootPath = pathutil.join(__dirname, config.rootPath);
  }
  return config.databases.reduce((sequencer, dbConfig) => {
    dbConfig = Object.assign({}, {
      host: config.host,
      port: config.port,
      user: config.user,
      password: config.password,
      charset: config.charset,
      collate: config.collate,
      dialect: config.dialect,
      rootPath: config.rootPath
    }, dbConfig);
    return sequencer.then(() => migrateUp(dbConfig));
  }, Promise.resolve());
}
