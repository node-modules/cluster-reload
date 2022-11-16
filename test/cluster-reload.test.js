const assert = require('assert');
const numCPUs = require('os').cpus().length;
const urllib = require('urllib');
const reload = require('..');

function sleep(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

describe('cluster-reload.test.js', () => {
  before(async () => {
    require('./master');
    await sleep(500);
  });

  after(async () => {
    await sleep(2000);
  });

  it('should got 200', async () => {
    const { data, status } = await urllib.request('http://localhost:7001');
    assert.equal(data.toString(), 'hello world\n');
    assert.equal(status, 200);
  });

  it('should work with reloading', async () => {
    reload();
    const { data, status } = await urllib.request('http://localhost:7001');
    assert.equal(data.toString(), 'hello world\n');
    assert.equal(status, 200);
  });

  it('should work with reload again', async () => {
    reload(numCPUs);
    reload(numCPUs);
    const { data, status } = await urllib.request('http://localhost:7001');
    assert.equal(data.toString(), 'hello world\n');
    assert.equal(status, 200);
    await sleep(2000);
  });

  it('should reload 1 workers still work', async () => {
    reload(1);
    const { data, status } = await urllib.request('http://localhost:7001');
    assert.equal(data.toString(), 'hello world\n');
    assert.equal(status, 200);
  });

  it('should exit and reload work', async () => {
    await assert.rejects(async () => {
      await urllib.request('http://localhost:7001/exit');
    }, err => {
      assert(err);
      return true;
    });

    reload(1);
    reload(1);
    reload(1);
    reload(1);
    await sleep(1000);

    const { data, status } = await urllib.request('http://localhost:7001');
    assert.equal(data.toString(), 'hello world\n');
    assert.equal(status, 200);
  });
});
