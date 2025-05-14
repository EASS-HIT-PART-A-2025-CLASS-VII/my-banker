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

    // Connect to MongoDB
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Failed to connect to MongoDB', error);
  }
};

module.exports = connectDB;