const express = require('express');
const router = express.Router();
const manualReports = require('./manualReports');
const sampleData = require('../walletTransaction/sampleWalletData.json'); // נתוני דוגמה

/**
 * @route GET /manual-reports/full
 * @desc Generate all manual reports from sample data
 */
router.get('/full', (req, res) => {
  try {
    const balances = sampleData.balances;
    const transactions = sampleData.transactions;
    const currentPrices = sampleData.currentPrices;

    const balanceReport = manualReports.generateBalanceReport(balances);
    const transactionReport = manualReports.generateTransactionReport(transactions);
    const pnlReport = manualReports.generatePnLReport(transactions);
    const returnPercentage = manualReports.calculatePortfolioReturn(transactions, currentPrices);

    res.json({
      balanceReport,
      transactionReport,
      pnlReport,
      returnPercentage: `${returnPercentage.toFixed(2)}%`
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate manual reports', details: error.message });
  }
});

module.exports = router;
