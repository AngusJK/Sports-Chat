const socket = io();

var messages = document.getElementById('messages');
var form = document.getElementById('form');
var input = document.getElementById('input');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  if (input.value) {
    socket.emit('chat message', { text: input.value, user: socket.id });
    input.value = '';
  }
});

function addMessageToHTML(message) {
  const item = document.createElement('li');
  console.log("new message added: " + message.text + " " + message.user);
  item.textContent = message.text;
  messages.append(item);
}

socket.on('chat message', addMessageToHTML);

function alertUserConnected() {
  addMessageToHTML("User connected");
}

socket.on('user connected', alertUserConnected);

// window.scrollTo(0, document.body.scrollHeight);