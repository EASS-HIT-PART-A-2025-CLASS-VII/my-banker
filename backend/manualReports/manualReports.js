const generateProfitAndLossReport = require("./manualReportsModules/profitAndLossReportModule");
const generateBalancesReport = require("./manualReportsModules/balancesReportModule");
const generateActionReport = require("./manualReportsModules/actionReportModule");
const generateTransactionsListReport = require("./manualReportsModules/transactionsListReportModule");

/**
 * @module manualReports
 * @description Provides functions to generate various reports based on wallet data.
 */
module.exports = {
  generateProfitAndLossReport,
  generateBalancesReport,
  generateActionReport,
  generateTransactionsListReport,
};