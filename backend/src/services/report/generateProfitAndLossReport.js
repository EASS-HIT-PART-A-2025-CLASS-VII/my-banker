const { getHistoricalPrice, formatDate } = require('../../externals/abstractLayersForAPI/getCoinPriceByDate');

async function generateProfitAndLossReport(walletInfo) {
    let totalIncome = 0; 
    let totalCost = 0;  
    let fees = 0;

    for (const tx of walletInfo.transactions) {
        const dateStr = formatDate(tx.timestamp);
        const price = await getHistoricalPrice("bitcoin", dateStr);
        const valueInUSD = price * tx.amount;

        if (tx.type === "receive") totalCost += valueInUSD;

        else if (tx.type === "send") totalIncome += valueInUSD;

        fees += tx.fee || 0;
    }

    const gainOrLoss = totalIncome - totalCost - fees;

    return {
        Gain: +totalIncome.toFixed(2), 
        Loss: +totalCost.toFixed(2), 
        Fees: +fees.toFixed(2),
        Sum: +gainOrLoss.toFixed(2)
    };
}

module.exports = generateProfitAndLossReport;