const { on } = require('events');
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const PORT = process.env.PORT || 3000;
const path = require('path');
const formatMessage = require('./utils/messages');
const { userJoin, getUser } = require('./utils/users.js');

app.use(express.static(path.join(__dirname, 'public')));

const adminName = "Admin";
// tracks how many clients are connected to the server at any given time
let numOfClients = 0;
// array of connected clients
let users = [];
// sets default room number to 1
let roomno = 1;
// creates custom namespace
//const nsp = io.of('/my-namespace');

// listening for clients to connect
io.on('connection', (socket) => {
  // if current room is at capacity, create a new room
  //if(io.of['/'].adapter.rooms['room-' + roomno] && io.of['/'].adapter.rooms['room-' + roomno].length > 2) roomno++;
  // add newly connected user to specific room
  // socket.on('join server', (username) => {
  //   const user = {
  //     username,
  //     id: socket.id
  //   }
  //   users.push(user);
  //   io.emit('new user', users);
  // });
  // socket.on('join room', (roomname, cb) => {
  //   socket.join(roomname);
  //   cb(messages[roomname]);
  // })
  socket.on('join-room', ({username, room}) => {

    const user = userJoin(socket.id, username, room);
    socket.join(user.room);
    socket.emit('connectToRoom', formatMessage(adminName, null, `You are in the ${room} room.`));
    



    io.emit('newClientConnect', { description: numOfClients + ' clients connected'});
    console.log("a user connected: " + socket.id);
    socket.on('new-user', (data) => {
      const user = {
        username: data.username,
        id: data.id
      }
      users.push(user);
      socket.broadcast.emit('new-user', { msg: `${user.username} has joined the chat.`, user: user });
      io.to(user.id).emit('new-user', { msg: `Welcome to the chat, ${user.username}.`, user: user });
    });
  })
  
  // sends message to new client confirming which room they have been added to
  
  // increment the number of clients when a client connects
  numOfClients++;
  // sends message event to client once they connect
  // socket.emit('newClientConnect', { description: "Hey, welcome to the chat!" });
  // broadcasts message to all connected clients except the one triggering the event
  
  // listens for chat message to be emitted by a client
  socket.on('chat message', (msg) => {
    // sends message to all connected clients
    let user = users.find(user => user.id === msg.id);
    io.emit('chat message', formatMessage(user.username, user.id, msg.text));
  });
  
  // listens for disconnect event
  socket.on('disconnect', () => {
    // decrements the number of connected clients
    numOfClients--;
    // broadcasts message to all clients except the one who triggered the event (the one who left)
    socket.broadcast.emit('newClientConnect', { description: numOfClients + ' clients connected.'});
    console.log(socket.id);
    let user; 
    if(users.find(user => user.id === socket.id)) {
      user = users.find(user => user.id === socket.id);
      socket.broadcast.emit('new-user', { msg: `${user.username} has left the chat.` });
    } else {
      socket.broadcast.emit('new-user', { msg: 'A user has left the chat.' });
    };
    console.log(user);
    console.log("a user has disconnected");
  });
});

http.listen(PORT, () => {
  console.log(`Sports Chat listening on port ${PORT}...`);
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