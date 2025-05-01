const express = require('express');
const router = express.Router();
const { generateManualReport } = require('./manualReports');

/**
 * @route POST /manual-reports
 * @description Generates a manual report based on the provided transaction data.
 * @param {Object} req - The request object.
 * @param {Array} req.body.result - Array of transaction entries.
 * @returns {Object} res - The response object containing the generated report.
 * @throws {Error} 400 - If the input data format is invalid.
 * @throws {Error} 500 - If an internal server error occurs.
 */
router.post('/', (req, res) => {
  try {
    // Extract the "result" array from the request body
    const { result } = req.body;

    // Generate the manual report using the provided data
    const report = generateManualReport(result);

    // Return the generated report as a JSON response
    return res.status(200).json({ report });
  } catch (err) {
    console.error('Error generating manual report:', err.message);

    // Determine the appropriate status code based on the error message
    const status = err.message.includes('Invalid data format') ? 400 : 500;

    return res.status(status).json({ error: err.message });
  }
});

module.exports = router;