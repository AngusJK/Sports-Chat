const socket = io();

var messages = document.getElementById('message-container');
var chatform = document.getElementById('chat-form');
var chatinput = document.getElementById('chat-input');
var signinform = document.getElementById('sign-in-form');
var signininput = document.getElementById('sign-in-input');
let currentUser = '';

signinform.addEventListener('submit', (e) => {
  e.preventDefault();
  socket.emit('new-user', { username: signininput.value, id: socket.id });
});
// adds event listener to form
chatform.addEventListener('submit', (e) => {
  // prevents form from automatically submitting to a file
  e.preventDefault();
  // if there is data in the form, emit a chat message to the server along with clients socket id
  if (chatinput.value) {
    socket.emit('chat message', { text: chatinput.value, id: socket.id });
    chatinput.value = '';
  }
});

// creates a list element which contains the submitted message and appends it to the document
// function addMessageToHTML(message) {
//   const item = document.createElement('li');
//   item.textContent = message.text;
//   messages.append(item);
// }

function addMessageToHTML(message) {
  console.log(message);
  const div = document.createElement('div');
  div.classList.add('message');
  div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">${message.text}</p>`;
  messages.appendChild(div);
};

// listens for chat message to be emitted from server and calls method to handle it
socket.on('chat message', addMessageToHTML);

socket.on('new-user', (user) => {
  currentUser = user.username
  const div = document.createElement('div');
  div.classList.add('message');
  div.innerHTML = `<p>${currentUser} has joined the chat.</p>`;
  messages.appendChild(div);
});

// passes user connected alert to addMessageToHTML method for rendering
function alertUserConnected() {
  addMessageToHTML("User connected");
};

// listens for user connected to be emitted from server, calls alert user method
socket.on('user connected', alertUserConnected);

// listens for newClientConnect from server, creates list element to render data
socket.on('newClientConnect', (data) => {
  const item = document.createElement('li');
  item.textContent = data.description;
  messages.append(item);
});

socket.on('coonectToRoom', (data) => {
  console.log(data);
});
// window.scrollTo(0, document.body.scrollHeight);