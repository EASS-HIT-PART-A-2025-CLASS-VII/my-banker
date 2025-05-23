const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

/**
 * @function verifyToken
 * @description Middleware to verify JWT tokens in request headers
 */
const verifyToken = (req, res, next) => {
  // Get authorization header
  const authHeader = req.headers.authorization;

  // Check if token exists and has correct format
  if (!authHeader || !authHeader.startsWith('Bearer ')) throw new Error("No token provided");

  // Extract token from header
  const token = authHeader.split(' ')[1];

  try {
    // Verify and decode token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Add decoded user data to request
    req.user = decoded;

    // Continue to next middleware
    next();
  } catch (error) {
    // Throw an error if token verification fails
    throw new Error("Invalid token");
  }
};

module.exports = verifyToken;