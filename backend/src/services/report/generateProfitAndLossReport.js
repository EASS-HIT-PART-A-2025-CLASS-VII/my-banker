const { getHistoricalPrice, formatDate } = require('../../externals/abstractLayersForAPI/getCoinPriceByDate');

async function generateProfitAndLossReport(walletInfo) {
    let totalBuyAmount = 0;
    let totalSellAmount = 0;
    let totalFees = 0;
    let currentHoldings = 0;
    
    const sortedTransactions = [...walletInfo.transactions].sort((a, b) => 
        new Date(a.timestamp) - new Date(b.timestamp)
    );

    const startDate = formatDate(sortedTransactions[0].timestamp);
    const endDate = formatDate(sortedTransactions[sortedTransactions.length - 1].timestamp);

    let startPrice = 0;
    let endPrice = 0;

     try {
        startPrice = await getHistoricalPrice(walletInfo.coin, startDate);
    } catch (error) {
        console.error('Failed to get start price:', error);
    }

    try {
        endPrice = await getHistoricalPrice(walletInfo.coin, endDate);
    } catch (error) {
        console.error('Failed to get end price:', error);
    }

    walletInfo.transactions.forEach(tx => {
        if (tx.type === "receive") {
            totalBuyAmount += tx.amount;
            currentHoldings += tx.amount;
        } else if (tx.type === "send") {
            totalSellAmount += tx.amount;
            currentHoldings -= tx.amount;
        }
        totalFees += tx.fee || 0;
    });

    const totalRealizedLoss = Math.abs(totalSellAmount - totalBuyAmount - totalFees);
    const marketChangePercent = ((endPrice - startPrice) / startPrice) * 100;
    const portfolioReturnPercent = (totalSellAmount / totalBuyAmount) * 100 - 100;
    const performanceVsMarket = portfolioReturnPercent - marketChangePercent;

    return {
        Gains: +totalSellAmount.toFixed(8),
        Loss: +totalRealizedLoss.toFixed(8),
        Fees: +totalFees.toFixed(8),
        startDate,
        endDate,
        startPrice_usd: +startPrice.toFixed(2),
        endPrice_usd: +endPrice.toFixed(2),
        marketChangePercent: +marketChangePercent.toFixed(2),
        portfolioReturnPercent: +portfolioReturnPercent.toFixed(2),
        performanceVsMarket: +performanceVsMarket.toFixed(2)
    };
}

module.exports = generateProfitAndLossReport;