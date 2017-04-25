'use strict';

const http = require('http');
const server = http.createServer(function(req, res) {
  console.log('recieved request');
  if (req.url === '/exit') {
    throw new Error('exit error');
  }
  res.writeHead(200);
  res.end('hello world\n');
}).listen(7001);

process.on('SIGTERM', () => {
  console.log('recieved sigterm');
  server.close(() => {
    console.log('gracefully exit');
    process.exit(0);
  });
});

console.log('worker %s start', require('cluster').worker.id);
