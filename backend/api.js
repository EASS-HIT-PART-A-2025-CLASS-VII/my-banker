const express = require('express');
const path = require('path');
const connectDB = require('./database/db');
const cors = require('cors');

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
const walletInformationRoutes = require('./walletInformation/walletInformationRoutes');
const reportRoutes = require('./manualReports/manualReportsRoutes');
const llmRoutes = require('./llmReport/llmReportRoutes');

// Mount routes at / + name
app.use('/auth', authRoutes);
app.use('/wallet-information', walletInformationRoutes);
app.use('/manual-report', reportRoutes);
app.use('/llm-report', llmRoutes);

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
