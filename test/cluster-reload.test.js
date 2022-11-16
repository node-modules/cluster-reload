/**!
 * cluster-reload - test/cluster-reload.test.js
 *
 * Copyright(c) node-modules and other contributors.
 * MIT Licensed
 *
 * Authors:
 *   fengmk2 <m@fengmk2.com> (http://fengmk2.com)
 */

"use strict";

/**
 * Module dependencies.
 */

var assert = require('assert');
var numCPUs = require('os').cpus().length;
var urllib = require('urllib');
var reload = require('../');

describe('cluster-reload.test.js', function () {
  before(function (done) {
    require('./master');
    setTimeout(done, 500);
  });

  after(function (done) {
    setTimeout(done, 2000);
  });

  it('should got 200', function (done) {
    urllib.request('http://localhost:7001', function (err, data, res) {
      assert(!err);
      assert.equal(data.toString(), 'hello world\n');
      assert.equal(res.statusCode, 200);
      done();
    });
  });

  it('should work with reloading', function (done) {
    reload();
    urllib.request('http://localhost:7001', function (err, data, res) {
      assert(!err);
      assert.equal(data.toString(), 'hello world\n');
      assert.equal(res.statusCode, 200);
      done();
    });
  });

  it('should work with reload again', function (done) {
    reload(numCPUs);
    reload(numCPUs);
    urllib.request('http://localhost:7001', function (err, data, res) {
      assert(!err);
      assert.equal(data.toString(), 'hello world\n');
      assert.equal(res.statusCode, 200);
      setTimeout(done, 2000);
    });
  });

  it('should reload 1 workers still work', function (done) {
    reload(1);
    urllib.request('http://localhost:7001', function (err, data, res) {
      assert(!err);
      assert.equal(data.toString(), 'hello world\n');
      assert.equal(res.statusCode, 200);
      setTimeout(done, 2000);
    });
  });

  it('should exit and reload work', function (done) {
    urllib.request('http://localhost:7001/exit', function (err) {
      assert(err);
      reload(1);
      reload(1);
      reload(1);
      reload(1);
      setTimeout(function () {
        urllib.request('http://localhost:7001', function (err, data, res) {
          assert(!err);
          assert.equal(data.toString(), 'hello world\n');
          assert.equal(res.statusCode, 200);
          done();
        });
      }, 1000);
    });
  });

  it('should call reload method by worker process and no error', function (done) {
    urllib.request('http://localhost:7001/reload', function (err, data, res) {
      assert(!err);
      assert.equal(data.toString(), 'hello world\n');
      assert.equal(res.statusCode, 200);
      
      urllib.request('http://localhost:7001', function (err, data, res) {
        assert(!err);
        assert.equal(data.toString(), 'hello world\n');
        assert.equal(res.statusCode, 200);
        done();
      });
    });
  });
});
