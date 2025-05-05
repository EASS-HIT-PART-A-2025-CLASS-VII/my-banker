// services/manualReports.js

/**
 * Calculate profit and loss based on transaction data.
 * @param {Array} transactions - Array of transaction objects.
 * @returns {Object} An object containing total received, total sent, and profit or loss.
 */
function generateProfitAndLossReport(walletInfo) {
  return walletInfo.wallet.map(coinData => {
    let totalReceived = 0;
    let totalSent = 0;

    coinData.transactions.forEach(tx => {
      if (tx.type === "receive") {
        totalReceived += tx.amount;
      } else if (tx.type === "send") {
        totalSent += tx.amount;
      }
    });

    return {
      coin: coinData.coin,
      totalReceived,
      totalSent,
      profitOrLoss: totalReceived - totalSent
    };
  });
}

/**
 * Aggregate wallet balances based on the last state of transactions.
 * @param {Array} transactions - Array of transaction objects.
 * @returns {Object} An object containing aggregated balances for tokens, native assets, and NFTs.
 */
function generateWalletBalances(walletInfo) {
  return walletInfo.wallet.map(coinData => ({
    coin: coinData.coin,
    balance: coinData.balance
  }));
}

/**
 * Summarize transaction activity, including total transactions, trading volume, and trading fees.
 * @param {Array} transactions - Array of transaction objects.
 * @returns {Object} An object containing transaction summary details.
 */
function generateActionReport(walletInfo) {
  let totalActions = 0;
  let tradingVolume = 0;
  let totalCommission = 0;

  walletInfo.wallet.forEach(coinData => {
    coinData.transactions.forEach(tx => {
      totalActions += 1;
      // Trading volume is the sum of all amounts sent and received
      tradingVolume += tx.amount;
      // Total commission is the sum of all fees
      totalCommission += tx.fee || 0;
    });
  });

  return {
    calculationMethod: "FIFO",
    totalActions,
    tradingVolume,
    totalCommissionPaid: totalCommission
  };
}

/**
 * Collect all transactions into a flat list.
 * @param {Array} transactions - Array of transaction objects.
 * @returns {Array} A flat list of all transactions.
 */
function generateAllTransactionsList(transactions) {
  let allTransactions = [];
  walletData.wallet.forEach(coinData => {
    coinData.transactions.forEach(tx => {
      allTransactions.push({
        coin: coinData.coin,
        ...tx
      });
    });
  });
  return allTransactions;
}

// Export the functions for use in other modules
module.exports = {
  generateProfitAndLossReport,
  generateWalletBalances,
  generateActionReport,
  generateAllTransactionsList,
};