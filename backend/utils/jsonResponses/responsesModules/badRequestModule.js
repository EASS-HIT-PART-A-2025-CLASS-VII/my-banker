/**
 * Generate a bad request response.
 * @param {string} [message='Bad request'] - The error message.
 * @returns {Object} A JSON object with status and error details.
 */
module.exports = (message = 'Bad request') => ({
    status: 400,
    error: {
      type: 'BadRequest',
      message,
    },
  });
  