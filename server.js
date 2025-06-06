require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

const connectDB = require('./config/db');
const authRoutes = require('./routes/auth.routes');
const testrouter = require('./routes/test.routes');
const taskRoutes = require('./routes/task.routes');

const { registerSocket, ioInstance } = require('./sockets/socket');

const app = express();
app.use(cookieParser());
const server = http.createServer(app);

// Connect to DB
connectDB();

// Middlewares
app.use(cors({
  origin: 'http://localhost:3000', // Replace with your frontend
  credentials: true
}));
app.use(express.json());

app.get('/', (req, res) => {
  res.send('hello world');
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', testrouter);
app.use('/api/tasks', taskRoutes);

// Socket.io setup
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  }
});
registerSocket(io); // Register socket logic
ioInstance.io = io; // Exported for use in controller

// Server Listen
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(` Server running at http://localhost:${PORT}`);
});
