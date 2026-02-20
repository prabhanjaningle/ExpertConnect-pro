const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const http = require("http");
const { Server } = require("socket.io");

require("dotenv").config();

const bookingRoutes = require("./routes/bookingRoutes");
const expertRoutes = require("./routes/expertRoutes");

const app = express();
const server = http.createServer(app);

// 🔥 Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

// Make io accessible inside routes
app.set("io", io);

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("DB Error:", err));

app.get("/", (req, res) => {
  res.send("API Working");
});

app.use("/bookings", bookingRoutes);
app.use("/experts", expertRoutes);

// 🔥 Listen using server (NOT app)
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});