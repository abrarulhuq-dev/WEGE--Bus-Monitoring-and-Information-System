const express = require("express");
const userRoutes = require("./routes/UserRoutes");
const bookingRoutes = require("./routes/BookingRoutes");
const busRoutes = require("./routes/BusRoutes");
const locationRoutes = require("./routes/LocationRoutes");
const notificationRoutes = require("./routes/NotificationRoutes");
const cors = require("cors");
const morgan = require("morgan");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const path = require("path");
const http = require("http");
const { initializeSocket } = require("./utils/socketUtils");

require("dotenv").config();

const app = express();
const server = http.createServer(app); // Create an HTTP server
initializeSocket(server); // Initialize Socket.IO with the server

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const port = process.env.PORT || 3000;

// CORS Configuration
app.use(
  cors({
    origin: "*",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(morgan("dev"));
app.use(cookieParser());
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));



// API Routes
app.use("/api/auth", userRoutes);
app.use("/api/booking", bookingRoutes);
app.use("/api/bus", busRoutes);
app.use("/api/location", locationRoutes);
app.use("/api/notify", notificationRoutes);

// Root Route
app.get("/", (req, res) => {
  res.send("Hello, API is running!");
});

// 404 Error Handling
app.use((req, res, next) => {
  const error = new Error("Route not found");
  error.status = 404;
  next(error);
});

// Global Error Handler
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    error: {
      message: err.message || "Internal Server Error",
    },
  });
});

// Start Server
server.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
