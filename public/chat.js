const io = require('socket.io')
const socket = io()
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true
})

const messages = document.getElementById('message-container')
const chatform = document.getElementById('chat-form')
const chatinput = document.getElementById('chat-input')
const clients = document.getElementById('clients')
const roomName = document.getElementById('room-name')
const leave = document.getElementById('leave')

const addMessageToHTML = function (message) {
  let selfClass = ''
  if (message.id === socket.id) { selfClass = 'self' }
  const div = document.createElement('div')
  div.classList.add('message')
  div.innerHTML = `<span class="post ${selfClass}"><p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">${message.text}</p></span><br>`
  messages.appendChild(div)
  messages.scrollTop = messages.scrollHeight
}

const alertUserConnected = function () {
  addMessageToHTML('User connected')
}

chatform.addEventListener('submit', (e) => {
  e.preventDefault()
  if (chatinput.value) {
    socket.emit('chat message', { text: chatinput.value, id: socket.id })
    chatinput.value = ''
  }
})

socket.emit('join-room', { username, room })

socket.on('chat message', (message) => {
  addMessageToHTML(message)
})

socket.on('new-user', (data) => {
  if (data.user.username !== username) {
    const div = document.createElement('div')
    div.classList.add('admin-message')
    div.innerHTML = `<p class="meta">${data.msg}</p>`
    messages.appendChild(div)
  }
})

socket.on('user connected', alertUserConnected)

socket.on('newClientConnect', (data) => {
  clients.innerHTML = data.description
})

socket.on('connectToRoom', (data) => {
  addMessageToHTML(data)
  let roomWithEmoji = ''
  if (room === 'Baseball') {
    roomWithEmoji = '⚾️  BASEBALL'
  } else if (room === 'Basketball') {
    roomWithEmoji = '🏀  BASKETBALL'
  } else if (room === 'Hockey') {
    roomWithEmoji = '🏒  HOCKEY'
  } else if (room === 'Soccer') {
    roomWithEmoji = '⚽️  SOCCER'
  } else if (room === 'Tennis') {
    roomWithEmoji = '🎾  TENNIS'
  }
  roomName.innerHTML = roomWithEmoji
})

socket.on('past messages', (msgs) => {
  console.log(msgs)
  for (const msg of msgs) {
    addMessageToHTML(msg)
  }
})

leave.addEventListener('click', () => {
  window.location = './index.html'
})
