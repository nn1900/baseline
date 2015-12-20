'use strict';

var chai = require('chai');
var expect = require('chai').expect;
var path = require('path');
var MySql = require('../lib/impl/mysql');

/* polyfill Promise for older Node.js */
require('chai').should();

chai.use(require('chai-as-promised'));

describe('mysql data provider', function() {

  var conn = new MySql({
    host: '127.0.01',
    user: 'root',
    password: 'pwd01!',
    database: 'test'
  });

  after(function(done) {
    conn.dispose(done);
  });

  describe('connection test', function() {
    it('should successfully connected to the database server', function() {
      return conn.query('select 1 + 1 as x')
        .should.eventually.have.deep.property('[0].x', 2);
    });
  });
});
