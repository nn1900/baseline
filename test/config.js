'use strict';

var readFromFile = require('../lib/config').readFromFile;
var chai = require('chai');
var expect = require('chai').expect;
var path = require('path');

/* polyfill Promise for older Node.js */
require('chai').should();

chai.use(require('chai-as-promised'));

describe('config', function() {
  beforeEach(function() {
  });

  describe('default config behavior', function() {
    it('should return promise', function() {
      readFromFile('path_not_exists')
        .should.be.an.instanceof(Promise);
    });

    it('should throws error if config file not found', function() {
      return readFromFile('path_not_exists')
        .should.be.rejectedWith(Error, /ENOENT: no such file or directory/);
    });

    it('should support json as config format', function() {
      return readFromFile(path.join(__dirname, './config/mysql.json'))
        .should.eventually.be.an('object')
        .and.should.eventually.contain.keys('host', 'port', 'user', 'password')
        .and.should.eventually.have.deep.property('databases[0].name');
    });

    it('should support yaml as config format', function() {
      return readFromFile(path.join(__dirname, './config/mysql.yml'))
        .should.eventually.be.an('object')
        .and.should.eventually.contain.keys('host', 'port', 'user', 'password')
        .and.should.eventually.have.deep.property('databases[0].name');
    });
  });
});
