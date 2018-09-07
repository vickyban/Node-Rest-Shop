const http = require('http');
const app = require('./app');

const port = process.env.PORT || 3000;

// accept a listener that get execute when we get a new request
const server = http.createServer(app);

server.listen(port);
