function generateActionReport(walletInfo) {
    const tokensMap = new Map();

    walletInfo.transactions.forEach(tx => {
        const symbol = tx.symbol || 'UNKNOWN'; 

        if (!tokensMap.has(symbol)) {
            tokensMap.set(symbol, {
                totalActions: 0,
                tradingVolume: 0,
                buyActions: 0,
                sellActions: 0,
                tradeSizes: [],
                holdings: new Map(),
                holdingPeriods: [],
                firstTransactionDate: null,
                lastTransactionDate: null
            });
        }

        const tokenStats = tokensMap.get(symbol);

        const timestamp = new Date(tx.timestamp);
        tokenStats.totalActions++;
        tokenStats.tradingVolume += tx.amount;
        tokenStats.tradeSizes.push(tx.amount);

        if (!tokenStats.firstTransactionDate || timestamp < new Date(tokenStats.firstTransactionDate)) {
            tokenStats.firstTransactionDate = tx.timestamp;
        }

        if (!tokenStats.lastTransactionDate || timestamp > new Date(tokenStats.lastTransactionDate)) {
            tokenStats.lastTransactionDate = tx.timestamp;
        }

        if (tx.type === "receive") {
            tokenStats.buyActions++;
            tokenStats.holdings.set(tx.txid, timestamp);
        } else if (tx.type === "send") {
            tokenStats.sellActions++;
            for (let [buyTxId, buyDate] of tokenStats.holdings) {
                const holdingEnd = timestamp;
                const holdDays = (holdingEnd - buyDate) / (1000 * 60 * 60 * 24);
                tokenStats.holdingPeriods.push(holdDays);
                tokenStats.holdings.delete(buyTxId);
                break; 
            }
        }
    });

    const report = {};
    for (let [symbol, stats] of tokensMap.entries()) {
        const avgHold = stats.holdingPeriods.length > 0
            ? stats.holdingPeriods.reduce((a, b) => a + b, 0) / stats.holdingPeriods.length
            : 0;

        report[symbol] = {
            calculationMethod: "FIFO",
            totalActions: stats.totalActions,
            tradingVolume: +stats.tradingVolume.toFixed(8),
            buyActions: stats.buyActions,
            sellActions: stats.sellActions,
            firstTransactionDate: stats.firstTransactionDate,
            lastTransactionDate: stats.lastTransactionDate,
            avgHoldDurationDays: +avgHold.toFixed(2),
            longestHoldDays: +Math.max(...(stats.holdingPeriods.length ? stats.holdingPeriods : [0])).toFixed(2),
            shortestHoldDays: +Math.min(...(stats.holdingPeriods.length ? stats.holdingPeriods : [0])).toFixed(2),
            avgTradeSize: +(stats.totalActions > 0 ? (stats.tradingVolume / stats.totalActions) : 0).toFixed(8),
            maxTradeSize: +Math.max(...(stats.tradeSizes.length ? stats.tradeSizes : [0])).toFixed(8),
            minTradeSize: +Math.min(...(stats.tradeSizes.length ? stats.tradeSizes : [0])).toFixed(8)
        };
    }

    return report;
}

module.exports = generateActionReport;
