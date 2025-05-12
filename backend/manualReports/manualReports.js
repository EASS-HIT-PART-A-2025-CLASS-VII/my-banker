const generateProfitAndLossReport = require("./manualReportsModules/profitAndLossReportModule");
const generateActionReport = require("./manualReportsModules/actionReportModule");

/**
 * @module manualReports
 * @description Provides functions to generate various reports based on wallet data.
 */
module.exports = {
  generateProfitAndLossReport,
  generateActionReport,
};