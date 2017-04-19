'use strict';

const http = require('http');
http.createServer(function(req, res) {
  if (req.url === '/exit') {
    throw new Error('exit error');
  }
  res.writeHead(200);
  res.end('hello world\n');
}).listen(7001);
console.log('worker %s start', require('cluster').worker.id);
