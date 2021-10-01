const moment = require('moment')

const messages = []

const formatMessage = function (username, id, text) {
  return {
    username,
    id,
    text,
    time: moment().format('h:mm a')
  }
}

const saveMessage = function (room, username, id, text) {
  const msg = formatMessage(username, id, text)
  msg.room = room
  messages.push(msg)
}

const getMessages = function (room) {
  return messages.filter(message => message.room === room)
}

module.exports = { formatMessage, saveMessage, getMessages }
