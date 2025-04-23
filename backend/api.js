const express = require('express');
const path = require('path');
const connectDB = require('./database/db'); // Import the MongoDB connection function

const app = express();
const port = 8000;

// Connect to MongoDB
connectDB();

// Set Pug as the view engine
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

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
