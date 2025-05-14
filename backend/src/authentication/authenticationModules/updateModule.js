const User = require('../authenticationModel');
const { badRequestJsonResponse, notFoundJsonResponse, unauthorizedJsonResponse, internalErrorJsonResponse, successJsonResponse } = require('../../utils/jsonResponses/jsonResponses'); 


/**
 * Handles updating user credentials.
 * @async
 * @function updateUser
 * @param {express.Request} req - Express request object containing `username`, `newUsername`, and/or `newPassword` in the body.
 * @param {express.Response} res - Express response object.
 * @returns {Promise<void>} Sends a JSON response with a success or error message.
 */
const update = async (req, res) => {
  // Extract data from the request body.
  const { username, password, newUsername, newPassword } = req.body; 

  try {
    // Check if the username and password is provided and return an error if one of them is missing.
    if (!username || !password) return res.status(400).json(badRequestJsonResponse('Username is required'));

    // Find the user in the database with the provided username.
    const user = await User.findOne({ username });

    // Check if the provided password matches the stored password and return an error if credentials are invalid
    if(user && user.password !== password)  return res.status(400).json(badRequestJsonResponse('Invalid credentials'));

    // Update the user's credentials if new values are provided.
    if (newUsername) {
      user.username = newUsername;
    }
    if (newPassword) {
      user.password = newPassword;
    }

    // Save the updated user to the database.
    await user.save();

    res.status(200).json(successJsonResponse('User credentials updated successfully'));
  } catch (error) {
    res.status(500).json(internalErrorJsonResponse('Server error'));
  }
};

module.exports = update;