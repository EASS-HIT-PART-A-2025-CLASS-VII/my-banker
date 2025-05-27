const {
    registerController,
    loginController,
    updateUserController,
    deleteUserController
} = require('../../controllers/authenticationController');

const authenticationService = require('../../services/authentication/authentication');
jest.mock('../../services/authentication/authentication');

const mockRes = () => {
    const res = {};
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

describe('Auth ControllerנTests', () => {
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

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('registerController - success', async () => {
        authenticationService.register.mockResolvedValue(mockUser);

        const req = { body: mockUser };
        const res = mockRes();

        await registerController(req, res);

        expect(res.json).toHaveBeenCalledWith({
            status: 200,
            data: {
                type: 'Success',
                message: mockUser,
            },
        });
    });

    test('registerController - user already exists', async () => {
        authenticationService.register.mockRejectedValue(new Error('User already exists'));

        const req = { body: mockUser };
        const res = mockRes();

        await registerController(req, res);

        expect(res.json).toHaveBeenCalledWith({
            status: 400,
            error: {
                type: 'BadRequest',
                message: 'User already exists',
            },
        });
    });

    test('loginController - success', async () => {
        authenticationService.login.mockResolvedValue('jwt-token');

        const req = { body: { username: mockUser.username, password: mockUser.password } };
        const res = mockRes();

        await loginController(req, res);

        expect(res.json).toHaveBeenCalledWith({
            status: 200,
            data: {
                type: 'Success',
                message: 'jwt-token',
            },
        });
    });

    test('loginController - invalid credentials', async () => {
        authenticationService.login.mockRejectedValue(new Error('Invalid credentials'));

        const req = { body: { username: mockUser.username, password: 'wrongpass' } };
        const res = mockRes();

        await loginController(req, res);

        expect(res.json).toHaveBeenCalledWith({
            status: 401,
            error: {
                type: 'Unauthorized',
                message: 'Invalid credentials',
            },
        });
    });

    test('updateUserController - success', async () => {
        const updatedUser = { ...mockUser, growthFocus: 1 };
        authenticationService.updateUser.mockResolvedValue(updatedUser);

        const req = { body: updatedUser };
        const res = mockRes();

        await updateUserController(req, res);

        expect(res.json).toHaveBeenCalledWith({
            status: 200,
            data: {
                type: 'Success',
                message: updatedUser,
            },
        });
    });

    test('updateUserController - user not found', async () => {
        authenticationService.updateUser.mockRejectedValue(new Error('User not found'));

        const req = { body: mockUser };
        const res = mockRes();

        await updateUserController(req, res);

        expect(res.json).toHaveBeenCalledWith({
            status: 404,
            error: {
                type: 'NotFound',
                message: 'User not found',
            },
        });
    });

    test('deleteUserController - success', async () => {
        authenticationService.deleteUser.mockResolvedValue({ username: mockUser.username });

        const req = { body: { username: mockUser.username } };
        const res = mockRes();

        await deleteUserController(req, res);

        expect(res.json).toHaveBeenCalledWith({
            status: 200,
            data: {
                type: 'Success',
                message: { username: mockUser.username },
            },
        });
    });

    test('deleteUserController - user not found', async () => {
        authenticationService.deleteUser.mockRejectedValue(new Error('User not found'));

        const req = { body: { username: 'nonexistent' } };
        const res = mockRes();

        await deleteUserController(req, res);

        expect(res.json).toHaveBeenCalledWith({
            status: 404,
            error: {
                type: 'NotFound',
                message: 'User not found',
            },
        });
    });
});
