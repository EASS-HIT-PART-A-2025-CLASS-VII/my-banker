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
const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json(badRequestJsonResponse('Invalid credentials'));
    }

    // Compare hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json(badRequestJsonResponse('Invalid credentials'));
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, username: user.username },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    return res.status(200).json(successJsonResponse('Login successful', { token }));
  } catch (error) {
    return res.status(500).json(internalErrorJsonResponse('Server error'));
  }
};

module.exports = login;
