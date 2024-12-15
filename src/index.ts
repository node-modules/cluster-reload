import cluster, { type Worker } from 'node:cluster';
import { cpus } from 'node:os';

// Windows not support SIGQUIT https://nodejs.org/api/process.html#process_signal_events
const KILL_SIGNAL = 'SIGTERM';
let reloading = false;
let reloadPadding = false;

export function reload(count?: number) {
  if (reloading) {
    reloadPadding = true;
    return;
  }
  if (!count) {
    count = cpus().length;
  }
  reloading = true;
  // find out all alive workers
  const aliveWorkers = [];
  for (const id in cluster.workers) {
    const worker = cluster.workers[id]!;
    const state = Reflect.get(worker, 'state');
    if (state === 'disconnected') {
      continue;
    }
    aliveWorkers.push(worker);
  }

  let firstWorker: Worker;
  let newWorker: Worker;

  function reset() {
    // don't leak
    newWorker.removeListener('listening', reset);
    newWorker.removeListener('exit', reset);

    if (firstWorker) {
      // console.log('firstWorker %s %s', firstWorker.id, firstWorker.state);
      firstWorker.kill(KILL_SIGNAL);
      setTimeout(function() {
        firstWorker.process.kill(KILL_SIGNAL);
      }, 100);
    }
    reloading = false;
    if (reloadPadding) {
      // has reload jobs, reload again
      reloadPadding = false;
      reload(count);
    }
  }

  firstWorker = aliveWorkers[0];
  newWorker = cluster.fork();
  newWorker.on('listening', reset).on('exit', reset);

  // kill other workers
  for (const worker of aliveWorkers) {
    // console.log('worker %s %s', worker.id, worker.state);
    worker.kill(KILL_SIGNAL);
  }

  // keep workers number as before
  const left = count - 1;
  for (let j = 0; j < left; j++) {
    cluster.fork();
  }
}
