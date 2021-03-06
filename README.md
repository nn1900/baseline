[![NPM](https://nodei.co/npm/node-baseline.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/node-baseline/)

___Note: as of the current release, only mysql database is supported. But support for other databases has been planned.___

# Description
A simple database migration and versioning tool. Basically, it works by maintaining change logs in the
database, and incrementally updating the database using user supplied change scripts. You can craft the
change scripts manually or use some tools (e.g., mysql workbench, etc. ) to generate them for you. Then,
you can add the database schema (tables, views, indexes, constraints, etc. ) exported by baseline and
these change scripts into your version control system such as git.

# Use Case
Typically, when you use a database-first development approach, your team want to keep local development databases and want to keep track and sync of the changes collaboratively w/ each other, then baseline could help.
However, baseline also supports other scenarios such as you team (probably a dedicated database team) is maintaining a shared database for development, you want to apply the changes to the database in production, etc.

# Install & Usage
baseline is a CLI tool that could be installed via npm as below:
```bash
  npm install -g node-baseline
```

___Note: this tool requires nodejs version 4.0.0 or above.___

Then, type `baseline --help` to see how to use it as below:

```
Usage: baseline <command> [options]

Commands:
  init     init the baselines of configured databases
  up       migrate the configured databases up from the baselines
  backup   backup the configured databases
  restore  restore the specified configured database

Options:
  --config, -c      the database configurations to use with baseline
  --database, -d    the target database to use with the command
  --force, -f       used with init command, force init if baseline exists
  --production, -p  use production config (`.baselinerc.production`)
  --log-level       logging level: verbose (default), debug, info, warn, error
  --output, -o      the output path of the database backup
  --output-file     the output file name of the database backup
  --input, -i       input backup file used for database restore
  --drop-database   drop database before restore                       [boolean]
  --help            show help information
  --version         Show version number

Copyright 2015, MIT licensed.
```

You have to create a configuration file for the databases that you want to add baseline support to.
Basically, you can use `--config` option or `.baselinerc` in the working directory to specify the required configurations. The config file supports _YAML_, _JSON_ and _node module_ formats whichever way you choose for that. See the sample configuration files below.

## Init
First, use the `init` command to integrate your database with baseline, e.g.,
```bash
baseline init --config /path/to/the/config/file
```
or without the `--config` option if there is a `.baselinerc` configuration file in the directory you're calling baseline:
```bash
baseline init
```

When the init command executed successfully, baseline will create the `_change_log` table in the database and then export all the necessary schema of the database, including tables, indexes, constraints, views, etc., and an empty `changes` directory where your change scripts reside. All these files will go to the corresponding sub directories scoped by the database name under the configured `rootPath`. For example:
```
temp/db/test
├── changes
├── tables
│   ├── sales.sql
│   ├── attrs.sql
│   └── costs.sql
└── views
    ├── costs_view.sql
    └── sales_view.sql
```
where,  _temp/db/_ is the configured `rootPath`, and _test_ is the name of the database integrated w/ baseline.

## Migrate
You can add some change scripts to the `changes` directory (as mentioned above). The file names of the change scripts should follow the convention `major(\d{2}).minor(\d{2}).patch(\d{4}).sql`, and be increased sequentially,  e.g, `01.00.0001.sql`, `01.00.0002.sql`, ... `01.01.0001.sql`, etc.

Then, issue the `up` command below to apply the changes to the configured databases:
```bash
baseline up --config /path/to/the/config/file
```
or without the `--config` option if there is a `.baselinerc` configuration file in the directory you're calling baseline:
```bash
baseline up
```
Each time a database is updated by `up` command, it will be backed up firstly so that the database can be restored in case any error occurs while updating. When error indeed occurs, just fix it and re-execute the `up` command.

___Note___: _change scripts are typically not intended to be changed after being applied to database and even after being committed to version control system. If something is changed unexpectedly by some change scripts, don't worry, but just append and apply another new change scripts._

## Rebase
By rebasing, baseline will treat the current database as a fresh new one and re-integrate w/ it from a new start point. You can rebase the database at any time you want by using the `init` command with `--force	` option:
```bash
baseline init --config /path/to/the/config/file --force
```
or without the `--config` option if there is a `.baselinerc` configuration file in the directory you're calling baseline:
```bash
baseline init --force
```

# Collaborate
baseline is designed and implemented with team collaboration in mind. The typical workflow is:
- A integrates the database w/ baseline by `init`
- A commits all the necessary stuff generated by baseline to the git repository
- B pulls the stuffs committed by A
- B issues `baseline init` to create the database w/ baseline integrated
- A migrates up the database using change scripts by `up`
- A commits the change scripts to the git repository
- B pulls the change scripts committed by A
- B issues `baseline up` to apply the changes from A
- ...

However, there's a caveat here that when before one developer adds the change scripts to the `changes` directory, he/she __must__ first pull the change scripts from others first, and then adds and tests the changes scripts before commit.

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
    backup: true
    backupDir: /backup/dir
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
    {
      "name": "test1"
    },
    {
      "name": "test2",
      "dialect": "oracle",
      "user": "user",
      "password": "...",
      "backup": true,
      "backupDir": "/backupDir"
    }
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
    {
      name: 'test2',
      dialect: 'oracle',
      user: 'user',
      password: '...',
      backup: true,
      backupDir: '/backup/dir'
    }
  ]
};
```

# CHANGELOG
[CHANGELOG](./CHANGELOG.md)

# License
[MIT License](./LICENSE)
