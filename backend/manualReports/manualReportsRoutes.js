const express = require('express');
const router = express.Router();

// Import functions to process transactions and generate reports
const { generateProfitAndLossReport, generateBalancesReport, generateActionReport, generateTransactionsListReport } = require('./manualReports');
const { badRequestJsonResponse, notFoundJsonResponse, unauthorizedJsonResponse, internalErrorJsonResponse, successJsonResponse } = require('../utils/jsonResponses/jsonResponses'); 

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
    const walletInfo = req.body;

    // Validate the input data format
    if(!walletInfo) {
      return res.status(400).json(badRequestJsonResponse('Invalid input data format'));
    }

    // Generate the profit and loss report
    const profitAndLoss = await generateProfitAndLossReport(walletInfo);

    // Calculate the current wallet balances
    const balances = walletInfo.balance;

    // Generate the actions report
    const actionsReport = generateActionReport(walletInfo);

    // Generate a detailed list of all transactions
    const transactionsList = walletInfo.transactions;


    // Combine all reports into a single object
    const fullReport = {
      profit_and_loss_report: profitAndLoss,
      current_balances: balances,
      actions_report: actionsReport,
      transactions: transactionsList,
    };

    // Send the full report as a JSON response
    res.status(200).json(fullReport);
  } catch (error) {
    // Log the error for debugging purposes
    console.error('Error generating manual report:', error);

    // Send a 500 Internal Server Error response
    res.status(500).json(internalErrorJsonResponse('Internal server error while generating report'));
  }
});

// Export the router to be used in other parts of the application
module.exports = router;