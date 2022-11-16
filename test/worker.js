var http = require('http');
var reload = require('../');
http.createServer(function(req, res) {
  if (req.url === '/exit') {
    throw new Error('exit error');
  }
  if (req.url === '/reload') {
    reload(); // call reload by worker process
  }
  res.writeHead(200);
  res.end("hello world\n");
}).listen(7001);
console.log('worker %s start', require('cluster').worker.id);
