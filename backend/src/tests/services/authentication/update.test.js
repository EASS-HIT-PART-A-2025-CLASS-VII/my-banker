// Import required modules
const updateUser = require('../../../services/authentication/update');
const User = require('../../../models/userModel');
const bcrypt = require('bcryptjs');

// Mock the User model and bcrypt
jest.mock('../../../models/userModel');
jest.mock('bcryptjs');

describe('Update User Service', () => {
    // Setup test data before each test
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // Test successful update with both username and password
    it('should update both username and password successfully', async () => {
        // Mock user data
        const mockUser = {
            username: 'oldUsername',
            password: 'oldPassword',
            save: jest.fn()
        };

        // Mock bcrypt hash function
        const hashedPassword = 'hashedNewPassword123';
        bcrypt.hash.mockResolvedValue(hashedPassword);

        // Mock User.findOne to return a user
        User.findOne.mockResolvedValue(mockUser);

        // Execute update function
        const result = await updateUser(
            'oldUsername',
            'oldPassword',
            'newUsername',
            'newPassword'
        );

        // Verify results
        expect(User.findOne).toHaveBeenCalledWith({ username: 'oldUsername' });
        expect(bcrypt.hash).toHaveBeenCalledWith('newPassword', 10);
        expect(mockUser.save).toHaveBeenCalled();
        expect(result).toEqual({
            username: 'newUsername',
            password: 'newPassword'
        });
    });

    // Test update with only username change
    it('should update only username when no new password is provided', async () => {
        // Mock user data
        const mockUser = {
            username: 'oldUsername',
            password: 'oldPassword',
            save: jest.fn()
        };

        // Mock User.findOne to return a user
        User.findOne.mockResolvedValue(mockUser);

        // Execute update function
        const result = await updateUser(
            'oldUsername',
            null,
            'newUsername',
            null
        );

        // Verify results
        expect(User.findOne).toHaveBeenCalledWith({ username: 'oldUsername' });
        expect(bcrypt.hash).not.toHaveBeenCalled();
        expect(mockUser.save).toHaveBeenCalled();
        expect(result).toEqual({
            username: 'newUsername',
            password: null
        });
    });

    // Test user not found scenario
    it('should throw an error when user is not found', async () => {
        // Mock User.findOne to return null
        User.findOne.mockResolvedValue(null);

        // Execute and verify error
        await expect(updateUser(
            'nonexistentUser',
            'password',
            'newUsername',
            'newPassword'
        )).rejects.toThrow('User not found');
    });

    // Test database error handling
    it('should handle database errors properly', async () => {
        // Mock database error
        const dbError = new Error('Database connection failed');
        User.findOne.mockRejectedValue(dbError);

        // Execute and verify error
        await expect(updateUser(
            'username',
            'password',
            'newUsername',
            'newPassword'
        )).rejects.toThrow('Database connection failed');
    });

    // Test bcrypt error handling
    it('should handle bcrypt hash errors', async () => {
        // Mock user data
        const mockUser = {
            username: 'oldUsername',
            password: 'oldPassword',
            save: jest.fn()
        };

        // Mock User.findOne to return a user
        User.findOne.mockResolvedValue(mockUser);

        // Mock bcrypt hash error
        const hashError = new Error('Hashing failed');
        bcrypt.hash.mockRejectedValue(hashError);

        // Execute and verify error
        await expect(updateUser(
            'username',
            'password',
            'newUsername',
            'newPassword'
        )).rejects.toThrow('Hashing failed');
    });
});