const moment = require('moment');

function formatMessage(username, id, text) {
  return {
    username,
    id,
    text,
    time: moment().format('h:mm a')
  }
}

module.exports = formatMessage;