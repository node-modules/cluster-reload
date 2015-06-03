var path = require('path');
var cluster = require('cluster');
var numCPUs = require('os').cpus().length;

cluster.setupMaster({
  exec: path.join(__dirname, 'worker.js')
});

// Fork workers.
for (var i = 0; i < numCPUs; i++) {
  cluster.fork();
}

cluster.on('exit', function(worker, code, signal) {
  console.log('worker %s died, current workers: %j', worker.id, Object.keys(cluster.workers));
});
console.log('master start');
