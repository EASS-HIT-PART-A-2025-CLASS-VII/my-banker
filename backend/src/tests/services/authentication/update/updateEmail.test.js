const User = require('../../../../models/userModel');
const updateEmail = require('../../../../services/authentication/update/updateEmail');

// Mock User model
jest.mock('../../../../models/userModel');

describe('Update Email Service', () => {
    // Mock user data
    const mockUser = {
        username: 'testuser',
        email: 'old@example.com',
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
        adviceOpenness: 5
    };

    beforeEach(() => {
        jest.clearAllMocks();
        User.findOne.mockReset();
        mockUser.save.mockReset();
    });

    it('should update email successfully', async () => {
        // Setup mocks
        User.findOne.mockImplementation((query) => {
            if (query.username === 'testuser') return mockUser;
            if (query.email === 'new@example.com') return null;
            return null;
        });
        mockUser.save.mockResolvedValue(mockUser);

        // Execute test
        const result = await updateEmail('testuser', 'new@example.com');

        // Verify results
        expect(User.findOne).toHaveBeenCalledWith({ username: 'testuser' });
        expect(mockUser.save).toHaveBeenCalled();
        expect(result).toEqual(expect.objectContaining({
            username: 'testuser',
            email: 'new@example.com'
        }));
    });

    it('should handle non-existent user', async () => {
        // Setup mocks
        User.findOne.mockResolvedValue(null);

        // Execute and verify error
        await expect(updateEmail('nonexistent', 'new@example.com'))
            .rejects
            .toThrow('User not found');
    });

    it('should handle duplicate email', async () => {
        // Setup mocks
        User.findOne.mockImplementation((query) => {
            if (query.username === 'testuser') return mockUser;
            if (query.email === 'existing@example.com') return {};
            return null;
        });

        // Execute and verify error
        await expect(updateEmail('testuser', 'existing@example.com'))
            .rejects
            .toThrow('Email already exists');
    });

    it('should handle missing new email', async () => {
        // Setup mocks
        User.findOne.mockResolvedValue(mockUser);

        // Execute and verify error
        await expect(updateEmail('testuser', null))
            .rejects
            .toThrow('New email is required');
    });
});