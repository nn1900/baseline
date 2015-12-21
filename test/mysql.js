'use strict';

var chai = require('chai');
var expect = require('chai').expect;
var pathutil = require('path');
var fs = require('fs');
var MySql = require('../lib/impl/mysql');

/* polyfill Promise for older Node.js */
require('chai').should();

chai.use(require('chai-as-promised'));

describe('mysql data provider', function() {

  var mysql = new MySql({
    host: '127.0.01',
    user: 'root',
    password: 'pwd01!',
    database: 'test'
  });

  after(function(done) {
    mysql.dispose(done);
  });

  it('should successfully connected to the database server', function() {
    return mysql.query('select 1 + 1 as x')
      .should.eventually.have.deep.property('[0].x', 2);
  });

  it('should return false if checking a non existed database', function() {
    return mysql.doesDbExist('non_existed').should.eventually.be.false;
  });

  it('should return true if checking an existing database', function() {
    return mysql.doesDbExist('information_schema').should.eventually.be.true;
  });

  it('should successfully create new database and drop it', function(done) {
    mysql.createDb('not_existed').then(() => {
      return mysql.doesDbExist('not_existed').then(res => {
        expect(res).to.be.true;
        return mysql.dropDb('not_existed').then(() => {
          mysql.doesDbExist('not_existed').then(res => {
            expect(res).to.be.false;
            done();
          });
        });
      });
    }).catch(done);
  });

  it('should successfully backup a database', function(done) {
    const path = './temp/test.backup.sql';
    try { fs.statSync('./temp'); } catch (e) { fs.mkdirSync('./temp'); }
    mysql.backupDb('test', path).then(function() {
      expect(function() { fs.statSync(path); })
        .to.not.throw(Error, /no such file or directory/);
      try { fs.unlinkSync(path); } catch (e) {}
      done();
    }).catch(done);
  });

  it('should successfully restore a database', function(done) {
    const path = './temp/test.backup.sql';
    try { fs.statSync('./temp'); } catch (e) { fs.mkdirSync('./temp'); }
    mysql.backupDb('test', path).then(function() {
      expect(function() { fs.statSync(path); })
        .to.not.throw(Error, /no such file or directory/);
      return mysql.restoreDb('test2', path).then(function() {
        return mysql.doesDbExist('test2').then(res => {
          expect(res).to.be.true;
          try { fs.unlinkSync(path); } catch (e) {}
          done();
        });
      });
    }).catch(done);
  });

  it('should successfully dump data of a table', function(done) {
    const path = './temp/costs-data.sql';
    try { fs.statSync('./temp'); } catch (e) { fs.mkdirSync('./temp'); }
    mysql.dumpTableData('test', 'costs', path).then(function() {
      expect(function() { fs.statSync(path); })
        .to.not.throw(Error, /no such file or directory/);
      try { fs.unlinkSync(path); } catch (e) {}
      done();
    }).catch(done);
  });

  it('should get the primary keys of a table', function() {
    return mysql.getPrimaryKeys('eshop', 'user')
      .should.eventually.deep.have.property('[0]', 'user_id');
  });

  it('should get the table info of a table', function() {
    const promise = mysql.getTable('eshop', 'user');
    return Promise.all([
      promise.should.eventually.have.property('tableSchema', 'eshop'),
      promise.should.eventually.have.property('tableName', 'user')
    ]);
  });

  it('should get the columns of table', function() {
    const promise = mysql.getTableColumns('eshop', 'user');
    return Promise.all([
      promise.should.eventually.have.length.of.at.least(1),
      promise.should.eventually.have.deep.property('[0].columnName', 'user_id')
    ]);
  });

  it('should successfully export table schema', function() {
    return mysql.exportTableSchema('eshop', 'user')
      .should.eventually.be.a('string').contain('CREATE TABLE');
  });
});
