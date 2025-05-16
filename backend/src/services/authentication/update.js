const User = require('../../models/userModel');
const bcrypt = require('bcryptjs');
const {
  badRequestJsonResponse,
  internalErrorJsonResponse,
  successJsonResponse
} = require('../../utils/jsonResponses/jsonResponses');

const updateUser = async (req, res) => {
  const userId = req.userId;
  const { username, password } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json(badRequestJsonResponse('User not found'));

    if (username) user.username = username;
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }

    await user.save();

    return res.status(200).json(successJsonResponse('User updated successfully'));
  } catch (error) {
    return res.status(500).json(internalErrorJsonResponse('Server error'));
  }
};

module.exports = updateUser;
