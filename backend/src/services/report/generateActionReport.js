/**
 * @function generateActionReport
 * @description Summarizes transaction activity and calculates trading metrics
 */
function generateActionReport(walletInfo) {
    let totalActions = walletInfo.transactions.length;

    let tradingVolume = 0;
    let totalCommission = 0;

    // Calculate totals from transactions
    walletInfo.transactions.forEach(tx => {
        tradingVolume += tx.amount;
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