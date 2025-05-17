const User = require('../../models/userModel');
const bcrypt = require('bcryptjs');

const updateUser = async (username, password, newUsername, newPassword) => {

  try {
    const user = await User.findOne({ username });
    if (!user) throw new Error('User not found');

    if (username) user.username = newUsername;
    if (password) {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
    }

    await user.save();

    return {username: newUsername, password: newPassword};
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = updateUser;
