const deleteUser = require('../backend/authentication/authenticationModules/deleteModule');
const User = require('../backend/authentication/authenticationModel');
const { badRequestJsonResponse, internalErrorJsonResponse, successJsonResponse } = require('../backend/utils/jsonResponses/jsonResponses');

jest.mock('../backend/authentication/authenticationModel'); // Mock the User model

describe('deleteUser', () => {
  let req, res;

  beforeEach(() => {
    // Mock request and response objects
    req = { body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.clearAllMocks();
  });

  it('should return 400 if username is not provided', async () => {
    // Call the function
    await deleteUser(req, res);

    // Assert the response
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(badRequestJsonResponse('Username is required'));
  });

  it('should return 404 if user is not found', async () => {
    // Mock request body
    req.body.username = 'nonexistentUser';

    // Mock User.findOneAndDelete to return null
    User.findOneAndDelete.mockResolvedValue(null);

    // Call the function
    await deleteUser(req, res);

    // Assert the response
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(notFoundJsonResponse('User not found'));
  });

  it('should return 200 if user is successfully deleted', async () => {
    // Mock request body
    req.body.username = 'existingUser';

    // Mock User.findOneAndDelete to return a user object
    User.findOneAndDelete.mockResolvedValue({ username: 'existingUser' });

    // Call the function
    await deleteUser(req, res);

    // Assert the response
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(successJsonResponse('User deleted successfully'));
  });

  it('should return 500 if a server error occurs', async () => {
    // Mock request body
    req.body.username = 'existingUser';

    // Mock User.findOneAndDelete to throw an error
    User.findOneAndDelete.mockRejectedValue(new Error('Database error'));

    // Call the function
    await deleteUser(req, res);

    // Assert the response
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(internalErrorJsonResponse('Server error'));
  });
});