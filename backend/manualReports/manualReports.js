/**
 * Manual reports generator for wallet transactions and holdings
 */

/**
 * @typedef {Object} TokenBalance
 * @property {string} symbol - Token symbol (e.g., ETH, USDT)
 * @property {number} amount - Amount held

 * @typedef {Object} Transaction
 * @property {string} date - ISO date of transaction
 * @property {string} type - 'send' or 'receive'
 * @property {string} token - Token symbol
 * @property {number} amount - Amount transferred
 * @property {number} price - Price at transaction time (USD)
 */

/**
 * Generates a summary of token balances.
 * @param {TokenBalance[]} balances - Array of token balances
 * @returns {Object} Summary of current holdings
 */
function generateBalanceReport(balances) {
    const report = {};
    balances.forEach(token => {
      report[token.symbol] = token.amount;
    });
    return report;
  }
  
  /**
   * Generates a full transaction report.
   * @param {Transaction[]} transactions - Array of transactions
   * @returns {Transaction[]} Sorted list of transactions by date
   */
  function generateTransactionReport(transactions) {
    return transactions.sort((a, b) => new Date(a.date) - new Date(b.date));
  }
  
  /**
   * Generates a basic profit/loss report.
   * Assumes matching buy/sell transactions for each token.
   * @param {Transaction[]} transactions - Array of transactions
   * @returns {Object} Profit/loss per token
   */
  function generatePnLReport(transactions) {
    const pnl = {};
  
    transactions.forEach(tx => {
      const token = tx.token;
      const value = tx.amount * tx.price;
      if (!pnl[token]) pnl[token] = { received: 0, sent: 0 };
  
      if (tx.type === 'receive') {
        pnl[token].received += value;
      } else if (tx.type === 'send') {
        pnl[token].sent += value;
      }
    });
  
    const result = {};
    for (const token in pnl) {
      result[token] = pnl[token].received - pnl[token].sent;
    }
  
    return result;
  }
  
  /**
   * Calculates portfolio return percentage over time.
   * @param {Transaction[]} transactions - Array of transactions
   * @param {Object} currentPrices - Map of current prices { ETH: 3000, BTC: 40000, ... }
   * @returns {number} Portfolio return in percentage
   */
  function calculatePortfolioReturn(transactions, currentPrices) {
    const holdings = {};
    const invested = {};
  
    transactions.forEach(tx => {
      const token = tx.token;
      if (!holdings[token]) holdings[token] = 0;
      if (!invested[token]) invested[token] = 0;
  
      if (tx.type === 'receive') {
        holdings[token] += tx.amount;
        invested[token] += tx.amount * tx.price;
      } else if (tx.type === 'send') {
        holdings[token] -= tx.amount;
      }
    });
  
    let currentValue = 0;
    let totalInvested = 0;
  
    for (const token in holdings) {
      currentValue += holdings[token] * (currentPrices[token] || 0);
      totalInvested += invested[token];
    }
  
    if (totalInvested === 0) return 0;
  
    return ((currentValue - totalInvested) / totalInvested) * 100;
  }
  
  module.exports = {
    generateBalanceReport,
    generateTransactionReport,
    generatePnLReport,
    calculatePortfolioReturn
  };
  