const express = require('express');
const router = express.Router();

// Import functions to process transactions and generate reports
const {
  generateProfitAndLossReport,
  generateWalletBalances,
  generateActionReport,
  generateAllTransactionsList,
} = require('./manualReports');

/**
 * @route POST /manual-report
 * @description Generates a comprehensive manual report based on transaction data.
 * @param {Object} req - The request object.
 * @param {Object} req.body.result - wallet data object containing coins and their transactions.
 * @returns {Object} res - The response object containing the full report.
 * @throws {Error} 400 - If the input data format is invalid.
 * @throws {Error} 500 - If an internal server error occurs.
 */
router.post('/', async (req, res) => {
  try {
    // Extract transactions from the request body
    const walletInfo = req.body.result;

    // Validate the input data format
    if(!walletInfo) {
      return res.status(400).json({ error: 'Invalid input data format' });
    }

    // Generate the profit and loss report
    const profitAndLoss = generateProfitAndLossReport(walletInfo);

    // Calculate the current wallet balances
    const balances = generateWalletBalances(walletInfo);

    // Generate the actions report
    const actionsReport = generateActionReport(walletInfo);

    // Generate a detailed list of all transactions
    const transactionsList = generateAllTransactionsList(walletInfo);


    // Combine all reports into a single object
    const fullReport = {
      profit_and_loss_report: profitAndLoss,
      current_balances: balances,
      actions_report: actionsReport,
      transactions: walletInfo,
    };

    // Send the full report as a JSON response
    res.status(200).json(fullReport);
  } catch (error) {
    // Log the error for debugging purposes
    console.error('Error generating manual report:', error);

    // Send a 500 Internal Server Error response
    res.status(500).json({ error: 'Failed to generate manual report' });
  }
});

// Export the router to be used in other parts of the application
module.exports = router;