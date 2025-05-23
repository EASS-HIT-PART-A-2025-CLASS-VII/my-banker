// Import required modules
const register = require('../../../services/authentication/register');
const User = require('../../../models/userModel');
const bcrypt = require('bcryptjs');

// Mock the User model and bcrypt
jest.mock('../../../models/userModel');
jest.mock('bcryptjs');

describe('Register Service', () => {
    // Setup test data before each test
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // Test successful user registration
    it('should register a new user successfully', async () => {
        // Mock user data
        const mockUser = {
            username: 'testuser',
            password: 'hashedPassword123',
            save: jest.fn()
        };

        // Mock bcrypt hash function
        const hashedPassword = 'hashedPassword123';
        bcrypt.hash.mockResolvedValue(hashedPassword);

        // Mock User.findOne to return null (user doesn't exist)
        User.findOne.mockResolvedValue(null);

        // Mock User constructor
        User.mockImplementation(() => mockUser);

        // Execute registration
        const result = await register('testuser', 'password123');

        // Verify the results
        expect(User.findOne).toHaveBeenCalledWith({ username: 'testuser' });
        expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
        expect(mockUser.save).toHaveBeenCalled();
        expect(result).toEqual({
            username: 'testuser',
            password: 'password123'
        });
    });

    // Test user already exists scenario
    it('should throw error when user already exists', async () => {
        // Mock existing user
        const existingUser = {
            username: 'testuser',
            password: 'hashedPassword123'
        };

        // Mock User.findOne to return existing user
        User.findOne.mockResolvedValue(existingUser);

        // Execute and verify error
        await expect(register('testuser', 'password123'))
            .rejects
            .toThrow('User already exists');
    });

    // Test database error handling
    it('should handle database errors properly', async () => {
        // Mock database error
        const dbError = new Error('Database connection failed');
        User.findOne.mockRejectedValue(dbError);

        // Execute and verify error
        await expect(register('testuser', 'password123'))
            .rejects
            .toThrow('Database connection failed');
    });

    // Test bcrypt error handling
    it('should handle bcrypt hash errors', async () => {
        // Mock User.findOne to return null
        User.findOne.mockResolvedValue(null);

        // Mock bcrypt hash error
        const hashError = new Error('Hashing failed');
        bcrypt.hash.mockRejectedValue(hashError);

        // Execute and verify error
        await expect(register('testuser', 'password123'))
            .rejects
            .toThrow('Hashing failed');
    });

    // Test save error handling
    it('should handle save errors', async () => {
        // Mock user data with save error
        const mockUser = {
            username: 'testuser',
            password: 'hashedPassword123',
            save: jest.fn().mockRejectedValue(new Error('Save failed'))
        };

        // Mock User.findOne to return null
        User.findOne.mockResolvedValue(null);

        // Mock bcrypt hash function
        bcrypt.hash.mockResolvedValue('hashedPassword123');

        // Mock User constructor
        User.mockImplementation(() => mockUser);

        // Execute and verify error
        await expect(register('testuser', 'password123'))
            .rejects
            .toThrow('Save failed');
    });
});