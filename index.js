'use strict';

const cluster = require('cluster');

module.exports = reload;

// Windows not support SIGQUIT https://nodejs.org/api/process.html#process_signal_events
const KILL_SIGNAL = 'SIGTERM';
let reloading = false;
let reloadPedding = false;

function reload(count = require('os').cpus().length, options = {}) {
  if (reloading) {
    reloadPedding = true;
    return;
  }

  const kill = options.kill || defaultKill;

  reloading = true;
  const aliveWorkers = getAliveWorkers();

  let newWorker;
  const firstWorker = aliveWorkers[0];

  function reset() {
    // don't leak
    newWorker.removeListener('listening', reset);
    newWorker.removeListener('exit', reset);

    if (firstWorker) kill(firstWorker);

    reloading = false;
    if (reloadPedding) {
      // pedding reload jobs exist, reload again
      reloadPedding = false;
      reload(count, options);
    }
  }

  // 1. fork one worker
  // 2. close first old worker after 1st worker started
  newWorker = cluster.fork()
    .on('listening', reset)
    .on('exit', reset);

  // 3. kill all other old workers
  for (const worker of aliveWorkers.slice(1)) {
    kill(worker);
  }

  // 4. for more workers, keep workers number as before
  const left = count - 1;
  for (let j = 0; j < left; j++) {
    cluster.fork();
  }
}

// find out all alive workers
function getAliveWorkers() {
  const aliveWorkers = [];
  for (const id in cluster.workers) {
    const worker = cluster.workers[id];
    if (worker.state === 'disconnected') continue;
    aliveWorkers.push(worker);
  }

  return aliveWorkers;
}

function defaultKill(worker) {
  worker.process.kill(KILL_SIGNAL); // 直接 kill 无法监听
}
