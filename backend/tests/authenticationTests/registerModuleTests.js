const register = require('../../backend/authentication/authenticationModules/registerModule');
const User = require('../../backend/authentication/authenticationModel');
const { badRequestJsonResponse, internalErrorJsonResponse, successJsonResponse } = require('../../backend/utils/jsonResponses/jsonResponses');

jest.mock('../../backend/authentication/authenticationModel'); // Mock the User model

describe('Register Module', () => {
  let req, res;

  beforeEach(() => {
    // Mock request and response objects
    req = {
      body: {
        username: 'testuser',
        password: 'testpassword',
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  it('should return 500 if a server error occurs', async () => {
    /**
     * Test registration when a server error occurs.
     */
    // Mock the save method to throw an error
    User.prototype.save = jest.fn().mockImplementation(() => {
      throw new Error('Database error');
    });

    await register(req, res);

    // Assert that the response status is 500
    expect(res.status).toHaveBeenCalledWith(500);

    // Assert that the response contains the correct error message
    expect(res.json).toHaveBeenCalledWith(internalErrorJsonResponse('Server error'));
  });
});
