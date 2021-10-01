const { on } = require('events')
const express = require('express')
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)
const PORT = process.env.PORT || 3000
const path = require('path')
const { formatMessage, saveMessage, getMessages } = require('./utils/messages')
const { userJoin, userLeave, getUser, getNumberOfUsers } = require('./utils/users.js')

app.use(express.static(path.join(__dirname, 'public')))

const adminName = 'Admin'

// listening for clients to connect
io.on('connection', (socket) => {
  socket.on('join-room', ({ username, room }) => {
    const user = userJoin(socket.id, username, room)
    socket.join(user.room)
    socket.emit('connectToRoom', formatMessage(adminName, null, `Hi ${username}. Welcome to the ${room.toLowerCase()} room.`))
    const msgs = getMessages(room)
    if (msgs.length > 0) {
      socket.emit('past messages', msgs)
    }
    io.to(room).emit('new-user', { msg: `${user.username} has joined the room.`, user: user })
    socket.on('chat message', (msg) => {
      // sends message to all clients in current room
      const currentUser = getUser(msg.id)
      saveMessage(room, currentUser.username, currentUser.id, msg.text)
      io.to(currentUser.room).emit('chat message', formatMessage(currentUser.username, currentUser.id, msg.text))
    })
    const numOfClients = getNumberOfUsers(room)
    io.to(room).emit('newClientConnect', { description: numOfClients + (numOfClients === 1 ? ' person' : ' people') + ' in the chat' })
    console.log('a user connected: ' + socket.id)
    
    socket.on('disconnect', () => {
      // broadcasts message to all clients except the one who triggered the event (the one who left)
      const user = getUser(socket.id)
      userLeave(socket.id)
      console.log('a user left the room: ' + user.username)
      // let user = getUser(socket.id);
      io.to(room).emit('new-user', { msg: `${user.username} has left the room.`, user: user })
      const numOfClients = getNumberOfUsers(user.room)
      io.to(room).emit('newClientConnect', { description: numOfClients + (numOfClients === 1 ? ' person' : ' people') + ' in the chat' })
      console.log('a user has disconnected')
    })
  })
})

http.listen(PORT, () => {
  console.log(`Sports Chat listening on port ${PORT}...`)
})
