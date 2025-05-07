/**
 * Generate an unauthorized response.
 * @param {string} [message='Authenticate to access this resource'] - The error message.
 * @returns {Object} A JSON object with status and error details.
 */
module.exports = (message = 'Authenticate to access this resource') => ({
    status: 401,
    error: {
      type: 'Unauthorized',
      message,
    },
  });