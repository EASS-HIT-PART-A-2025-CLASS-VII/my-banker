const mongoose = require('mongoose');

/**
 * Connect to MongoDB.
 * @function connectDB
 * @returns {Promise<void>} Resolves when the connection is successful.
 */
const connectDB = async () => {
  try {
    // Retrieve the MongoDB URI from environment variables or use a default value
    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/mybanker';

    // Attempt to connect to MongoDB
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Log a success message if the connection is successful
    console.log('Connected to MongoDB');
  } catch (error) {
    // Log the error for debugging purposes
    console.error('Failed to connect to MongoDB', error);

    // Exit the process if the connection fails
    process.exit(1);
  }
};

module.exports = connectDB;