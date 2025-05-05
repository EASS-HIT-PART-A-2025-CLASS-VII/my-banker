
/**
 * Calculate profit and loss based on wallet data.
 * @param {Object} walletInfo - The wallet data object containing coins and their transactions.
 * @param {Array} walletInfo.wallet - Array of coin objects, each containing coin name, balance, and transactions.
 * @returns {Object} A JSON object containing profit and loss details for each coin.
 */
function generateProfitAndLossReport(walletInfo) {
  // Initialize an object to store profit and loss details
  const profitAndLoss = {};

  // Iterate over each coin in the wallet to calculate profit and loss
  walletInfo.wallet.forEach(coinData => {
    let totalReceived = 0;
    let totalSent = 0;

    // Iterate over each transaction for the coin
    coinData.transactions.forEach(tx => {
      // Add to total received if the transaction type is "receive"
      if (tx.type === "receive") {
        totalReceived += tx.amount;
      // Add to total sent if the transaction type is "send"
      } else if (tx.type === "send") {
        totalSent += tx.amount;
      }
    });

    // Store the profit and loss details for the coin
    profitAndLoss[coinData.coin] = {
      totalReceived,
      totalSent,
      profitOrLoss: totalReceived - totalSent
    };
  });

  // Return the profit and loss details as a JSON object
  return profitAndLoss;
}

/**
 * Aggregate wallet balances based on the last state of wallet data.
 * @param {Object} walletInfo - The wallet data object containing coins and their balances.
 * @param {Array} walletInfo.wallet - Array of coin objects, each containing coin name, balance, and transactions.
 * @returns {Object} A JSON object containing the balance for each coin.
 */
function generateWalletBalances(walletInfo) {
  // Initialize an object to store balances
  const balances = {};

  // Iterate over each coin in the wallet to extract its balance
  walletInfo.wallet.forEach(coinData => {
    balances[coinData.coin] = coinData.balance;
  });

  // Return the balances as a JSON object
  return balances;
}

/**
 * Summarize transaction activity, including total transactions, trading volume, and trading fees.
 * @param {Object} walletInfo - The wallet data object containing coins and their transactions.
 * @param {Array} walletInfo.wallet - Array of coin objects, each containing coin name, balance, and transactions.
 * @returns {Object} A JSON object containing transaction summary details.
 */
function generateActionReport(walletInfo) {
   // Map over each coin in the wallet to process its transactions
   return walletInfo.wallet.map(coinData => {
    // Get the total number of transactions for the coin
    let totalActions = coinData.transactions.length;

    // Initialize variables to calculate trading volume and total commission
    let tradingVolume = 0;
    let totalCommission = 0;

    // Iterate over each transaction for the coin
    coinData.transactions.forEach(tx => {
      // Add the transaction amount to the trading volume
      tradingVolume += tx.amount;

      // Add the transaction fee to the total commission
      totalCommission += tx.fee || 0;
    });

    // Return a JSON object summarizing the transactions for the coin
    return {
      coin: coinData.coin, // The name of the coin
      calculationMethod: "FIFO", // The calculation method used
      totalActions, // Total number of transactions
      tradingVolume, // Total trading volume for the coin
      totalCommissionPaid: totalCommission // Total commission paid for the transactions
    };
  });
}

/**
 * Collect all transactions into a flat list.
 * @param {Object} walletInfo - The wallet data object containing coins and their transactions.
 * @param {Array} walletInfo.wallet - Array of coin objects, each containing coin name, balance, and transactions.
 * @returns {Object} A JSON object containing all transactions with coin information included.
 */
function generateAllTransactionsList(walletInfo) {
  // Initialize an array to store all transactions
  const allTransactions = [];

  // Iterate over each coin in the wallet
  walletInfo.wallet.forEach(coinData => {
    // Iterate over each transaction for the coin and add it to the flat list
    coinData.transactions.forEach(tx => {
      allTransactions.push({
        coin: coinData.coin,
        ...tx
      });
    });
  });

  // Return the flat list of all transactions as a JSON object
  return { transactions: allTransactions };
}

// Export the functions for use in other modules
module.exports = {
  generateProfitAndLossReport,
  generateWalletBalances,
  generateActionReport,
  generateAllTransactionsList,
};