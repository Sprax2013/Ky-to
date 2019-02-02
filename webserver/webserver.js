const http = require('http');
const app = require('./app');

const HOST = '127.0.0.1';
const PORT = 8089;

const server = http.createServer(app);

server.listen(PORT, HOST);