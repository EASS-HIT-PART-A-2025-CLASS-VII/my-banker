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

module.exports = generateProfitAndLossReport;