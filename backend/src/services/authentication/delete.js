const User = require('../../models/userModel');

/**
 * @function deleteUser
 * @description Removes a user from the database
 */
const deleteUser = async (username) => {
    try {
        // Find user by username
        const user = await User.findOne({ username });

        // Check if user exists
        if (!user) throw new Error('User not found');

        return username;
    } catch (error) {
        throw new Error(error.message);
    }
};

module.exports = deleteUser;