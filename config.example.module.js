var path = require('path');
module.exports = {
  rootPath: path.join(__dirname, 'temp/db'),
  host: '127.0.0.1',
  port: 3306,
  user: 'root',
  password: 'secret',
  dialect: 'mysql',
  databases: [
    { name: 'test1' },
    { name: 'test2', dialect: 'oracle', user: 'user', password: '...' }
  ]
};
