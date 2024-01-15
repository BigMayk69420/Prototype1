const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');
const http = require('http'); // Import http module
const WebSocket = require('ws'); // Import ws library for WebSocket
const admin = require('firebase-admin');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Create an HTTP server by wrapping the Express app
const server = http.createServer(app);

// Initialize Firebase Admin SDK with your service account credentials
const serviceAccount = require('./path-to-your-service-account-file.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// WebSocket connection handling (for real-time updates)
const wss = new WebSocket.Server({ noServer: true }); // noServer allows using an existing server

wss.on('connection', (ws) => {
  console.log('Client connected');

  // Send a welcome message to the connected client
  ws.send('WebSocket connection established. Welcome!');

  // Handle messages from the client (if needed)
  ws.on('message', (message) => {
    console.log(`Received message: ${message}`);
  });

  // Handle disconnection
  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('./src/routes/authRoutes');
const requestRoutes = require('./src/routes/requestRoutes');

app.use('/auth', authRoutes);
app.use('/requests', requestRoutes);

// WebSocket upgrade handling
server.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit('connection', ws, request);
  });
});

// Firebase Cloud Function for handling HTTP requests
exports.api = functions.https.onRequest(app);

// Event listener for successful MongoDB connection (This is MongoDB specific, you might need to update or remove it)
// This is for local development, you may need to handle the database connection differently in a cloud environment
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
