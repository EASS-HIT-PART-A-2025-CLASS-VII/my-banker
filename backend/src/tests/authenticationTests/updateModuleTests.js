const update = require('../backend/authentication/authenticationModules/updateModule');
const User = require('../backend/authentication/authenticationModel');
const { badRequestJsonResponse, internalErrorJsonResponse, successJsonResponse } = require('../backend/utils/jsonResponses/jsonResponses');

jest.mock('../backend/authentication/authenticationModel'); // Mock the User model

describe('Update Module', () => {
  let req, res;

  beforeEach(() => {
    // Mock request and response objects
    req = {
      body: {
        username: '',
        newUsername: '',
        newPassword: '',
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.clearAllMocks();
  });

  it('should return 400 if username is not provided', async () => {
    // Call the function
    await update(req, res);

    // Assert the response
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(badRequestJsonResponse('Username is required'));
  });

  it('should return 404 if user is not found', async () => {
    // Mock request body
    req.body.username = 'nonexistentUser';

    // Mock User.findOne to return null
    User.findOne.mockResolvedValue(null);

    // Call the function
    await update(req, res);

    // Assert the response
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(notFoundJsonResponse('User not found'));
  });

  it('should update username and return 200 if newUsername is provided', async () => {
    // Mock request body
    req.body.username = 'existingUser';
    req.body.newUsername = 'updatedUser';

    // Mock User.findOne to return a user object
    const mockUser = { username: 'existingUser', save: jest.fn() };
    User.findOne.mockResolvedValue(mockUser);

    // Call the function
    await update(req, res);

    // Assert the response
    expect(mockUser.username).toBe('updatedUser');
    expect(mockUser.save).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(successJsonResponse('User credentials updated successfully'));
  });

  it('should update password and return 200 if newPassword is provided', async () => {
    // Mock request body
    req.body.username = 'existingUser';
    req.body.newPassword = 'newPassword123';

    // Mock User.findOne to return a user object
    const mockUser = { username: 'existingUser', password: 'oldPassword', save: jest.fn() };
    User.findOne.mockResolvedValue(mockUser);

    // Call the function
    await update(req, res);

    // Assert the response
    expect(mockUser.password).toBe('newPassword123');
    expect(mockUser.save).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(successJsonResponse('User credentials updated successfully'));
  });

  it('should update both username and password and return 200 if both are provided', async () => {
    // Mock request body
    req.body.username = 'existingUser';
    req.body.newUsername = 'updatedUser';
    req.body.newPassword = 'newPassword123';

    // Mock User.findOne to return a user object
    const mockUser = { username: 'existingUser', password: 'oldPassword', save: jest.fn() };
    User.findOne.mockResolvedValue(mockUser);

    // Call the function
    await update(req, res);

    // Assert the response
    expect(mockUser.username).toBe('updatedUser');
    expect(mockUser.password).toBe('newPassword123');
    expect(mockUser.save).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(successJsonResponse('User credentials updated successfully'));
  });

  it('should return 500 if a server error occurs', async () => {
    // Mock request body
    req.body.username = 'existingUser';

    // Mock User.findOne to throw an error
    User.findOne.mockRejectedValue(new Error('Database error'));

    // Call the function
    await update(req, res);

    // Assert the response
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(internalErrorJsonResponse('Server error'));
  });
});