var path = require('path');
var mysql = require('./lib/impl/mysql')();
var changelog = require('./lib/changelog');
var init = require('./lib/commands/init');
var config = {
  "rootPath": path.join(__dirname, 'migrations/'),
  "host": "127.0.0.1",
  "port": 3306,
  "user": "root",
  "password": "pwd01!",
  "change_log_table_name": "_change_log",
  "dialect": "mysql",
  "databases": [
    { "name": "eshop" },
    { "name": "test" }
  ]
};
init(config).then(() => {
  console.log('success');
}).catch(e => console.error(e.stack));
