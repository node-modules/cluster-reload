'use strict';

const assert = require('assert');
const numCPUs = require('os').cpus().length;
const urllib = require('urllib');
const reload = require('../');

describe('cluster-reload.test.js', function() {
  before(function(done) {
    require('./master');
    setTimeout(done, 500);
  });

  after(function(done) {
    setTimeout(done, 2000);
  });

  it('should got 200', function(done) {
    urllib.request('http://localhost:7001', function(err, data, res) {
      assert(!err);
      assert.equal(data.toString(), 'hello world\n');
      assert.equal(res.statusCode, 200);
      done();
    });
  });

  it('should work with reloading', function(done) {
    reload();
    urllib.request('http://localhost:7001', function(err, data, res) {
      assert(!err);
      assert.equal(data.toString(), 'hello world\n');
      assert.equal(res.statusCode, 200);
      done();
    });
  });

  it('should work with reload again', function(done) {
    reload(numCPUs);
    reload(numCPUs);
    urllib.request('http://localhost:7001', function(err, data, res) {
      assert(!err);
      assert.equal(data.toString(), 'hello world\n');
      assert.equal(res.statusCode, 200);
      setTimeout(done, 2000);
    });
  });

  it('should reload 1 workers still work', function(done) {
    reload(1);
    urllib.request('http://localhost:7001', function(err, data, res) {
      assert(!err);
      assert.equal(data.toString(), 'hello world\n');
      assert.equal(res.statusCode, 200);
      setTimeout(done, 2000);
    });
  });

  it('should exit and reload work', function(done) {
    urllib.request('http://localhost:7001/exit', function(err) {
      assert(err);
      reload(1);
      reload(1);
      reload(1);
      reload(1);
      setTimeout(function() {
        urllib.request('http://localhost:7001', function(err, data, res) {
          assert(!err);
          assert.equal(data.toString(), 'hello world\n');
          assert.equal(res.statusCode, 200);
          done();
        });
      }, 1000);
    });
  });
});
