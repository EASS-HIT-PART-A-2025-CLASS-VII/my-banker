const express = require('express');
const path = require('path');
const connectDB = require('./database/db'); // Import the MongoDB connection function
const cors = require('cors');

const app = express();
const port = 8000;

// Connect to MongoDB
connectDB();

// Enable Cross-Origin Resource Sharing (CORS) to allow requests from different origins
app.use(cors());

// Middleware to parse JSON requests
app.use(express.json());

// Authentication routes
const authRoutes = require('./authentication/authenticationRoutes');
app.use('/auth', authRoutes);

// Route for the root path
app.get('/', (req, res) => {
  res.status(200).send('Server is running!');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
