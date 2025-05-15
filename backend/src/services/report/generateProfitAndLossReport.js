const { getHistoricalPrice, formatDate } = require('../../externals/abstractLayersForAPI/getCoinPriceByDate');

/**
 * Calculate profit and loss based on wallet data.
 * 
 * This function processes wallet transactions to calculate the total income,
 * total cost, fees, and the resulting profit or loss for each coin.
 * 
 * @param {Object} walletInfo - The wallet data object containing coins and their transactions.
 * @param {Array} walletInfo.wallet - Array of coin objects, each containing coin name, balance, and transactions.
 * @returns {Object} A JSON object containing profit and loss details for each coin.
 */
async function generateProfitAndLossReport(walletInfo) {
    let totalIncome = 0; 
    let totalCost = 0;  
    let fees = 0;

    // Iterate through each transaction in the wallet data
    for (const tx of walletInfo.transactions) {
        const dateStr = formatDate(tx.timestamp);
        const price = await getHistoricalPrice("bitcoin", dateStr);

        // Calculate the transaction value in USD
        const valueInUSD = price * tx.amount;

        // Check if the transaction is a "receive" type (purchase)
        if (tx.type === "receive") {
            totalCost += valueInUSD; 
        } 
        // Check if the transaction is a "send" type (sale)
        else if (tx.type === "send") {
            totalIncome += valueInUSD;  
        }

        fees += tx.fee || 0;
    }

    // Calculate the net profit or loss
    const gainOrLoss = totalIncome - totalCost - fees;

    return {
        Gain: +totalIncome.toFixed(2), 
        Loss: +totalCost.toFixed(2), 
        Fees: +fees.toFixed(2),
        Sum: +gainOrLoss.toFixed(2)
    };
}

module.exports = generateProfitAndLossReport;