// services/manualReports.js

/**
 * Calculate profit and loss based on transaction data.
 * @param {Array} transactions - Array of transaction objects.
 * @returns {Object} An object containing total received, total sent, and profit or loss.
 */
function generateProfitAndLossReport(transactions) {
  let totalReceived = 0;
  let totalSent = 0;

  // Iterate over each transaction to calculate totals
  transactions.forEach((tx) => {
    // Check for native transfers in the transaction
    if (tx.native_transfers && tx.native_transfers.length > 0) {
      tx.native_transfers.forEach((nt) => {
        const value = Number(nt.value || 0);
        // Add to total received if the direction is incoming
        if (nt.direction === 'incoming') {
          totalReceived += value;
        // Add to total sent if the direction is outgoing
        } else if (nt.direction === 'outgoing') {
          totalSent += value;
        }
      });
    }
  });

  // Return the calculated profit or loss
  return {
    total_received: totalReceived,
    total_sent: totalSent,
    profit_or_loss: totalReceived - totalSent,
  };
}

/**
 * Aggregate wallet balances based on the last state of transactions.
 * @param {Array} transactions - Array of transaction objects.
 * @returns {Object} An object containing aggregated balances for tokens, native assets, and NFTs.
 */
function getWalletBalances(transactions) {
  const balances = {};

  // Iterate over each transaction to calculate balances
  transactions.forEach((tx) => {
    // Handle ERC-20 token transfers
    if (tx.erc20_transfer) {
      tx.erc20_transfer.forEach((token) => {
        const symbol = token.token_symbol || 'UNKNOWN';
        const value = Number(token.value || 0);
        balances[symbol] = (balances[symbol] || 0) + value;
      });
    }

    // Handle native token transfers (e.g., ETH)
    if (tx.native_transfers) {
      tx.native_transfers.forEach((nt) => {
        const symbol = nt.token_symbol || 'ETH';
        const value = Number(nt.value || 0);
        // Add to balance if the direction is incoming
        if (nt.direction === 'incoming') {
          balances[symbol] = (balances[symbol] || 0) + value;
        // Subtract from balance if the direction is outgoing
        } else {
          balances[symbol] = (balances[symbol] || 0) - value;
        }
      });
    }

    // Handle NFT transfers
    if (tx.nft_transfers) {
      tx.nft_transfers.forEach((nft) => {
        const type = nft.contract_type || 'UNKNOWN';
        const key = `NFT_${type}`;
        const amount = Number(nft.amount || 1); // Default to 1 if not specified
        balances[key] = (balances[key] || 0) + amount;
      });
    }
  });

  // Return the aggregated balances
  return balances;
}

/**
 * Summarize transaction activity, including total transactions, trading volume, and trading fees.
 * @param {Array} transactions - Array of transaction objects.
 * @returns {Object} An object containing transaction summary details.
 */
function summarizeTransactions(transactions) {
  let totalTransactions = 0;
  let tradingVolume = 0;
  let tradingFees = 0;

  // Iterate over each transaction to calculate summary details
  transactions.forEach((tx) => {
    totalTransactions += 1;

    // Add to trading volume if the transaction has a value
    if (tx.value) {
      tradingVolume += Number(tx.value);
    }

    // Calculate trading fees if gas and gas price are available
    if (tx.gas && tx.gas_price) {
      tradingFees += Number(tx.gas) * Number(tx.gas_price);
    }
  });

  // Return the summarized transaction details
  return {
    calculation_method: 'FIFO',
    total_transactions: totalTransactions,
    trading_volume: tradingVolume,
    trading_fees: tradingFees,
  };
}

/**
 * Collect all transactions into a flat list.
 * @param {Array} transactions - Array of transaction objects.
 * @returns {Array} A flat list of all transactions.
 */
function getAllTransactions(transactions) {
  return transactions;
}

// Export the functions for use in other modules
module.exports = {
  generateProfitAndLossReport,
  getWalletBalances,
  summarizeTransactions,
  getAllTransactions,
};