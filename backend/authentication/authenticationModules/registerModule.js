const User = require('../authenticationModel'); 

/**
 * Handles user registration.
 * @async
 * @function register
 * @param {express.Request} req - Express request object containing `username` and `password` in the body.
 * @param {express.Response} res - Express response object.
 * @returns {Promise<void>} Sends a JSON response with a success or error message.
 */
const register = async (req, res) => {
  const { username, password } = req.body; // Extract username and password from the request body.

  try {
    // Check if a user with the same username already exists in the database.
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' }); // Return an error if the username is already taken.
    }

    // Create a new user instance with the provided username and password.
    const newUser = new User({ username, password });

    // Save the new user to the database.
    await newUser.save();

    // Send a success response after successful registration.
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    // Handle any server errors that occur during the registration process.
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = register;