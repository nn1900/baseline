var MySql = require('./impl/mysql');
var util = require('util');

var _impls = {
  'mysql': MySql
};

/**
 * Gets a data provider implementation for the given dialect.
 */
module.exports = {
  /**
   * Gets the data provider for the given database dialect.
   * @param {String} dialect database dialect.
   */
  getProvider: function(dialect) {
    const Impl = _impls[dialect];
    if (!Impl) {
      const keys = Object.keys(_impls);
      const msg = util.format(
        '%s data provider is not implemented yet. Currently only %s %s supported. ',
        dialect,
        keys.join(', '),
        keys.length > 1 ? 'are' : 'is'
      );
      throw new Error(msg);
    }
    return new Impl();
  }
}
