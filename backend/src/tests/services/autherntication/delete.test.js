// Import required modules
const deleteUser = require('../delete');
const User = require('../../../models/userModel');

// Mock the User model
jest.mock('../../../models/userModel');

describe('Delete User Service', () => {
    // Setup test data before each test
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // Test successful user deletion
    it('should delete user successfully', async () => {
        // Mock user data
        const mockUser = {
            username: 'testuser',
            password: 'hashedPassword123'
        };

        // Mock User.findOne to return user
        User.findOne.mockResolvedValue(mockUser);

        // Execute deletion
        const result = await deleteUser('testuser');

        // Verify the results
        expect(User.findOne).toHaveBeenCalledWith({ username: 'testuser' });
        expect(result).toBe('testuser');
    });

    // Test user not found scenario
    it('should throw error when user is not found', async () => {
        // Mock User.findOne to return null
        User.findOne.mockResolvedValue(null);

        // Execute and verify error
        await expect(deleteUser('nonexistentuser'))
            .rejects
            .toThrow('User not found');
    });

    // Test database error handling
    it('should handle database errors properly', async () => {
        // Mock database error
        const dbError = new Error('Database connection failed');
        User.findOne.mockRejectedValue(dbError);

        // Execute and verify error
        await expect(deleteUser('testuser'))
            .rejects
            .toThrow('Database connection failed');
    });
});