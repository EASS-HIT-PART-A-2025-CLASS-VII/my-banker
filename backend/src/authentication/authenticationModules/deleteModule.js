const User = require('../authenticationModel');
const { badRequestJsonResponse, notFoundJsonResponse, unauthorizedJsonResponse, internalErrorJsonResponse, successJsonResponse } = require('../../utils/jsonResponses/jsonResponses'); 

/**
 * Handles user deletion.
 * @async
 * @function deleteUser
 * @param {express.Request} req - Express request object containing `username` in the body.
 * @param {express.Response} res - Express response object.
 * @returns {Promise<void>} Sends a JSON response with a success or error message.
 */
const deleteUser = async (req, res) => {
  const { username } = req.body; // Extract username from the request body.

  try {
    // Check if the username is provided.
    if (!username) {
      // Return an error if the username is missing.
      return res.status(400).json(badRequestJsonResponse('Username is required'));
    }

    // Find and delete the user in the database with the provided username.
    const user = await User.findOneAndDelete({ username });

    // Check if the user exists.
    if (!user) {
      // Return an error if the user is not found.
      return res.status(404).json(notFoundJsonResponse('User not found'));
    }

    // If the user is successfully deleted, send a success response.
    res.status(200).json(successJsonResponse('User deleted successfully'));
  } catch (error) {
    // Handle any server errors that occur during the deletion process.
    res.status(500).json(internalErrorJsonResponse('Server error'));
  }
};

module.exports = deleteUser;