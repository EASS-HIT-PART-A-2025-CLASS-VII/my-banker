const mongoose = require('mongoose');

/**
 * Connect to MongoDB.
 * @function connectDB
 * @returns {Promise<void>} Resolves when the connection is successful.
 */
const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/mybanker', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Failed to connect to MongoDB', error);
    // Exit the process if the connection fails
    process.exit(1); 
  }
};

module.exports = connectDB;