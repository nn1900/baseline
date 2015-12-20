'use strict';

var mysql = require('mysql');
var exec = require('child_process').exec;

/**
 * @constructor
 * @param {Object} [config] configuration to init the data provider.
 * @classdesc MySQL data provider implementation.
 */
function MySql(config) {
  config && this.init(config);
}

Object.assign(MySql.prototype, {

  /**
   * Init the data provider w/ the given config.
   * @param {Object} config data provider configuration.
   * @param {String} config.host host to connect to
   * @param {Number} [config.port] port to connect to
   * @param {String} config.user user name to authenticate
   * @param {String} config.password password to authenticate
   * @param {String} config.database database to use when connected.
   * @returns {Object} {@link MySql} self
   */
  init: function(config) {
    this.config = config;
    this.conn = mysql.createPool({
      host: config.host,
      port: config.port,
      user: config.user,
      password: config.password,
      database: config.database
    });
    return this;
  },

  /**
   * Execute a query w/ the given sql statement and params.
   * @param {String} sql sql statement to execute.
   * @param {Object} [params] parameters for the sql statement.
   * @returns {Promise}
   */
  query: function(sql, params) {
    var values;
    if (params) {
      if (typeof params !== 'object') {
        return Promise.reject(new Error('params can only be array or object. '));
      }
      if (Object.prototype.toString.call(params) == '[object Array]') {
        values = params;
      } else {
        // convert the params object to a list a param values.
        // this way, we need to parse the param names from the sql,
        // such as 'select * from tbl where col1 = @val1 and col2 = @val2'
        values = [];
        sql = sql.replace(/@[_a-z][_a-z0-9]*/gi, m => {
          values.push(params[m.substr(1)]);
          return '?';
        });
      }
    }
    return new Promise((resolve, reject) => {
      this.conn.query({ sql, values }, function(err, results) {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  },

  /**
   * Check if the given database exists.
   * @param {String} name name of the database.
   * @returns {Promise} true or false if resolved, otherwise Error.
   */
  doesDbExist: function(name) {
    return this.query(
      'select count(*) as count from information_schema.schemata where schema_name = ?',
      [name]
    ).then(res => {
      return res[0].count == 1;
    });
  },

  /**
   * Drop the given database.
   * @param {String} name the name of the database to drop.
   * @returns {Promise}
   */
  dropDb: function(name) {
    return this.query('drop database ??', [name]);
  },

  /**
   * Create a database w/ the given name, chartset and collate.
   * @param {String} name name of the database to create.
   * @param {String} [charset='utf8'] charset of the databse.
   * @param {String} [collate='utf8_general_ci'] collate of the database.
   * @param {Promise}
   */
  createDb: function(name, charset, collate) {
    charset = charset || 'utf8';
    collate = collate || 'utf8_general_ci';
    const sql = `create database ?? character set ? collate ?`;
    return this.query(sql, [name, charset, collate]);
  },

  /**
   * Backup the given database to a given file.
   * @param {String} name name of the database to backup.
   * @param {String} path location to save the backup file.
   * @param {Promise}
   */
  backupDb: function(name, path) {
    const command = [
      `mysqldump`,
      `--host=${this.config.host}`,
      `--port=${this.config.port || 3306}`,
      `--user=${this.config.user}`,
      `--password=${this.config.password}`,
      '--hex-blob',
      name,
      `--result-file=${path}`
    ].join(' ');
    return new Promise((resolve, reject) => {
      exec(command, function(err, stdout, stderr) {
        if (err) reject(err);
        else {
          resolve();
        }
      });
    });
  },

  /**
   * Dump the data of the a given table.
   * @param {String} db database name
   * @param {String} table table name
   * @param {String} path location to save the data
   * @param {String} [where] filter condition
   */
  dumpTableData: function(db, table, path, where) {
    const command = [
      `mysqldump`,
      `--host=${this.config.host}`,
      `--port=${this.config.port || 3306}`,
      `--user=${this.config.user}`,
      `--password=${this.config.password}`,
      `--hex-blob`,
      `--compact`,
      `--skip-add-locks`,
      `--no-create-info`,
      `--no-create-db`,
      `--result-file=${path}`,
      where ? `--where="${where}"` : '',
      db,
      table,
    ].filter(x => x).join(' ');
    return new Promise((resolve, reject) => {
      exec(command, function(err, stdout, stderr) {
        if (err) reject(err);
        else {
          resolve();
        }
      });
    });
  },

  /**
   * Dispose the provider.
   * @returns {Promise}
   */
  dispose: function(callback) {
    if (typeof callback === 'function') {
      return this.conn.end(callback);
    }
    return new Promise((resolve, reject) => {
      this.conn.end(function(err) {
        if (err) reject(err);
        else resolve();
      });
    });
  }

});

module.exports = MySql;
