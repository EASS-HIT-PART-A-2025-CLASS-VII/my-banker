const generateProfitAndLossReport = require("./manualReportsModules/profitAndLossReportModule");
const generateActionReport = require("./manualReportsModules/actionReportModule");

/**
 * @module manualReports
 * @description Provides functions to generate various reports based on wallet data.
 */

function getManualReport(walletInfo) {
  // Validate the input data format
  if (!walletInfo) {
    throw new Error("Invalid input data format");
  }

  // Generate the profit and loss report
  const profitAndLoss = generateProfitAndLossReport(walletInfo);

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

  return fullReport;
}

module.exports = getManualReport;