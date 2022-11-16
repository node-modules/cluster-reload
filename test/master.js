const path = require('path');
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

cluster.setupMaster({
  exec: path.join(__dirname, 'worker.js'),
});

// Fork workers.
for (let i = 0; i < numCPUs; i++) {
  cluster.fork();
}

cluster.on('exit', function(worker, code, signal) {
  console.log('worker %s died, current workers: %j, code: %s, signal: %s',
    worker.id, Object.keys(cluster.workers), code, signal);
});
console.log('master start');
