// sockets/socket.js
const activeUsers = new Map();

const ioInstance = {
  io: null,
};

const registerSocket = (io) => {
  io.on('connection', (socket) => {
    console.log(` User connected: ${socket.id}`);

    socket.on('register', (userId) => {
      activeUsers.set(userId, socket.id);
      socket.join(userId); // Join room based on user ID
      console.log(` Registered user ${userId} with socket ID ${socket.id}`);
    });

    socket.on('disconnect', () => {
      for (let [userId, id] of activeUsers.entries()) {
        if (id === socket.id) {
          activeUsers.delete(userId);
          break;
        }
      }
      console.log(` User disconnected: ${socket.id}`);
    });
  });
};

const getSocketIdByUserId = (userId) => {
  return activeUsers.get(userId.toString());
};

module.exports = {
  registerSocket,
  getSocketIdByUserId,
  ioInstance
};
