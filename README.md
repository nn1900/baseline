# baseline
A simple database migration and versioning tool. Basically, it works by maintaining change logs in the
database, and incrementally updating the database using user supplied change scripts. You can craft the
change scripts manually or use some tools (e.g., mysql workbench, etc. ) to generate them for you. Then,
you can add the database schema (tables, views, indexes, constraints, etc. ) exported by baseline and
these change scripts into your version control system such as git.

# Use case
Typically, when you use a database-first development approach, your team want to keep local development databases and want to keep track of the changes collaboratively w/ each other, then baseline could help.
However, baseline also supports other scenarios such as you team (probably a dedicated database team) is maintaining a shared database for development.

# Install & Usage
Baseline is a CLI tool that you could install via npm as below:
```bash
  npm install -g baseline
```

_ Note: this tool requires nodejs version 4.0.0 or above. _

Then, type `baseline --help` to see how to use it as below:

```
Usage: baseline <command> [options]

Commands:
  init  init the baselines of configured databases
  up    migrate the configured databases up from the baselines

Options:
  --config, -c  the database configurations to use with baseline
  --force, -f   used with init command, force init if a baseline already exists
  --log-level   logging level: verbose (default), debug, info, warn, error
  --help        show help information
  --version     Show version number

Copyright 2015, MIT licensed.
```

You have to create a configuration file for the databases that you want to add baseline support to.
Basically, you can use `--config` option or `.baselinerc` in the working directory to specify the required configurations. The config file support _YAML_, _JSON_ and _node module_ formats whichever way you choose for that. See the sample configuration files below.

## initialize
First, use the `init` command to integrate your database with baseline, e.g.,
```bash
baseline init --config /path/to/the/config/file
```
or without the `--config` option:
```bash
baseline init
```
if there is a `.baselinerc` configuration file in the directory you're calling baseline.

When the init command executed successfully, baseline will export all the necessary schema of the database, including tables, indexes, constraints, views, etc., to the corresponding directories under the configured `rootPath` scoped by the database name. 

# Sample config files

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
