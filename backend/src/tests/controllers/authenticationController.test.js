const {
    loginController,
    registerController,
    updateUserController,
    deleteUserController
} = require('../../controllers/authenticationController');
const {
    badRequestJsonResponse,
    notFoundJsonResponse,
    unauthorizedJsonResponse,
    internalErrorJsonResponse,
    successJsonResponse,
} = require('../../utils/jsonResponses/jsonResponses');

const authenticationService = require('../../services/authentication/authentication');
const User = require('../../models/userModel');
const updateUser = require('../../services/authentication/update');

// Mock service
jest.mock('../../services/authentication/authentication');
jest.mock('../utils/jsonResponses/jsonResponses', () => ({
    successJsonResponse: jest.fn((data) => ({ status: 'success', data })),
    badRequestJsonResponse: jest.fn((msg) => ({ status: 'bad', msg })),
    internalErrorJsonResponse: jest.fn((msg) => ({ status: 'error', msg })),
    // Add other response functions if needed
}));

describe('Authentication Controllers', () => {
    const mockRequest = (body = {}) => ({ body });
    const mockResponse = () => ({
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('registerController', () => {
        let req, res;

        beforeEach(() => {
            req = {
                body: {
                    username: 'testuser',
                    password: 'password123',
                    email: 'test@example.com'
                }
            };
            res = {
                json: jest.fn()
            };
            successJsonResponse.mockImplementation((data) => ({ status: 'success', data }));
            badRequestJsonResponse.mockImplementation((msg) => ({ status: 'bad', msg }));
            internalErrorJsonResponse.mockImplementation((msg) => ({ status: 'error', msg }));
        });

        afterEach(() => {
            jest.clearAllMocks();
        });
        it('should successfully register a new user and return the correct format', async () => {
            // Mocking the save method of User model
            const mockSave = jest.fn().mockResolvedValue(true);
            User.mockImplementation(() => ({
                save: mockSave,
                username: 'testuser2',
                email: 'test2@example.com',
            }));

            // Mock bcrypt to return a fake hashed password
            bcrypt.hash.mockResolvedValue('hashed_password');

            const userData = {
                username: 'testuser2',
                password: 'testuser2',
                email: 'test2@example.com',
                riskAversion: 7,
                volatilityTolerance: 6,
                growthFocus: 8,
                cryptoExperience: 5,
                innovationTrust: 7,
                impactInterest: 6,
                diversification: 8,
                holdingPatience: 7,
                monitoringFrequency: 8,
                adviceOpenness: 6,
            };

            // Mock the User.findOne method to return null (no existing user)
            User.findOne.mockResolvedValue(null);

            const result = await register(userData);

            // Verify the results
            expect(User.findOne).toHaveBeenCalledWith({
                $or: [
                    { username: 'testuser2' },
                    { email: 'test2@example.com' },
                ],
            });
            expect(bcrypt.hash).toHaveBeenCalledWith('testuser2', 10); // Check if bcrypt.hash was called with correct arguments
            expect(mockSave).toHaveBeenCalled(); // Ensure save method was called

            expect(result).toEqual({
                status: 200,
                data: {
                    type: 'Success',
                    message: {
                        username: 'testuser2',
                        email: 'test2@example.com',
                        riskAversion: 7,
                        volatilityTolerance: 6,
                        growthFocus: 8,
                        cryptoExperience: 5,
                        innovationTrust: 7,
                        impactInterest: 6,
                        diversification: 8,
                        holdingPatience: 7,
                        monitoringFrequency: 8,
                        adviceOpenness: 6,
                    },
                },
            });
        });

        it('should handle user already exists error and return a bad request response', async () => {
            // Mock an error indicating user already exists
            authenticationService.register.mockRejectedValue(new Error('User already exists'));

            // Call the registerController function
            await registerController(req, res);

            // Verify that the response is a bad request with the correct error message
            expect(res.json).toHaveBeenCalledWith(badRequestJsonResponse('User already exists'));
        });

        it('should handle server error and return an internal error response', async () => {
            // Mock an error that isn't handled specifically (a general error)
            authenticationService.register.mockRejectedValue(new Error('Some server error'));

            // Call the registerController function
            await registerController(req, res);

            // Verify that the response is an internal error with the correct error message
            expect(res.json).toHaveBeenCalledWith(internalErrorJsonResponse('Some server error'));
        });

        it('should handle server error', async () => {
            authenticationService.register.mockRejectedValue(new Error('DB error'));

            await registerController(req, res);

            expect(res.json).toHaveBeenCalledWith({ status: 'error', msg: 'DB error' });
        });
    });

    describe('loginController', () => {
        it('should login successfully with valid credentials', async () => {
            authenticationService.login.mockResolvedValue('jwt_token');

            const req = mockRequest({
                username: 'testuser',
                password: 'Test123!'
            });
            const res = mockResponse();

            await loginController(req, res);

            expect(res.json).toHaveBeenCalledWith({
                status: 200,
                data: {
                    type: 'Success',
                    message: 'jwt_token'
                }
            });
        });

        it('should reject invalid credentials', async () => {
            authenticationService.login.mockRejectedValue(new Error('Invalid credentials'));

            const req = mockRequest({
                username: 'testuser',
                password: 'wrongpass'
            });
            const res = mockResponse();

            await loginController(req, res);

            expect(res.json).toHaveBeenCalledWith({
                status: 401,
                error: {
                    type: 'Unauthorized',
                    message: 'Invalid credentials'
                }
            });
        });
    });

    describe('updateUser', () => {
        let mockUser;

        beforeEach(() => {
            jest.clearAllMocks();

            mockUser = {
                username: 'oldUsername',
                password: 'oldPassword',
                email: 'old@example.com',
                save: jest.fn().mockResolvedValue(true)
            };

            User.findOne.mockImplementation(({ username, email }) => {
                if (username === 'oldUsername') return Promise.resolve(mockUser);
                if (username === 'newUsername') return Promise.resolve(null);
                if (email === 'existing@example.com') return Promise.resolve({});
                return Promise.resolve(null);
            });
        });
        it('should update both username and password successfully', async () => {
            bcrypt.hash.mockResolvedValue('hashedPassword');

            const updatedUser = await updateUser('oldUsername', {
                newUsername: 'newUsername',
                newPassword: 'newPassword'
            });

            expect(User.findOne).toHaveBeenCalledWith({ username: 'oldUsername' });
            expect(User.findOne).toHaveBeenCalledWith({ username: 'newUsername' });
            expect(bcrypt.hash).toHaveBeenCalledWith('newPassword', 10);
            expect(mockUser.username).toBe('newUsername');
            expect(mockUser.password).toBe('hashedPassword');
            expect(mockUser.save).toHaveBeenCalled();
            expect(updatedUser.username).toBe('newUsername');
        });
        it('should throw error if new username already exists', async () => {
            User.findOne.mockImplementation(({ username }) => {
                if (username === 'oldUsername') return Promise.resolve(mockUser);
                if (username === 'takenUsername') return Promise.resolve({});
                return Promise.resolve(null);
            });

            await expect(updateUser('oldUsername', {
                newUsername: 'takenUsername'
            })).rejects.toThrow('Username already exists');
        });
        it('should throw error if riskAversion is out of range', async () => {
            await expect(updateUser('oldUsername', {
                riskAversion: 11
            })).rejects.toThrow('riskAversion must be between 1 and 10');
        });
        it('should handle bcrypt.hash errors', async () => {
            bcrypt.hash.mockRejectedValue(new Error('Hashing error'));

            await expect(updateUser('oldUsername', {
                newPassword: 'newPassword'
            })).rejects.toThrow('Hashing error');
        });
    });


    describe('deleteUserController', () => {
        it('should delete user successfully', async () => {
            authenticationService.deleteUser.mockResolvedValue({
                username: 'testuser'
            });

            const req = mockRequest({ username: 'testuser' });
            const res = mockResponse();

            await deleteUserController(req, res);

            expect(res.json).toHaveBeenCalledWith({
                status: 200,
                data: {
                    type: 'Success',
                    message: {
                        username: 'testuser'
                    }
                }
            });
        });

        it('should handle non-existent user', async () => {
            authenticationService.deleteUser.mockRejectedValue(new Error('User not found'));

            const req = mockRequest({ username: 'nonexistent' });
            const res = mockResponse();

            await deleteUserController(req, res);

            expect(res.json).toHaveBeenCalledWith({
                status: 404,
                error: {
                    type: 'NotFound',
                    message: 'User not found'
                }
            });
        });
    });
});
