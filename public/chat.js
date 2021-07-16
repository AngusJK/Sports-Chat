const socket = io();
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true
});

var messages = document.getElementById('message-container');
var chatform = document.getElementById('chat-form');
var chatinput = document.getElementById('chat-input');
var clients = document.getElementById('clients');
var roomName = document.getElementById('room-name');

function addMessageToHTML(message) {
  let selfClass = "";
  if(message.id === socket.id) {selfClass = "self"};
  const div = document.createElement('div');
  div.classList.add('message');
  div.innerHTML = `<div class="post ${selfClass}"><p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">${message.text}</p></div>`;
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
};

function alertUserConnected() {
  addMessageToHTML("User connected");
};

chatform.addEventListener('submit', (e) => {
  e.preventDefault();
  if (chatinput.value) {
    socket.emit('chat message', { text: chatinput.value, id: socket.id });
    chatinput.value = '';
  }
});

socket.emit('join-room', { username, room });

socket.on('chat message', (message) => { 
  addMessageToHTML(message);
});

socket.on('new-user', (data) => {
  const div = document.createElement('div');
  div.classList.add('message');
  div.innerHTML = `<p class="meta">${data.msg}</p>`;
  messages.appendChild(div);
});

socket.on('user connected', alertUserConnected);

socket.on('newClientConnect', (data) => {
  clients.innerHTML = data.description;
});

socket.on('connectToRoom', (data) => {
  addMessageToHTML(data);
  roomName.innerHTML = room;
});