# baseline
Database migration and versioning tool

```
Usage: baseline <command> [options]

Commands:
  init  init the baselines of configured databases
  up    migrate the configured databases up from the baselines

Options:
  --config, -c  the database configurations to use with baseline
  --force, -c   used with init command, force init if a baseline already exists
  --log-level   logging level: verbose (default), debug, info, warn, error
  --help        show help information
  --version     Show version number

Copyright 2015, MIT licensed.
```
# sample config files

Use `--config` option or `.baselinerc` in the working directory to specify the required configurations.

## YAML
```yaml
rootPath: ./temp/db
host: 127.0.0.1
port: 3306
user: root
password: secret
dialect: mysql
databases:
  - name: test1
  - name: test2
    dialect: oracle
    user: user
    password: password

```

## JSON
```json
{
  "rootPath": "./temp/db",
  "host": "127.0.0.1",
  "port": 3306,
  "user": "root",
  "password": "secret",
  "dialect": "mysql",
  "databases": [
    { "name": "test1" },
    { "name": "test2", "dialect": "oracle", "user": "user", "password": "..." }
  ]
}
```


## Node Module
```js
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

```
