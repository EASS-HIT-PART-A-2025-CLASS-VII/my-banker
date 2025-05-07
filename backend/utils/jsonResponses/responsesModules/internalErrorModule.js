/**
 * Generate an internal server error response.
 * @param {string} [message='Server error'] - The error message.
 * @returns {Object} A JSON object with status and error details.
 */
module.exports = (message = 'Server error') => ({
    status: 500,
    error: {
      type: 'InternalServerError',
      message,
    },
  });