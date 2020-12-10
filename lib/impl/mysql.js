'use strict';

var mysql = require('mysql');
var exec = require('child_process').exec;
var toCamelCasedObject = require('../utils/toCamelCasedObject');

/**
 * @constructor
 * @param {Object} [config] configuration to init the data provider.
 * @classdesc MySQL data provider implementation.
 */
function MySql(config) {
  if (!(this instanceof MySql)) {
    return new MySql(config);
  }
  config && this.init(config);
  return this;
}

Object.assign(MySql.prototype, {

  /**
   * Init the data provider w/ the given config.
   * @param {Object} config data provider configuration.
   * @param {String} config.host host to connect to
   * @param {Number} [config.port] port to connect to
   * @param {String} config.user user name to authenticate
   * @param {String} config.password password to authenticate
   * @param {String} config.name database to use when connected.
   * @returns {Object} {@link MySql} self
   */
  init: function(config) {
    this.config = config;
    this.conn = mysql.createPool({
      host: config.host,
      port: config.port,
      user: config.user,
      password: config.password,
      database: config.name,
      charset: config.collate && config.collate.toUpperCase(),
      multipleStatements: true
    });
    this.conn.on('connection', function(connection) {
      connection.query('SET sql_mode = ?', [
        'STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION'
      ]);
    });
    return this;
  },

  /**
   * Escape a given value.
   * @param {Mixed} value the value to escape.
   */
  escape: function(value) { return mysql.escape(value); },

  /**
   * Escape the given identifier.
   * @param {String} identifier the identifier to escape.
   */
  escapeId: function(identifier) { return mysql.escapeId(identifier); },

  /**
   * Execute a query w/ the given sql statement and params.
   * @param {String} sql sql statement to execute.
   * @param {Object} [params] parameters for the sql statement.
   * @returns {Promise}
   */
  query: function(sql, params, connection) {
    var values;
    if (!connection) connection = this.conn;
    if (params) {
      if (typeof params !== 'object') {
        return Promise.reject(new Error('params can only be array or object. '));
      }
      if (Object.prototype.toString.call(params) === '[object Array]') {
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
      connection.query({ sql, values }, function(err, results) {
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
    var self = this;

    var config = Object.assign({}, this.config, { database: '' });
    var connection = mysql.createConnection(config);
    return new Promise((resolve, reject) => {
      connection.connect(function(err) {
        if (err) {
          console.error('error connect to database. ');
          reject(err);
        }

        self.query(
          'select count(*) as count from information_schema.schemata where schema_name = ?',
          [name],
          connection
        ).then(res => {
          resolve(res[0].count == 1);
        }).catch(err => {
          reject(err);
        });

        connection.end();
      });
    });
  },

  /**
   * Check if the given database table exists.
   * @param {String} db name of the database.
   * @param {String} table name of the table to check.
   * @returns {Promise} true or false if resolved, otherwise Error.
   */
  doesTableExist: function(db, table) {
    return this.query(
      'select count(*) as count from information_schema.tables where table_schema = ? and table_name = ?',
      [db, table]
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
    return Promise.resolve();
  },

  /**
   * Drop the given database.
   * @param {String} name the name of the database to drop.
   * @returns {Promise}
   */
  dropDatabase: function(name) {
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
    var self = this;

    charset = charset || this.config.charset || 'utf8';
    collate = collate || this.config.collate || 'utf8_general_ci';
    const sql = `create database ?? character set ? collate ?`;

    var config = Object.assign({}, this.config, { database: '' });
    var connection = mysql.createConnection(config);
    return new Promise((resolve, reject) => {
      connection.connect(function(err) {
        if (err) {
          console.error('error connect to database. ');
          reject(err);
        }

        self.query(sql, [name, charset, collate], connection).then(res => {
          resolve(res);
        }).catch(err => {
          reject(err);
        });

        connection.end();
      });
    });
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
      `--result-file="${path}"`
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
   * Restore the given database from the backup.
   * @param {String} name of the database.
   */
  restoreDb: function(name, backupPath) {
    let charset, collate;
    if (typeof name === 'object') {
      charset = name.charset;
      collate = name.collate;
      name = name.name;
    }
    return this.doesDbExist(name).then(exists => {
      if (!exists) {
        return this.createDb(name, charset, collate);
      }
    }).then(() => {
      const command = [
        `mysql`,
        `--host=${this.config.host}`,
        `--port=${this.config.port || 3306}`,
        `--user=${this.config.user}`,
        `--password=${this.config.password}`,
        name,
        `<`,
        `"${backupPath}"`
      ].filter(x => x).join(' ');
      return new Promise((resolve, reject) => {
        exec(command, function(err, stdout, stderr) {
          if (err) reject(err);
          else {
            resolve();
          }
        });
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
   * Get all tables of the given db.
   * @param {String} db name of the database.
   * @param {Array} [excludes] a list of tables to excludes.
   * @returns {Promise}
   */
  getTables: function(db, excludes) {
    if (excludes && excludes.length) {
      excludes = ` and table_name not in (${excludes.map(x => mysql.escape(x)).join(', ')})`;
    } else {
      excludes = '';
    }
    const sql = [
      'select a.*, b.character_set_name',
      'from information_schema.tables a',
      'join information_schema.collations b',
      'on a.table_collation = b.collation_name',
      `where a.table_schema = ?${excludes} and a.table_type = 'BASE TABLE'`
    ].join(' ');
    return this.query(sql, [db]).then(
      res => res.map(x => toCamelCasedObject(x))
    );
  },

  /**
   * Get all views of the given db.
   * @param {String} db name of the database.
   * @param {Array} [excludes] a list of views to excludes.
   * @returns {Promise}
   */
  getViews: function(db, excludes) {
    if (excludes && excludes.length) {
      excludes = ` and table_name not in (${excludes.map(x => mysql.escape(x)).join(', ')})`;
    } else {
      excludes = '';
    }
    const sql = [
      'select table_name',
      'from information_schema.views',
      `where table_schema = ?${excludes}`
    ].join(' ');
    return this.query(sql, [db]).then(
      res => res.map(x => toCamelCasedObject(x).tableName)
    );
  },

  /**
   * Get the primary keys for the given table.
   * @param {String} db name of the database of the table
   * @param {String} table name of the table
   * @returns {Promise}
   */
  getPrimaryKeys(db, table) {
    const sql = [
      'select column_name',
      'from information_schema.key_column_usage',
      'where table_schema = ? and table_name = ? and constraint_name = \'primary\'',
      'order by ordinal_position'
    ].join(' ');
    return this.query(sql, [db, table]).then(
      res => res.map(x => toCamelCasedObject(x).columnName)
    );
  },

  /**
   * Get the columns for the given table.
   * @param {String} db name of the database of the table
   * @param {String} table name of the table
   * @returns {Promise}
   */
  getTableColumns(db, table) {
    const sql = [
      'select column_name, column_type, column_default, data_type, is_nullable, column_comment as comment, extra',
      'from information_schema.columns',
      'where table_schema = ? and table_name = ?'
    ].join(' ');
    return this.query(sql, [db, table]).then(
      res => res.map(x => toCamelCasedObject(x))
    );
  },

  /**
   * Get the info for the given table.
   * @param {String} db name of the database of the table
   * @param {String} table name of the table
   * @returns {Promise}
   */
  getTable(db, table) {
    const sql = [
      'select a.*, b.character_set_name',
      'from information_schema.tables a',
      'join information_schema.collations b',
      'on a.table_collation = b.collation_name',
      'where a.table_schema = ? and a.table_name = ? and a.table_type = \'BASE TABLE\''
    ].join(' ');
    return this.query(sql, [db, table]).then(
      res => res.map(x => toCamelCasedObject(x))[0]
    );
  },

  /**
   * Build column DDL text.
   * @param {Object} column column information.
   * @private
   */
  _buildColumnDdlText: function(column) {
    return [
      mysql.format('??', column.columnName),
      column.columnType,
      /NO/.test(column.isNullable) ? 'NOT NULL' : '',
      column.columnDefault ? mysql.format(`DEFAULT ?`, column.columnDefault) : '',
      /auto_increment/i.test(column.extra) ? 'AUTO_INCREMENT' : '',
      column.comment ? mysql.format('COMMENT ?', column.comment) : ''
    ].filter(x => x).join(' ');
  },

  /**
   * Export the schema of the given table in the given db.
   * @param {String} db name of the database of the table
   * @param {String} table name of the table to export schema for.
   * @returns {Promise}
   */
  exportTableSchema(db, table) {
    return Promise.all([
      this.getTable(db, table),
      this.getPrimaryKeys(db, table),
      this.getTableColumns(db, table)
    ]).then(res => {
      const tableInfo = res[0];
      const primaryKeys = res[1];
      const columns = res[2];
      return [
        mysql.format('CREATE TABLE ?? (', [table]),
        [
          ...columns.map(column => `  ${this._buildColumnDdlText(column)}`),
          primaryKeys.length ? `  PRIMARY KEY (${primaryKeys.map(x => mysql.format('??', x)).join(', ')})` : ''
        ].filter(x => x).join(', \n'),
        [
          `) ENGINE=${tableInfo.engine}`,
          tableInfo.characterSetName ? `DEFAULT CHARSET ${tableInfo.characterSetName}` : '',
          tableInfo.tableCollation ? `COLLATE ${tableInfo.tableCollation}` : '',
          tableInfo.tableComment ? mysql.format('COMMENT ?', tableInfo.tableComment)  : ''
        ].filter(x => x).join(' ')
      ].filter(x => x).join('\n') + ';';
    });
  },

  /**
   * Export the constaints of the given table in the given db.
   * @param {String} db name of the database of the table
   * @param {String} table name of the table to export constraints for.
   * @returns {Promise}
   */
  exportTableConstraints(db, table) {
    const sql = mysql.format([
      "SELECT CONCAT('ALTER TABLE `', c.TABLE_NAME, '` ADD CONSTRAINT `', c.CONSTRAINT_NAME, ",
      "'` FOREIGN KEY (`', k.COLUMN_NAME, '`) REFERENCES `', k.REFERENCED_TABLE_NAME, '` (`', ",
      "k.REFERENCED_COLUMN_NAME, '`) ', CASE UPPER(MATCH_OPTION) WHEN 'FULL' THEN 'MATCH FULL' ",
      "WHEN 'PARTIAL' THEN 'MATCH PARTIAL' WHEN 'SIMPLE' THEN 'MATCH SIMPLE' ELSE '' END, ",
      "' ON DELETE ', DELETE_RULE, ' ON UPDATE ', UPDATE_RULE, ';') as `sql`",
      "FROM information_schema.referential_constraints as c, information_schema.key_column_usage as k ",
      "WHERE c.constraint_schema = k.constraint_schema AND c.constraint_name = k.constraint_name ",
      "AND c.table_name = k.table_name AND k.TABLE_SCHEMA = ? AND k.TABLE_NAME = ?"
    ].join(''), [db, table]);
    return this.query(sql).then(res => res.map(x => x.sql).join('\n'));
  },

  /**
   * Export the indexes of the given table in the given db.
   * @param {String} db name of the database of the table
   * @param {String} table name of the table to export indexes for.
   * @returns {Promise}
   */
  exportTableIndexes(db, table) {
    const sql = mysql.format([
      "SELECT CONCAT('ALTER TABLE `', TABLE_NAME, '` ', 'ADD ',",
      "IF(NON_UNIQUE = 1, CASE UPPER(INDEX_TYPE) WHEN 'FULLTEXT' THEN 'FULLTEXT INDEX' WHEN 'SPATIAL' THEN 'SPATIAL INDEX' ",
      "ELSE CONCAT('INDEX `', INDEX_NAME, '` USING ', INDEX_TYPE) END, ",
      "IF(UPPER(INDEX_NAME) = 'PRIMARY', CONCAT('PRIMARY KEY USING ', INDEX_TYPE), ",
      "CONCAT('UNIQUE INDEX `', INDEX_NAME, '` USING ', INDEX_TYPE))), ",
      "'(',  GROUP_CONCAT(  DISTINCT  CONCAT('`', COLUMN_NAME, '`')  ",
      "ORDER BY SEQ_IN_INDEX ASC  SEPARATOR ', '  ),  ');'  ) AS `sql` ",
      "FROM information_schema.STATISTICS O WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ? AND UPPER(INDEX_NAME) != 'PRIMARY' AND INDEX_NAME NOT LIKE 'fk_%' ",
      "AND NOT EXISTS (SELECT * FROM information_schema.STATISTICS S WHERE O.TABLE_SCHEMA = S.TABLE_SCHEMA AND ",
      "O.TABLE_NAME = S.TABLE_NAME AND O.COLUMN_NAME = S.COLUMN_NAME AND S.NON_UNIQUE = 0 AND O.NON_UNIQUE = 1) ",
      "GROUP BY TABLE_NAME, INDEX_NAME ORDER BY TABLE_NAME ASC, INDEX_NAME ASC"
    ].join(''), [db, table]);
    return this.query(sql).then(res => res.map(x => x.sql).join('\n'));
  },

  /**
   * Export the view definition of the given view in the given db.
   * @param {String} db name of the database of the view.
   * @param {String} viewName name of the view to export.
   * @returns {Promise}
   */
  exportViewDefinition(db, viewName) {
    const sql = 'show create view ??.??';
    return this.query(sql, [db, viewName])
      .then(res => res[0]['Create View']);
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
      this.conn.end(err => {
        this.conn = null;
        if (err) reject(err);
        else resolve();
      });
    });
  }

});

module.exports = MySql;
