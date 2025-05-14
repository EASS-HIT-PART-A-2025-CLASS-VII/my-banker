const login = require('../backend/authentication/authenticationModules/loginModule');
const User = require('../backend/authentication/authenticationModel');
const { badRequestJsonResponse, internalErrorJsonResponse, successJsonResponse } = require('../backend/utils/jsonResponses/jsonResponses');

jest.mock('../backend/authentication/authenticationModel'); // Mock the User model

describe('Login Module', () => {
  let req, res;

  beforeEach(() => {
    // Mock request and response objects
    req = {
      body: {
        username: '',
        password: '',
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  it('should return 400 if username or password is invalid', async () => {
    // Mock User.findOne to return null (user not found)
    User.findOne.mockResolvedValue(null);

    req.body.username = 'invaliduser';
    req.body.password = 'wrongpassword';

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(badRequestJsonResponse('Invalid credentials'));
  });

  it('should return 400 if password does not match', async () => {
    // Mock User.findOne to return a user with a different password
    User.findOne.mockResolvedValue({ username: 'testuser', password: 'correctpassword' });

    req.body.username = 'testuser';
    req.body.password = 'wrongpassword';

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(badRequestJsonResponse('Invalid credentials'));
  });

  it('should return 200 if username and password are valid', async () => {
    // Mock User.findOne to return a user with matching credentials
    User.findOne.mockResolvedValue({ username: 'testuser', password: 'testpassword' });

    req.body.username = 'testuser';
    req.body.password = 'testpassword';

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(successJsonResponse('Login successfuly'));
  });

  it('should return 500 if a server error occurs', async () => {
    // Mock User.findOne to throw an error
    User.findOne.mockRejectedValue(new Error('Database error'));

    req.body.username = 'testuser';
    req.body.password = 'testpassword';

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(internalErrorJsonResponse('Server error'));
  });
});