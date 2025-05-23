const express = require('express');
const connectDB = require('./database/db');
const cors = require('cors');

// Initialize express app
const app = express();
const port = 8000;

// Connect to MongoDB
connectDB();

// Enable middleware
app.use(cors());
app.use(express.json());

// Import route handlers
const authRoutes = require('./routes/authenticationRoute');
const report = require('./routes/reportRoute');

// Mount route handlers
app.use('/auth', authRoutes);
app.use('/report', report);

// health check route
app.get('/', (req, res) => {
  res.status(200).send('Server is running!');
});

// Start server
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});