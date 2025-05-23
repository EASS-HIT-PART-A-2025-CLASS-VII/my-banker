const mongoose = require('mongoose');

/**
 * @function connectDB
 * @description Connect to MongoDB
 */
const connectDB = async () => {
  try {
    // Retrieve the MongoDB URI from environment variables or use a default value
    const mongoURI = process.env.MONGO_URI;

    // Connect to MongoDB
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  } catch (error) {
    // Throw an error if the connection fails
    throw new Error('Failed to connect to MongoDB: ' + error.message);
  }
};

module.exports = connectDB;