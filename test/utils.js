'use strict';

var chai = require('chai');
var expect = require('chai').expect;
var writeFile = require('../lib/utils/writeFile');

/* polyfill Promise for older Node.js */
require('chai').should();

chai.use(require('chai-as-promised'));

describe('utils (helper functions)', function() {
  it('should successfully write file', function() {
    return writeFile('./hello/world/test.txt', 'hello, world')
      .should.eventually.be.fulfilled;
  });
});
