const bcrypt = require('bcryptjs'); 
const jwt = require('jsonwebtoken');
const User = require('../../models/userModel');
const {
  badRequestJsonResponse,
  internalErrorJsonResponse,
  successJsonResponse
} = require('../../utils/jsonResponses/jsonResponses');

// Load secret from environment variables
const JWT_SECRET = process.env.JWT_SECRET;

/**
 * Handles user login.
 * @async
 * @function login
 * @param {express.Request} req - Express request object containing `username` and `password` in the body.
 * @param {express.Response} res - Express response object.
 * @returns {Promise<void>} Sends a JSON response with a JWT token if successful or error message.
 */
const login = async (username, password) => {

  try {
    // Find user by username
    const user = await User.findOne({ username });
    if (!user) {
      throw new Error('User not foune');
    }

    // Compare hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error('Invalid credentials');
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, username: user.username },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    return token;
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = login;
