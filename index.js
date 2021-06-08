const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

io.on('connection', (socket) => {
  console.log('A user connected...');
});

const PORT = 3000;

server.listen(PORT, () => {
  console.log(`Chat app listening on port ${PORT}...`);
});


/*
const socket = require('socket.io');

const server = app.listen(PORT, () => {console.log(`Listening on port ${PORT}...`)});

app.use(express.static('public'));

const io = socket(server);
io.on('connection', (socket) => {
  console.log("Socket connection made...");
  socket.on('chat', (data) => {
    io.sockets.emit('chat', data);
  });
});
*/