const {
    loginController,
    registerController,
    updateUserController,
    deleteUserController
} = require('../../controllers/authenticationController');

const authenticationService = require('../../services/authentication/authentication');

// Mock service
jest.mock('../../services/authentication/authentication');

describe('Authentication Controllers', () => {
    // Setup request/response mocks
    const mockRequest = (body = {}) => ({ body });
    const mockResponse = () => ({
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
    });

    // Reset mocks before each test
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('registerController', () => {
        it('should register new user successfully', async () => {
            // Mock successful registration
            authenticationService.register.mockResolvedValue({
                username: 'testuser',
                password: 'hashedpassword'
            });

            // Setup test data
            const req = mockRequest({
                username: 'testuser',
                password: 'Test123!'
            });
            const res = mockResponse();

            // Execute controller
            await registerController(req, res);

            // Verify response
            expect(res.json).toHaveBeenCalledWith({
                status: 200,
                data: {
                    type: 'Success',
                    message: 'username: testuser, password: hashedpassword'
                }
            });
        });

        it('should handle duplicate username', async () => {
            // Mock registration failure
            authenticationService.register.mockRejectedValue(new Error('User already exists'));

            // Setup test data
            const req = mockRequest({
                username: 'testuser',
                password: 'Test123!'
            });
            const res = mockResponse();

            // Execute controller
            await registerController(req, res);

            // Verify error response
            expect(res.json).toHaveBeenCalledWith({
                status: 400,
                error: {
                    type: 'BadRequest',
                    message: 'User already exists'
                }
            });
        });
    });

    describe('loginController', () => {
        it('should login successfully with valid credentials', async () => {
            // Mock successful login
            authenticationService.login.mockResolvedValue('jwt_token');

            // Setup test data
            const req = mockRequest({
                username: 'testuser',
                password: 'Test123!'
            });
            const res = mockResponse();

            // Execute controller
            await loginController(req, res);

            // Verify response
            expect(res.json).toHaveBeenCalledWith({
                status: 200,
                data: {
                    type: 'Success',
                    message: 'jwt_token'
                }
            });
        });

        it('should reject invalid credentials', async () => {
            // Mock login failure
            authenticationService.login.mockRejectedValue(new Error('Invalid credentials'));

            // Setup test data
            const req = mockRequest({
                username: 'testuser',
                password: 'wrongpass'
            });
            const res = mockResponse();

            // Execute controller
            await loginController(req, res);

            // Verify error response
            expect(res.json).toHaveBeenCalledWith({
                status: 401,
                error: {
                    type: 'Unauthorized',
                    message: 'Invalid credentials'
                }
            });
        });
    });

    describe('updateUserController', () => {
        it('should update user successfully', async () => {
            // Mock successful update
            authenticationService.updateUser.mockResolvedValue({
                username: 'updateduser',
                password: 'hashedpassword'
            });

            // Setup test data
            const req = mockRequest({
                username: 'testuser',
                newUsername: 'updateduser'
            });
            const res = mockResponse();

            // Execute controller
            await updateUserController(req, res);

            // Verify response
            expect(res.json).toHaveBeenCalledWith({
                status: 200,
                data: {
                    type: 'Success',
                    message: {
                        username: 'updateduser',
                        password: 'hashedpassword'
                    }
                }
            });
        });

        it('should handle non-existent user', async () => {
            // Mock update failure
            authenticationService.updateUser.mockRejectedValue(new Error('User not found'));

            // Setup test data
            const req = mockRequest({
                username: 'nonexistent',
                newUsername: 'newname'
            });
            const res = mockResponse();

            // Execute controller
            await updateUserController(req, res);

            // Verify error response
            expect(res.json).toHaveBeenCalledWith({
                status: 404,
                error: {
                    type: 'NotFound',
                    message: 'User not found'
                }
            });
        });
    });

    describe('deleteUserController', () => {
        it('should delete user successfully', async () => {
            // Mock successful deletion
            authenticationService.deleteUser.mockResolvedValue({
                username: 'testuser'
            });

            // Setup test data
            const req = mockRequest({ username: 'testuser' });
            const res = mockResponse();

            // Execute controller
            await deleteUserController(req, res);

            // Verify response
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
            // Mock deletion failure
            authenticationService.deleteUser.mockRejectedValue(new Error('User not found'));

            // Setup test data
            const req = mockRequest({ username: 'nonexistent' });
            const res = mockResponse();

            // Execute controller
            await deleteUserController(req, res);

            // Verify error response
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