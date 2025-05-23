process.env.JWT_SECRET = 'test-secret';

const login = require('../../../services/authentication/login');
const User = require('../../../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Mock dependencies
jest.mock('../../../models/userModel');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

describe('Login Service', () => {
    // Setup environment variables
    process.env.JWT_SECRET = 'test-secret';

    // Setup test data before each test
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // Test successful login
    it('should login successfully and return JWT token', async () => {
        // Mock user data
        const mockUser = {
            username: 'user1',
            password: 'user1'
        };

        // Mock successful password comparison
        bcrypt.compare.mockResolvedValue(true);

        // Mock JWT token generation
        const mockToken = 'mock-jwt-token';
        jwt.sign.mockReturnValue(mockToken);

        // Mock User.findOne to return user
        User.findOne.mockResolvedValue(mockUser);

        // Execute login
        const result = await login('user1', 'user1');

        // Verify the results
        expect(User.findOne).toHaveBeenCalledWith({ username: 'user1' });
        expect(bcrypt.compare).toHaveBeenCalledWith('user1', 'user1');
        expect(jwt.sign).toHaveBeenCalledWith(
            { username: 'user1' },
            'test-secret',
            { expiresIn: '1h' }
        );
        expect(result).toBe(mockToken);
    });

    // Test user not found scenario
    it('should throw error when user is not found', async () => {
        // Mock User.findOne to return null
        User.findOne.mockResolvedValue(null);

        // Execute and verify error
        await expect(login('nonexistentuser', 'password123'))
            .rejects
            .toThrow('User not found');
    });

    // Test invalid password scenario
    it('should throw error when password is invalid', async () => {
        // Mock user data
        const mockUser = {
            username: 'user1',
            password: 'user1'
        };

        // Mock User.findOne to return user
        User.findOne.mockResolvedValue(mockUser);

        // Mock failed password comparison
        bcrypt.compare.mockResolvedValue(false);

        // Execute and verify error
        await expect(login('user1', 'wrongpassword'))
            .rejects
            .toThrow('Invalid user credentials');
    });

    // Test database error handling
    it('should handle database errors properly', async () => {
        // Mock database error
        const dbError = new Error('Database connection failed');
        User.findOne.mockRejectedValue(dbError);

        // Execute and verify error
        await expect(login('user1', 'user1'))
            .rejects
            .toThrow('Database connection failed');
    });

    // Test JWT error handling
    it('should handle JWT generation errors', async () => {
        // Mock user data
        const mockUser = {
            username: 'user1',
            password: 'user1'
        };

        // Mock successful password comparison
        bcrypt.compare.mockResolvedValue(true);

        // Mock User.findOne to return user
        User.findOne.mockResolvedValue(mockUser);

        // Mock JWT error
        const jwtError = new Error('JWT generation failed');
        jwt.sign.mockImplementation(() => { throw jwtError; });

        // Execute and verify error
        await expect(login('user1', 'user1'))
            .rejects
            .toThrow('JWT generation failed');
    });
});