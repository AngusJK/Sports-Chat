const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const PORT = process.env.PORT || 3000;
const path = require('path');

app.use(express.static(path.join(__dirname, 'public')));

// tracks how many clients are connected to the server at any given time
let numOfClients = 0;

// creates custom namespace
const nsp = io.of('/my-namespace');

// listening for clients to connect
nsp.on('connection', (socket) => {
  // increment the number of clients when a client connects
  numOfClients++;
  // sends message event to client once they connect
  socket.emit('newClientConnect', { description: "Hey, welcome to the chat!" });
  // broadcasts message to all connected clients except the one triggering the event
  socket.broadcast.emit('newClientConnect', { description: numOfClients + ' clients connected.'});
  console.log("a user connected: " + socket.id);
  // listens for chat message to be emitted by a client
  socket.on('chat message', (msg) => {
    // sends message to all connected clients
    nsp.emit('chat message', msg);
  });
  // listens for disconnect event
  socket.on('disconnect', () => {
    // decrements the number of connected clients
    numOfClients--;
    // broadcasts message to all clients except the one who triggered the event (the one who left)
    socket.broadcast.emit('newClientConnect', { description: numOfClients + ' clients connected.'})
    console.log("a user has disconnected");
  })
});

http.listen(PORT, () => {
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