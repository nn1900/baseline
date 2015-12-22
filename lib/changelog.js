/**
 * contains the change log helper functions.
 */
Object.assign(module.exports, {

  /**
   * Init the given database w/ change log support.
   * @param {Object} provider the data provider.
   * @param {String} db name of the database to init
   * @returns {Promise}
   */
  init: function(provider, db) {
    return provider.doesTableExist(db, '_change_log').then(exists => {
      if (exists) return true;
      return provider.query([
        `create table ${provider.escapeId(db)}.${provider.escapeId('_change_log')} (`,
        '  `id` int auto_increment not null primary key, ',
        '  `major_version` varchar(2) not null, ',
        '  `minor_version` varchar(2) not null, ',
        '  `revision` varchar(4) not null, ',
        '  `change_script` varchar(255) not null, ',
        '  `applied_time` datetime not null',
        ')'
      ].join('\n'));
    });
  },

  /**
   * Gets the head version of the given db.
   * @param {Object} provider the data provider.
   * @param {String} db name of the database to init
   * @returns {Promise}
   */
  head: function(provider, db) {
    const sql =
    `select max(concat(major_version, '.', minor_version, '.', revision)) as head\n` +
    `from ${provider.escapeId(db)}.${provider.escapeId('_change_log')}`;
    return provider.query(sql).then(res => res[0].head);
  },

  /**
   * Get a list of change logs for the given db.
   * @param {Object} provider the data provider.
   * @param {String} db name of the database
   * @returns {Promise}
   */
  list: function(provider, db) {
    return provider.query(
      `select * from ${provider.escapeId(db)}.${provider.escapeId('_change_log')}`
    );
  },

  /**
   * Insert a new change log entry to the given database.
   * @param {Object} provider the data provider.
   * @param {String} db name of the database
   * @param {Object} changeLog change log info.
   * @returns {Promise}
   */
  insert: function(provider, db, changeLog) {
    const sql = [
      `insert into ${provider.escapeId(db)}.${provider.escapeId('_change_log')} (`,
      '  major_version, minor_version, revision, change_script, applied_time',
      ') values (',
      `  ${provider.escape(changeLog.majorVersion)}, `,
      `  ${provider.escape(changeLog.minorVersion)}, `,
      `  ${provider.escape(changeLog.revision)}, `,
      `  ${provider.escape(changeLog.changeScript)}, `,
      '  now()',
      ')'
    ].join('\n');
    return provider.query(sql);
  },

  /**
   * Clear the change logs of the given db.
   * @param {Object} provider the data provider.
   * @param {String} db name of the database
   * @returns {Promise}
   */
  empty: function(provider, db) {
    return provider.query(
      `delete from ${provider.escapeId(db)}.${provider.escapeId('_change_log')}`
    );
  }
});
