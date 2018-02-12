// Get dependencies
const express = require('express');
const path = require('path');
const http = require('http');
const bodyParser = require('body-parser');
const socketIo = require('socket.io');
const io = socketIo(server);

let sockets = [];
// Get our API routes
const api = require('./server/routes/api');

const app = express();

// Parsers for POST data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// Point static path to dist
app.use(express.static(path.join(__dirname, 'dist')));

// Set our api routes
app.use('/api', api);

// Catch all other routes and return the index file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});

/**
 * Get port from environment and store in Express.
 */
const port = process.env.PORT || '3000';
app.set('port', port);

/**
 * Create HTTP server.
 */
const server = http.createServer(app);

/**
 * Handler functions
 */
function onConnect(socket) {

  console.log(socket.id);
  sockets.push(socket);
  socket.emit('getChats', games);
  socket.on('fromUser', (data) => {
    sockets.forEach(soc => {
      soc.emit('message', data);
    })
    // io.emit('message', data);
  });
  socket.on('createChat', (data) => {
    sockets.forEach(soc => {
      soc.emit('newChat', data.id);
    })
  });
}
function onMessage(data) {
  console.log(data);
  io.emit('message', data);
}

io.on('connection', onConnect);

server.listen(port);

/**
 * Listen on provided port, on all network interfaces.
 *
 *
 */
server.listen(port, () => console.log(`API running on localhost:${port}`));
