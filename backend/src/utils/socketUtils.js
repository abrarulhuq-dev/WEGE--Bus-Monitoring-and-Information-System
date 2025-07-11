const { Server } = require("socket.io");

let io;
const usersByRole = { user: new Set(), admin: new Set(), driver: new Set() };

// Initialize Socket.io
const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    console.log("🔌 Client connected:", socket.id);

    // Expect role from the client
    socket.on("set_role", (role) => {
      if (["user", "admin", "driver"].includes(role)) {
        usersByRole[role].add(socket.id);
        console.log(`✅ User with role ${role} connected: ${socket.id}`);
      }
    });

    // Remove disconnected users
    socket.on("disconnect", () => {
      Object.keys(usersByRole).forEach((role) => usersByRole[role].delete(socket.id));
      console.log(`❌ Client disconnected: ${socket.id}`);
    });
  });
};

// Function to send updates only to users
const sendStopUpdateToUsers = (stop) => {
  if (!io) {
    console.error("❌ Socket.io not initialized");
    return;
  }

  usersByRole["user"].forEach((socketId) => {
    io.to(socketId).emit("update_stop_status", stop);
  });
};

// Function to send an incident message
const sendIncidentMessage = (adminMessage, userMessage) => {
  console.log("🚨 Attempting to send incident message...");

  if (!io) {
    console.error("❌ Socket.io not initialized");
    return;
  }

  console.log("📝 Admin Message:", adminMessage);
  console.log("📝 User Message:", userMessage);
  console.log("👥 Connected Admins:", [...usersByRole["admin"]]);
  console.log("👥 Connected Users:", [...usersByRole["user"]]);

  if (usersByRole["admin"].size === 0 && usersByRole["user"].size === 0) {
    console.warn("⚠️ No connected admins or users to send messages.");
    return;
  }

  // Send message to admins
  usersByRole["admin"].forEach((socketId) => {
    console.log(`📢 Sending to admin: ${socketId}`);
    io.to(socketId).emit("incident_report", adminMessage);
  });

  // Send message to users
  usersByRole["user"].forEach((socketId) => {
    console.log(`📢 Sending to user: ${socketId}`);
    io.to(socketId).emit("incident_alert", userMessage);
  });
};

module.exports = { initializeSocket, sendStopUpdateToUsers, sendIncidentMessage };
