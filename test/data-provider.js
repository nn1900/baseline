'use strict';

var chai = require('chai');
var expect = require('chai').expect;
var path = require('path');
var getProvider = require('../lib/getProvider');

/* polyfill Promise for older Node.js */
require('chai').should();

chai.use(require('chai-as-promised'));

describe('data providers', function() {

  it('should throws error if getting non-existed data provider', function() {
    expect(function() { getProvider('not_existed'); })
      .to.throw(/has not been implemented yet/);
  });

  it('should successfully get the mysql data provider', function() {
    getProvider('mysql').should.be.an('object');
  });
});
