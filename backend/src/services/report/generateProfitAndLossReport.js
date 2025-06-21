async function generateProfitAndLossReport(walletInfo) {
    const tokensMap = new Map();

    walletInfo.transactions.forEach(tx => {
        const symbol = tx.symbol || 'UNKNOWN';

        if (!tokensMap.has(symbol)) {
            tokensMap.set(symbol, {
                totalBuyAmount: 0,
                totalSellAmount: 0,
                totalFees: 0,
                currentHoldings: 0,
                firstDate: null,
                lastDate: null
            });
        }

        const tokenStats = tokensMap.get(symbol);
        const timestamp = new Date(tx.timestamp);

        if (!tokenStats.firstDate || timestamp < new Date(tokenStats.firstDate)) {
            tokenStats.firstDate = tx.timestamp;
        }

        if (!tokenStats.lastDate || timestamp > new Date(tokenStats.lastDate)) {
            tokenStats.lastDate = tx.timestamp;
        }

        if (tx.type === "receive") {
            tokenStats.totalBuyAmount += tx.amount;
        } else if (tx.type === "send") {
            tokenStats.totalSellAmount += tx.amount;
        }

        tokenStats.totalFees += tx.fee || 0;
    });

    const report = {};
    for (let [symbol, stats] of tokensMap.entries()) {
        const netProfit = stats.totalSellAmount - stats.totalBuyAmount;
        const returnPercent = stats.totalBuyAmount > 0
            ? (netProfit / stats.totalBuyAmount) * 100
            : 0;

        report[symbol] = {
            gains: +stats.totalSellAmount.toFixed(8),
            losses: +(Math.abs(netProfit) + stats.totalFees).toFixed(8),
            fees: +stats.totalFees.toFixed(8),
            startDate: stats.firstDate,
            endDate: stats.lastDate,
            returnPercent: +Math.abs(returnPercent.toFixed(2)) + ' %'
        };
    }

    return report;
}

module.exports = generateProfitAndLossReport;
