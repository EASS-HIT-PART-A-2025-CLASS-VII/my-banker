/**
 * Summarize transaction activity, including total transactions, trading volume, and trading fees.
 * @param {Object} walletInfo - The wallet data object containing coins and their transactions.
 * @param {Array} walletInfo.wallet - Array of coin objects, each containing coin name, balance, and transactions.
 * @returns {Object} A JSON object containing transaction summary details.
 */
function generateActionReport(walletInfo) {
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

    return {
      coin: walletInfo.coin,
      calculationMethod: "FIFO", 
      totalActions, 
      tradingVolume, 
      totalCommissionPaid: totalCommission 
    };
 }

 module.exports = generateActionReport;