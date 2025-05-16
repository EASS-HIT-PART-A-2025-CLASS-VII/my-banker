const authenticationService = require('../services/authentication/authentication');

const loginController = async (req, res) => {
  try {
    const user = await authenticationService.login(req.body.username, req.body.password);
    res.json(user);
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

const registerController = async (req, res) => {
  try {
    const user = await authenticationService.register(req.body.username, req.body.password);
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}
const deleteUserController = async (req, res) => {
  try {
    const user = await authenticationService.deleteUser(req.body);
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}
const updateUserController = async (req, res) => {
  try {
    const user = await authenticationService.updateUser(req.body);
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

module.exports = {
    loginController,
    registerController,
    updateUserController,
    deleteUserController
};
