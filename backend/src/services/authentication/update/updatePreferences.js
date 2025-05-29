const User = require('../../../models/userModel');

/**
 * @function updatePreferences
 * @description Updates user investment preferences
 * @param {string} username - Current username
 * @param {Object} preferences - New preference values
 * @returns {Object} Updated user data without password
 */
const updatePreferences = async (username, preferences) => {
    try {
        // Find existing user
        const user = await User.findOne({ username });
        if (!user) throw new Error('User not found');

        // List of valid preference fields
        const validPreferences = [
            'riskAversion',
            'volatilityTolerance',
            'growthFocus',
            'cryptoExperience',
            'innovationTrust',
            'impactInterest',
            'diversification',
            'holdingPatience',
            'monitoringFrequency',
            'adviceOpenness'
        ];

        // Update provided preferences
        for (const field of validPreferences) {
            if (preferences[field] !== undefined) {
                const value = parseInt(preferences[field]);
                if (isNaN(value) || value < 1 || value > 10) {
                    throw new Error(`${field} must be a number between 1 and 10`);
                }
                user[field] = value;
            }
        }

        // Save changes
        await user.save();

        // Return updated user data without password
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

module.exports = updatePreferences;