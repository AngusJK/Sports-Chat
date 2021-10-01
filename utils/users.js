const users = []

const userJoin = function (id, username, room) {
  const user = { id, username, room }
  users.push(user)
  return user
}

const getUser = function (id) {
  return users.find(user => user.id === id)
}

const getNumberOfUsers = function (room) {
  const currentRoomUsers = users.filter(user => user.room === room)
  return currentRoomUsers.length
}

const userLeave = function (id) {
  const index = users.findIndex(user => user.id === id)
  if (index !== -1) {
    users.splice(index, 1)
  }
}

module.exports = {
  userJoin,
  getUser,
  getNumberOfUsers,
  userLeave
}
