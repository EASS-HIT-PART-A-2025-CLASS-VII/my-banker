const bcrypt = require('bcryptjs');
const User = require('../../models/userModel');

/**
 * @function register
 * @description Creates new user account with hashed password
 */
const register = async (username, password) => {
    try {
        // Check for existing user
        const existingUser = await User.findOne({ username });
        if (existingUser) throw new Error('User already exists');

        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new User({ 
            username, 
            password: hashedPassword 
        });

        // Save user to database
        await newUser.save();

        return {
            username: username, 
            password: password
        };
    } catch (error) {
        throw new Error(error.message);
    }
};

module.exports = register;