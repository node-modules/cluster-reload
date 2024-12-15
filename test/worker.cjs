/* eslint-disable @typescript-eslint/no-var-requires */
const http = require('node:http');

http.createServer(function(req, res) {
  if (req.url === '/exit') {
    throw new Error('exit error');
  }
  res.writeHead(200);
  res.end('hello world\n');
}).listen(7001, () => {
  console.log('worker %s listening at 7001', require('node:cluster').worker.id);
});
console.log('worker %s start', require('node:cluster').worker.id);
