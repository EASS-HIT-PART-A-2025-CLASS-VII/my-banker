const fetchWalletData = require('../../externals/abstractLayersForAPI/fetchWalletData/fetchWalletData');
const generateActionReport = require('./generateActionReport');
const generateProfitAndLossReport = require('./generateProfitAndLossReport');
const generateLlmAnalysis = require('./generateLlmAnalysis');

/**
 * @function generateReport
 * @description Creates comprehensive wallet analysis report
 */
async function generateReport(walletAddress, chain) {
    // Fetch wallet transaction data
    const walletData = await fetchWalletData(walletAddress, chain);
    
    // Validate wallet data
    if (!walletData) throw new Error('Failed to fetch wallet data');

    // Generate report components
    const actions = await generateActionReport(walletData);
    const pnl = await generateProfitAndLossReport(walletData);
    const llmAnalysis = await generateLlmAnalysis(walletData);

    return {
        actions: actions,
        profitAndLoss: pnl,
        insights: llmAnalysis,
    };
}

module.exports = generateReport;