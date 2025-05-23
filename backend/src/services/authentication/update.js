const User = require('../../models/userModel');
const bcrypt = require('bcryptjs');

/**
 * @function updateUser
 * @description Updates user credentials in database
 */
const updateUser = async (username, password, newUsername, newPassword) => {
    try {
        // Find existing user
        const user = await User.findOne({ username });
        if (!user) throw new Error('User not found');

        // Update username if provided
        if (username) user.username = newUsername;

        // Update password if provided
        if (password) {
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            user.password = hashedPassword;
        }

        // Save changes to database
        await user.save();

        return {
            username: newUsername, 
            password: newPassword
        };
    } catch (error) {
        throw new Error(error.message);
    }
};

module.exports = updateUser;