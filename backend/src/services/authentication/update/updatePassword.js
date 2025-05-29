const User = require('../../../models/userModel');
const bcrypt = require('bcryptjs');

/**
 * @function updatePassword
 * @description Updates user password with encryption
 * @param {string} username - Current username
 * @param {string} newPassword - New password
 * @returns {Object} Updated user data without password
 */
const updatePassword = async (username, newPassword) => {
    try {
        // Validate new password
        if (!newPassword) throw new Error('New password is required');
        
        // Find existing user
        const user = await User.findOne({ username });
        if (!user) throw new Error('User not found');
        
        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        
        // Update password
        user.password = hashedPassword;

        // Save changes
        await user.save();

        // Return user data without password
        return {
            username: user.username,
            email: user.email,
            riskAversion: user.riskAversion,
            volatilityTolerance: user.volatilityTolerance,
            growthFocus: user.growthFocus,
            cryptoExperience: user.cryptoExperience,
            innovationTrust: user.innovationTrust,
            impactInterest: user.impactInterest,
            diversification: user.diversification,
            holdingPatience: user.holdingPatience,
            monitoringFrequency: user.monitoringFrequency,
            adviceOpenness: user.adviceOpenness
        };
    } catch (error) {
        throw new Error(error.message);
    }
};

module.exports = updatePassword;