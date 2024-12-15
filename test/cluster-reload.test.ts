import { strict as assert } from 'node:assert';
import { cpus } from 'node:os';
import { setTimeout as sleep } from 'node:timers/promises';
import urllib from 'urllib';
import { reload } from '../src/index.js';

const numCPUs = cpus().length;

describe('test/cluster-reload.test.ts', () => {
  before(async () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    await import('./master.cjs');
    await sleep(1000);
  });

  after(async () => {
    await sleep(2000);
  });

  it('should got 200', async () => {
    const { data, status } = await urllib.request('http://127.0.0.1:7001');
    assert.equal(data.toString(), 'hello world\n');
    assert.equal(status, 200);
  });

  it('should work with reloading', async () => {
    let res = await urllib.request('http://127.0.0.1:7001');
    assert.equal(res.data.toString(), 'hello world\n');
    assert.equal(res.status, 200);
    // console.log(res);
    reload();
    let success = false;
    while (!success) {
      try {
        res = await urllib.request('http://127.0.0.1:7001');
        assert.equal(res.data.toString(), 'hello world\n');
        assert.equal(res.status, 200);
        success = true;
      } catch (err) {
        // console.error(err);
        await sleep(1000);
      }
    }
  });

  it('should work with reload again', async () => {
    reload(numCPUs);
    reload(numCPUs);
    let success = false;
    while (!success) {
      try {
        const res = await urllib.request('http://127.0.0.1:7001');
        assert.equal(res.data.toString(), 'hello world\n');
        assert.equal(res.status, 200);
        success = true;
      } catch (err) {
        // console.error(err);
        await sleep(1000);
      }
    }
    await sleep(2000);
  });

  it('should reload 1 workers still work', async () => {
    reload(1);
    let success = false;
    while (!success) {
      try {
        const res = await urllib.request('http://127.0.0.1:7001');
        assert.equal(res.data.toString(), 'hello world\n');
        assert.equal(res.status, 200);
        success = true;
      } catch (err) {
        // console.error(err);
        await sleep(1000);
      }
    }
  });

  it('should exit and reload work', async () => {
    await assert.rejects(async () => {
      await urllib.request('http://127.0.0.1:7001/exit');
    }, err => {
      assert(err);
      return true;
    });

    reload(1);
    reload(1);
    reload(1);
    reload(1);
    await sleep(1000);

    let success = false;
    while (!success) {
      try {
        const res = await urllib.request('http://127.0.0.1:7001');
        assert.equal(res.data.toString(), 'hello world\n');
        assert.equal(res.status, 200);
        success = true;
      } catch (err) {
        // console.error(err);
        await sleep(1000);
      }
    }
  });
});
