'use strict';

const reload = require('..');
const assert = require('assert');
const urllib = require('urllib');

const numCPUs = require('os').cpus().length;

describe('test/cluster-reload.test.js', () => {
  before(done => {
    require('./master');
    setTimeout(done, 500);
  });

  after(done => setTimeout(done, 2000));

  it('should got 200', done => {
    urllib.request('http://localhost:7001', (err, data, res) => {
      assert(!err);
      assert(data.toString() === 'hello world\n');
      assert(res.statusCode === 200);
      done();
    });
  });

  it('should work with reloading', done => {
    reload();
    urllib.request('http://localhost:7001', (err, data, res) => {
      assert(!err);
      assert(data.toString() === 'hello world\n');
      assert(res.statusCode === 200);
      done();
    });
  });

  it('should work with reload again', done => {
    reload(numCPUs);
    reload(numCPUs);
    urllib.request('http://localhost:7001', (err, data, res) => {
      assert(!err);
      assert(data.toString() === 'hello world\n');
      assert(res.statusCode === 200);
      setTimeout(done, 2000);
    });
  });

  it('should reload 1 workers still work', done => {
    reload(1);
    urllib.request('http://localhost:7001', (err, data, res) => {
      assert(!err);
      assert(data.toString() === 'hello world\n');
      assert(res.statusCode === 200);
      setTimeout(done, 2000);
    });
  });

  it('should exit and reload work', done => {
    urllib.request('http://localhost:7001/exit', err => {
      assert(err);
      reload(1);
      reload(1);
      reload(1);
      reload(1);
      setTimeout(() => {
        urllib.request('http://localhost:7001', (err, data, res) => {
          assert(!err);
          assert(data.toString() === 'hello world\n');
          assert(res.statusCode === 200);
          done();
        });
      }, 1000);
    });
  });
});
