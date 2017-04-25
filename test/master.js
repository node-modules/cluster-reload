'use strict';

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

cluster.on('exit', worker => {
  console.log('worker %s died, current workers: %j', worker.id, Object.keys(cluster.workers));
});

console.log('master start');
