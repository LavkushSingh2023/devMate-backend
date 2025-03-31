const { Server } = require("socket.io");
require("dotenv").config();

module.exports = (server) => {
  const io = new Server(server, {
    cors: {
      origin:
        process.env.NODE_ENV === "production" ? process.env.CORS_ORIGIN : "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("New client connected:", socket.id);

    socket.on("message", (msg) => {
      console.log("Message received:", msg);
      io.emit("message", msg); // Broadcast the message to all connected clients
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });
};
