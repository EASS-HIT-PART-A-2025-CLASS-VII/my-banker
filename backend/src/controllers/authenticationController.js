const authenticationService = require('../services/authentication/authentication');
const {
  badRequestJsonResponse,
  notFoundJsonResponse,
  unauthorizedJsonResponse,
  internalErrorJsonResponse,
  successJsonResponse,
} = require('../utils/jsonResponses/jsonResponses');

/**
 * @function loginController
 * @description Handles user authentication and generates JWT token
 */
const loginController = async (req, res) => {
  try {
    // Generate authentication token
    const token = await authenticationService.login(req.body.username, req.body.password);

    // Return success response with token
    return res.json(successJsonResponse(token));
  } catch (error) {
    // Handle authentication failure
    if (error.message === 'Invalid credentials') return res.json(unauthorizedJsonResponse(error.message));

    // Handle server errors
    else return res.json(internalErrorJsonResponse(error.message));
  }
};

/**
 * @function registerController
 * @description Creates new user account
 */
const registerController = async (req, res) => {
  try {
    const userData = {
      username: req.body.username,
      password: req.body.password,
      email: req.body.email,
      riskAversion: req.body.riskAversion,
      volatilityTolerance: req.body.volatilityTolerance,
      growthFocus: req.body.growthFocus,
      cryptoExperience: req.body.cryptoExperience,
      innovationTrust: req.body.innovationTrust,
      impactInterest: req.body.impactInterest,
      diversification: req.body.diversification,
      holdingPatience: req.body.holdingPatience,
      monitoringFrequency: req.body.monitoringFrequency,
      adviceOpenness: req.body.adviceOpenness
    };
    // Create new user
    const user = await authenticationService.register(userData);

    // Return success response
    return res.json(successJsonResponse(user));
  } catch (error) {
    // Handle duplicate user
    if (error.message === 'User already exists') return res.json(badRequestJsonResponse(error.message));

    // Handle server errors
    else return res.json(internalErrorJsonResponse(error.message));
  }
};

/**
 * @function deleteUserController
 * @description Removes user account from system
 */
const deleteUserController = async (req, res) => {
  try {
    // Delete user account
    const user = await authenticationService.deleteUser(req.body);

    // Return success response
    return res.json(successJsonResponse(user));
  } catch (error) {
    // Handle non-existent user
    if (error.message === 'User not found') return res.json(notFoundJsonResponse(error.message));

    // Handle server errors
    else return res.json(internalErrorJsonResponse(error.message));
  }
};

/**
 * @function updateUserController
 * @description Updates existing user information
 */
const updateUserController = async (req, res) => {
  try {
    // Update user account
    const user = await authenticationService.updateUser(req.body);

    // Return success response
    return res.json(successJsonResponse(user));
  } catch (error) {
    // Handle non-existent user
    if (error.message === 'User not found') return res.json(notFoundJsonResponse(error.message));

    // Handle server errors
    else return res.json(internalErrorJsonResponse(error.message));
  }
};

module.exports = {
  loginController,
  registerController,
  updateUserController,
  deleteUserController
};