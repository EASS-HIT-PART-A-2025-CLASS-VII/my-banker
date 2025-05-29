const {
    registerController,
    loginController,
    updateEmailController,
    updatePasswordController,
    updatePreferencesController,
    deleteUserController
} = require('../../controllers/authenticationController');

// Mock the authentication service
jest.mock('../../services/authentication/authentication', () => ({
    register: jest.fn(),
    login: jest.fn(),
    updateEmail: jest.fn(),
    updatePassword: jest.fn(),
    updatePreferences: jest.fn(),
    deleteUser: jest.fn()
}));

const authenticationService = require('../../services/authentication/authentication');

describe('Authentication Controller Tests', () => {
    // Test user data
    const mockUser = {
        username: 'testuser',
        password: 'Test@1234',
        email: 'test@example.com',
        riskAversion: 3,
        volatilityTolerance: 4,
        growthFocus: 5,
        cryptoExperience: 2,
        innovationTrust: 4,
        impactInterest: 3,
        diversification: 5,
        holdingPatience: 4,
        monitoringFrequency: 2,
        adviceOpenness: 5
    };

    // Mock response object
    const mockRes = () => {
        const res = {};
        res.json = jest.fn().mockReturnValue(res);
        return res;
    };

    beforeEach(() => {
        // Clear all mocks before each test
        jest.clearAllMocks();
    });

    // Register Controller Tests
    describe('Register Controller', () => {
        test('should register new user successfully', async () => {
            authenticationService.register.mockResolvedValue(mockUser);
            
            const res = mockRes();
            await registerController({ body: mockUser }, res);
            
            expect(authenticationService.register).toHaveBeenCalledWith(mockUser);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    status: 200,
                    data: expect.objectContaining({ type: 'Success' })
                })
            );
        });

        test('should handle registration error', async () => {
            authenticationService.register.mockRejectedValue(new Error('User already exists'));
            
            const res = mockRes();
            await registerController({ body: mockUser }, res);
            
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    status: 400,
                    error: expect.objectContaining({ type: 'BadRequest' })
                })
            );
        });
    });

    // Login Controller Tests
    describe('Login Controller', () => {
        test('should login successfully', async () => {
            const mockToken = 'mock-jwt-token';
            authenticationService.login.mockResolvedValue(mockToken);
            
            const res = mockRes();
            await loginController({ 
                body: { 
                    username: mockUser.username, 
                    password: mockUser.password 
                } 
            }, res);
            
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    status: 200,
                    data: expect.objectContaining({ type: 'Success' })
                })
            );
        });

        test('should handle invalid credentials', async () => {
            authenticationService.login.mockRejectedValue(new Error('Invalid credentials'));
            
            const res = mockRes();
            await loginController({ 
                body: { 
                    username: 'wrong', 
                    password: 'wrong' 
                } 
            }, res);
            
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    status: 401,
                    error: expect.objectContaining({ type: 'Unauthorized' })
                })
            );
        });
    });

    // Email Update Tests
    describe('Email Update Controller', () => {
        test('should update email successfully', async () => {
            const updatedUser = { ...mockUser, email: 'new@example.com' };
            authenticationService.updateEmail.mockResolvedValue(updatedUser);
            
            const res = mockRes();
            await updateEmailController({ 
                body: { 
                    username: mockUser.username, 
                    newEmail: 'new@example.com' 
                } 
            }, res);
            
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    status: 200,
                    data: expect.objectContaining({
                        message: expect.objectContaining({
                            email: 'new@example.com'
                        })
                    })
                })
            );
        });
    });

    // Password Update Tests
    describe('Password Update Controller', () => {
        test('should update password successfully', async () => {
            authenticationService.updatePassword.mockResolvedValue(mockUser);
            
            const res = mockRes();
            await updatePasswordController({ 
                body: { 
                    username: mockUser.username, 
                    newPassword: 'NewPass123!' 
                } 
            }, res);
            
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({ status: 200 })
            );
        });
    });

    // Preferences Update Tests
    describe('Preferences Update Controller', () => {
        test('should update preferences successfully', async () => {
            const updatedUser = { 
                ...mockUser, 
                riskAversion: 8, 
                growthFocus: 9 
            };
            authenticationService.updatePreferences.mockResolvedValue(updatedUser);
            
            const res = mockRes();
            await updatePreferencesController({ 
                body: { 
                    username: mockUser.username,
                    riskAversion: 8,
                    growthFocus: 9
                } 
            }, res);
            
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    status: 200,
                    data: expect.objectContaining({
                        message: expect.objectContaining({
                            riskAversion: 8,
                            growthFocus: 9
                        })
                    })
                })
            );
        });
    });

    // Delete Tests
    describe('Delete Controller', () => {
        test('should delete user successfully', async () => {
            authenticationService.deleteUser.mockResolvedValue(true);
            
            const res = mockRes();
            await deleteUserController({ 
                body: { username: mockUser.username } 
            }, res);
            
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({ status: 200 })
            );
        });
    });
});