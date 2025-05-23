const bcrypt = require('bcryptjs'); 
const jwt = require('jsonwebtoken');
const User = require('../../models/userModel');

const JWT_SECRET = process.env.JWT_SECRET;

/**
 * @function login
 * @description Authenticates user and generates JWT token
 */
const login = async (username, password) => {
    try {
        // Find user by username
        const user = await User.findOne({ username });
        if (!user) throw new Error('User not found');

        // Get and verify password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) throw new Error('Invalid user credentials');

        // Generate JWT token
        const token = jwt.sign(
            { username: user.username },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        return token;
    } catch (error) {
        throw new Error(error.message);
    }
};

module.exports = login;