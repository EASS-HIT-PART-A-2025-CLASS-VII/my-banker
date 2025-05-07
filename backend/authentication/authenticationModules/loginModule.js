const User = require('../authenticationModel'); 
const { badRequestJsonResponse, notFoundJsonResponse, unauthorizedJsonResponse, internalErrorJsonResponse, successJsonResponse } = require('../../utils/jsonResponses/jsonResponses'); 

/**
 * Handles user login.
 * @async
 * @function login
 * @param {express.Request} req - Express request object containing `username` and `password` in the body.
 * @param {express.Response} res - Express response object.
 * @returns {Promise<void>} Sends a JSON response with a success or error message.
 */
const login = async (req, res) => {
  const { username, password } = req.body; // Extract username and password from the request body.

  try {
    // Find a user in the database with the provided username.
    const user = await User.findOne({ username });

    // Check if the user exists and if the provided password matches the stored password.
    if (!user || user.password !== password) {
      // Return an error if credentials are invalid.
      return res.status(400).json(badRequestJsonResponse('Invalid credentials')); 
    }

    // If credentials are valid, send a success response.
    res.status(200).json(successJsonResponse('Login successfuly')); 
  } catch (error) {
    // Handle any server errors that occur during the login process.
    res.status(500).json(internalErrorJsonResponse('Server error')); 
  }
};

module.exports = login;