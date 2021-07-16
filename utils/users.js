const users = [];

function userJoin(id, username, room) {
  const user = {id, username, room};
  users.push(user);
  return user;
};

function getUser(id) {
  return users.find(user => user.id === id);
};

function getNumberOfUsers(room) {
  let currentRoomUsers = users.filter(user => user.room === room);
  console.log(room);
  console.log(currentRoomUsers);
  return currentRoomUsers.length;
}
module.exports = {
  userJoin,
  getUser,
  getNumberOfUsers
}
