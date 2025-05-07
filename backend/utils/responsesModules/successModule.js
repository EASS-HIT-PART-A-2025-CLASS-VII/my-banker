/**
 * Generate a success response.
 * @param {string} [message='Successful response'] - The success message.
 * @returns {Object} A JSON object with status and message.
 */
module.exports = (message = 'Successful response') => ({
    status: 200,
    data: {
      type: 'Success',
      message,
    },
  });