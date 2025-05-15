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
const register = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if a user with the same username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json(badRequestJsonResponse('User already exists'));
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save the new user
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();

    return res.status(200).json(successJsonResponse('User registered successfully'));
  } catch (error) {
    return res.status(500).json(internalErrorJsonResponse('Server error'));
  }
};

module.exports = register;
