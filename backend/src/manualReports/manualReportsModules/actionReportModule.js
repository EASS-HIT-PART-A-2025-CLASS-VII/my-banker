/**
 * Summarize transaction activity, including total transactions, trading volume, and trading fees.
 * @param {Object} walletInfo - The wallet data object containing coins and their transactions.
 * @param {Array} walletInfo.wallet - Array of coin objects, each containing coin name, balance, and transactions.
 * @returns {Object} A JSON object containing transaction summary details.
 */
function generateActionReport(walletInfo) {
    // Map over each coin in the wallet to process its transactions
    // Get the total number of transactions for the coin
    let totalActions = walletInfo.transactions.length;

    // Initialize variables to calculate trading volume and total commission
    let tradingVolume = 0;
    let totalCommission = 0;

    // Iterate over each transaction for the coin
    walletInfo.transactions.forEach(tx => {
      // Add the transaction amount to the trading volume
      tradingVolume += tx.amount;

      // Add the transaction fee to the total commission
      totalCommission += tx.fee || 0;
    });

    // Return a JSON object summarizing the transactions for the coin
    return {
      coin: walletInfo.coin, // The name of the coin
      calculationMethod: "FIFO", // The calculation method used
      totalActions, // Total number of transactions
      tradingVolume, // Total trading volume for the coin
      totalCommissionPaid: totalCommission // Total commission paid for the transactions
    };
 }

 module.exports = generateActionReport;