const { on } = require('events');
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const PORT = process.env.PORT || 3000;
const path = require('path');
const formatMessage = require('./utils/messages');
const { userJoin, userLeave, getUser, getNumberOfUsers } = require('./utils/users.js');

app.use(express.static(path.join(__dirname, 'public')));

const adminName = "Admin";

// listening for clients to connect
io.on('connection', (socket) => {
  socket.on('join-room', ({username, room}) => {
    const user = userJoin(socket.id, username, room);
    socket.join(user.room);
    socket.emit('connectToRoom', formatMessage(adminName, null, `Hi ${username}. Welcome to the ${room.toLowerCase()} room.`));
    io.to(room).emit('new-user', { msg: `${user.username} has joined the room.`, user: user });
    socket.on('chat message', (msg) => {
      // sends message to all clients in current room
      let currentUser = getUser(msg.id);
      io.to(currentUser.room).emit('chat message', formatMessage(currentUser.username, currentUser.id, msg.text));
    });
    let numOfClients = getNumberOfUsers(room);
    io.to(room).emit('newClientConnect', { description: numOfClients + ' clients connected'});
    console.log("a user connected: " + socket.id);
    /*
    socket.on('new-user', (data) => {
      const user = {
        username: data.username,
        id: data.id
      }
      users.push(user);
      io.to(user.room).emit('new-user', { msg: `${user.username} has joined the chat.`, user: user });
      io.to(user.id).emit('new-user', { msg: `Welcome to the chat, ${user.username}.`, user: user });
    });
    */
    socket.on('disconnect', () => {
      // broadcasts message to all clients except the one who triggered the event (the one who left)
      const user = userLeave(socket.id);
      io.to(room).emit('newClientConnect', { description: numOfClients + ' clients connected'});
      console.log("a user left the room: " + socket.id);
      //let user = getUser(socket.id);
      io.to(room).emit('new-user', { msg: `${username} has left the room.`, user: user });
      console.log("a user has disconnected");
    });
  });
  
  // sends message to new client confirming which room they have been added to
  
  // increment the number of clients when a client connects
  // sends message event to client once they connect
  // socket.emit('newClientConnect', { description: "Hey, welcome to the chat!" });
  // broadcasts message to all connected clients except the one triggering the event
  
  // listens for chat message to be emitted by a client
  
  
  // listens for disconnect event
  
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