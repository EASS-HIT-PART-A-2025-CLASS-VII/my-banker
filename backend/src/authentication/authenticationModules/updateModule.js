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
  const { username, newUsername, newPassword } = req.body; // Extract data from the request body.

  try {
    // Check if the username is provided.
    if (!username) {
      // Return an error if the username is missing.
      return res.status(400).json(badRequestJsonResponse('Username is required'));
    }

    // Find the user in the database with the provided username.
    const user = await User.findOne({ username });

    // Check if the user exists.
    if (!user) {
      // Return an error if the user is not found.
      return res.status(404).json(notFoundJsonResponse('User not found'));
    }

    // Update the user's credentials if new values are provided.
    if (newUsername) {
      user.username = newUsername;
    }
    if (newPassword) {
      user.password = newPassword;
    }

    // Save the updated user to the database.
    await user.save();

    // Send a success response.
    res.status(200).json(successJsonResponse('User credentials updated successfully'));
  } catch (error) {
    // Handle any server errors that occur during the update process.
    res.status(500).json(internalErrorJsonResponse('Server error'));
  }
};

module.exports = update;