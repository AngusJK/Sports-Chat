const socket = io();

var messages = document.getElementById('messages');
var form = document.getElementById('form');
var input = document.getElementById('input');
var user = document.getElementById('user');

// adds event listener to form
form.addEventListener('submit', (e) => {
  // prevents form from automatically submitting to a file
  e.preventDefault();
  // if there is data in the form, emit a chat message to the server along with clients socket id
  if (input.value) {
    socket.emit('chat message', { text: input.value, name: user.value });
    input.value = '';
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