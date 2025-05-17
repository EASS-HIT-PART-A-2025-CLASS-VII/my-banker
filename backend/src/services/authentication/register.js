const bcrypt = require('bcryptjs'); // updated to bcryptjs
const User = require('../../models/userModel');
const {
  badRequestJsonResponse,
  internalErrorJsonResponse,
  successJsonResponse
} = require('../../utils/jsonResponses/jsonResponses');

/**
 * Handles user registration.
 * @async
 * @function register
 * @param {express.Request} req - Express request object containing `username` and `password` in the body.
 * @param {express.Response} res - Express response object.
 * @returns {Promise<void>} Sends a JSON response with a success or error message.
 */
const register = async (username, password) => {

  try {
    // Check if a user with the same username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) throw new Error('User already exists');

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save the new user
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();

    return {username: username, password: password};
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = register;
