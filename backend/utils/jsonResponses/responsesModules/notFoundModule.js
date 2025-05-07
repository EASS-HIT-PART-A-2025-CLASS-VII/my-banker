/**
 * Generate a not found response.
 * @param {string} [message='Resource not found'] - The error message.
 * @returns {Object} A JSON object with status and error details.
 */
module.exports = (message = 'Resource not found') => ({
    status: 404,
    error: {
      type: 'NotFound',
      message,
    },
  });