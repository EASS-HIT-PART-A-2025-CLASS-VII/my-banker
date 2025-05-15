const fetchWalletData = require('../../externals/abstractLayersForAPI/fetchWalletData/fetchWalletData');
const generateActionReport = require('./generateActionReport');
const generateProfitAndLossReport = require('./generateProfitAndLossReport');
const generateLlmAnalysis = require('./generateLlmAnalysis');


async function generateReport(walletAddress, chain) {
    const walletData = await fetchWalletData(walletAddress, chain);
    
    if (!walletData)  throw new Error('Failed to fetch wallet data');

    const actions = await generateActionReport(walletData);
    const pnl = await generateProfitAndLossReport(walletData);
    const llmAnalysis = await generateLlmAnalysis(walletData);
    
    const report = {
        actions: actions,
        profitAndLoss: pnl,
        insights: llmAnalysis,
    };
  return report;
}

module.exports = generateReport;