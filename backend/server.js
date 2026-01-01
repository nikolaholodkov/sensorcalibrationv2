// ============================================
// SENSOR CALIBRATION PORTAL - BACKEND SERVER
// ============================================
// This is the main entry point for the backend API server
// It handles all HTTP requests from the frontend

// Import required libraries
const express = require('express');           // Web framework for building APIs
const cors = require('cors');                 // Enables cross-origin requests (frontend can talk to backend)
const bodyParser = require('body-parser');    // Parses incoming JSON data from requests
require('dotenv').config();                   // Loads environment variables from .env file

// Create an Express application instance
// Think of this as creating your web server
const app = express();

// Set the port number - use environment variable or default to 5000
// The server will listen on this port (e.g., http://localhost:5000)
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Import routes
const personnelRoutes = require('./routes/personnel');
const sensorsRoutes = require('./routes/sensors');
const equipmentRoutes = require('./routes/equipment');
const reportsRoutes = require('./routes/reports');

// Use routes
app.use('/api/personnel', personnelRoutes);
app.use('/api/sensors', sensorsRoutes);
app.use('/api/equipment', equipmentRoutes);
app.use('/api/reports', reportsRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!', 
    message: err.message 
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;
