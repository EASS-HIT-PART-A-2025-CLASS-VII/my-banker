const User = require('../../../../models/userModel');
const updatePreferences = require('../../../../services/authentication/update/updatePreferences');

// Mock User model
jest.mock('../../../../models/userModel');

describe('Update Preferences Service', () => {
    // Mock user data
    const mockUser = {
        username: 'originalUser',
        password: 'oldHashedPassword',
        email: 'original@example.com',
        save: jest.fn(),
        riskAversion: 5,
        volatilityTolerance: 5,
        growthFocus: 5,
        cryptoExperience: 5,
        innovationTrust: 5,
        impactInterest: 5,
        diversification: 5,
        holdingPatience: 5,
        monitoringFrequency: 5,
        adviceOpenness: 5,
    };

    beforeEach(() => {
        jest.clearAllMocks();
        User.findOne.mockReset();
        mockUser.save.mockReset();
    });

    it('should update preferences successfully', async () => {
        User.findOne.mockResolvedValue(mockUser);

        const result = await updatePreferences('originalUser', {
            riskAversion: 8,
            cryptoExperience: 10
        });

        expect(mockUser.riskAversion).toBe(8);
        expect(mockUser.cryptoExperience).toBe(10);
        expect(mockUser.save).toHaveBeenCalled();
        expect(result.riskAversion).toBe(8);
    });

    it('should handle non-existent user', async () => {
        // Setup mock
        User.findOne.mockResolvedValue(null);

        // Execute and verify error
        await expect(updatePreferences('nonexistent', { riskAversion: 7 }))
            .rejects
            .toThrow('User not found');
    });

    it('should handle invalid preference values', async () => {
        // Setup mock
        User.findOne.mockResolvedValue(mockUser);

        // Execute and verify error
        await expect(updatePreferences('testuser', { riskAversion: 11 }))
            .rejects
            .toThrow('riskAversion must be a number between 1 and 10');
    });

    it('should handle partial preference updates', async () => {
        // Setup mocks
        User.findOne.mockResolvedValue(mockUser);
        mockUser.save.mockResolvedValue(mockUser);

        // Execute test with single preference
        const result = await updatePreferences('testuser', { riskAversion: 8 });

        // Verify only specified preference was updated
        expect(result.riskAversion).toBe(8);
        expect(result.volatilityTolerance).toBe(5);
    });
});