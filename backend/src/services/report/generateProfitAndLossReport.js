const { getHistoricalPrice, formatDate } = require('../../externals/abstractLayersForAPI/getCoinPriceByDate');

/**
 * @function generateProfitAndLossReport
 * @description Calculates profit and loss metrics from wallet transactions
 */
async function generateProfitAndLossReport(walletInfo) {
    let totalIncome = 0; 
    let totalCost = 0;  
    let fees = 0;

    for (const tx of walletInfo.transactions) {
        // Get historical price data
        const dateStr = formatDate(tx.timestamp);
        const price = await getHistoricalPrice("bitcoin", dateStr);

        // Calculate USD value
        const valueInUSD = price * tx.amount;

        // Process purchase transaction
        if (tx.type === "receive") totalCost += valueInUSD;

        // Process sale transaction
        else if (tx.type === "send") totalIncome += valueInUSD;

        // Add transaction fees
        fees += tx.fee || 0;
    }

    // Calculate final profit/loss
    const gainOrLoss = totalIncome - totalCost - fees;

    return {
        Gain: +totalIncome.toFixed(2), 
        Loss: +totalCost.toFixed(2), 
        Fees: +fees.toFixed(2),
        Sum: +gainOrLoss.toFixed(2)
    };
}

module.exports = generateProfitAndLossReport;