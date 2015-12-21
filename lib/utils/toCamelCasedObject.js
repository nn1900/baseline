const changeCase = require('change-case');

module.exports = function (obj) {
  return Object.keys(obj).reduce(
    (result, key) => { result[changeCase.camelCase(key)] = obj[key]; return result; },
    {}
  );
};
