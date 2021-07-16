const moment = require('moment');

let messages = [];

function formatMessage(username, id, text) {
  return {
    username,
    id,
    text,
    time: moment().format('h:mm a')
  }
}

function saveMessage(room, username, id, text) {
  let msg = formatMessage(username, id, text);
  msg.room = room;
  messages.push(msg);
}

function getMessages(room) {
  return messages.filter(message => message.room === room);
}

module.exports = { formatMessage, saveMessage, getMessages };