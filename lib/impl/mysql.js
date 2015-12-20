'use strict';

var mysql = require('mysql');

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
