const express = require('express');
const path = require('path');
const connectDB = require('./database/db');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = 8000;

// Connect to MongoDB
connectDB();

// Enable CORS
app.use(cors());

// Middleware to parse JSON
app.use(express.json());

/**
 * ROUTES
 * Grouped by logical service
 */
const authRoutes = require('./authentication/authenticationRoutes');
const report = require('./routes/reportRoute');

// Mount routes at / + name
app.use('/auth', authRoutes);
app.use('/report', report);

/**
 * Default health check route
 * @route GET /
 * @returns {string} - A simple message indicating the server is running.
 */
app.get('/', (req, res) => {
  res.status(200).send('Server is running!');
});

// Start server
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
