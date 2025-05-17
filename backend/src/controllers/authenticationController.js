const authenticationService = require('../services/authentication/authentication');
const {
  badRequestJsonResponse,
  notFoundJsonResponse,
  unauthorizedJsonResponse,
  internalErrorJsonResponse,
  successJsonResponse,
} = require('../../utils/jsonResponses/jsonResponses');

const loginController = async (req, res) => {
  try {
    const token = await authenticationService.login(req.body.username, req.body.password);
    return res.json(successJsonResponse(token));
  } catch (error) {
    if(error.message === 'Invalid credentials') return res.json(unauthorizedJsonResponse(error.message));
    else return res.json(internalErrorJsonResponse(error.message));
  }
};

const registerController = async (req, res) => {
  try {
    const user = await authenticationService.register(req.body.username, req.body.password);
    return res.json(successJsonResponse('username: ' + user.username + ', ' + 'password: ' + user.password));
  } catch (error) {
    if(error.message === 'User already exists') return res.json(badRequestJsonResponse(error.message));
    else return res.json(internalErrorJsonResponse(error.message));
  }
}
const deleteUserController = async (req, res) => {
  try {
    const user = await authenticationService.deleteUser(req.body);
    return res.json(successJsonResponse(user));
  } catch (error) {
    if(error.message === 'User not found') return res.json(notFoundJsonResponse(error.message));
    else return res.json(internalErrorJsonResponse(error.message));
  }
}
const updateUserController = async (req, res) => {
  try {
    const user = await authenticationService.updateUser(req.body);
    return res.json(successJsonResponse(user));
  } catch (error) {
    if(error.message === 'User not found') return res.json(notFoundJsonResponse(error.message));
    else return res.json(internalErrorJsonResponse(error.message));
  }
}

module.exports = {
    loginController,
    registerController,
    updateUserController,
    deleteUserController
};
