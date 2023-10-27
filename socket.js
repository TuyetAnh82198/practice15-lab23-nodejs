let io;
module.exports = {
  init: (httpServer) => {
    io = require("socket.io")(httpServer, {
      cors: {
        origin: "http://localhost:3000",
        allowedHeaders: [
          "Access-Control-Allow-Origin",
          "Access-Control-Allow-Credentials",
        ],
        credentials: true,
      },
    });
    return io;
  },
  getIO: () => {
    if (!io) {
      throw new Error("Socket.io not initialized!");
    } else {
      return io;
    }
  },
};
