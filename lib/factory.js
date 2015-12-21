var MySql = require('./impl/mysql');

var _impls = {
  'mysql': MySql
};

/**
 * Gets a data provider implementation for the given dialect.
 */
module.exports = {
  getProvider: function(dialect) {
    const Impl = _impls[dialect];
    if (!Impl) {
      throw new Error(dialect + ' data provider has not been implemented yet. ');
    }
    return new Impl();
  }
}
