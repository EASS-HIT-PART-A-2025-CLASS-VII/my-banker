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
function getWalletBalances(walletInfo) {
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
function summarizeTransactions(transactions) {
  let totalTransactions = 0;
  let tradingVolume = 0;
  let tradingFees = 0;

  // Iterate over each transaction to calculate summary details
  transactions.forEach((tx) => {
    totalTransactions += 1;

    // Add to trading volume if the transaction has a value
    if (tx.value) {
      tradingVolume += Number(tx.value);
    }

    // Calculate trading fees if gas and gas price are available
    if (tx.gas && tx.gas_price) {
      tradingFees += Number(tx.gas) * Number(tx.gas_price);
    }
  });

  // Return the summarized transaction details
  return {
    calculation_method: 'FIFO',
    total_transactions: totalTransactions,
    trading_volume: tradingVolume,
    trading_fees: tradingFees,
  };
}

/**
 * Collect all transactions into a flat list.
 * @param {Array} transactions - Array of transaction objects.
 * @returns {Array} A flat list of all transactions.
 */
function getAllTransactions(transactions) {
  return transactions;
}

// Export the functions for use in other modules
module.exports = {
  generateProfitAndLossReport,
  getWalletBalances,
  summarizeTransactions,
  getAllTransactions,
};