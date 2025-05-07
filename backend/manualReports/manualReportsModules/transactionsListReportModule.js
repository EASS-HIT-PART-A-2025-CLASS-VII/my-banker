/**
 * Collect all transactions into a flat list.
 * @param {Object} walletInfo - The wallet data object containing coins and their transactions.
 * @param {Array} walletInfo.wallet - Array of coin objects, each containing coin name, balance, and transactions.
 * @returns {Object} A JSON object containing all transactions with coin information included.
 */
function generateTransactionsListReport(walletInfo) {
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

module.exports = generateTransactionsListReport;