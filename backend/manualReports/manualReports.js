/**
 * Generates a manual report based on transaction data.
 * @param {Array} result - Array of transaction entries.
 * @returns {Object} An object containing balances and transaction details.
 * @throws {Error} If input format is invalid or processing fails.
 */
function generateManualReport(result) {
  // Validate that the input is an array
  if (!Array.isArray(result)) {
    throw new Error('Invalid data format: "result" should be an array.');
  }

   // Object to track token balances
  const balances = {};
  // Array to store transaction details
  const transactions = []; 

  // Iterate over each entry in the result array
  result.forEach(entry => {
    // Handle ERC20 transfers
    if (entry.erc20_transfer && Array.isArray(entry.erc20_transfer)) {
      entry.erc20_transfer.forEach(tx => {
        // Token symbol (e.g., USDT, DAI)
        const symbol = tx.token_symbol; 
        const amount = parseFloat(tx.value) / Math.pow(10, parseInt(tx.token_decimals)); // Calculate token amount
        const direction = entry.from_address === tx.from_address ? 'send' : 'receive'; // Determine transaction direction

        // Update token balance
        balances[symbol] = balances[symbol] || 0;
        balances[symbol] += direction === 'receive' ? amount : -amount;

        // Record transaction details
        transactions.push({
          hash: tx.transaction_hash, 
          timestamp: tx.block_timestamp,
          token: symbol, // Token symbol
          amount, 
          type: direction, // Transaction type (send/receive)
          from: tx.from_address, // Sender address
          to: tx.to_address // Receiver address
        });
      });
    }

    // Handle native transfers (e.g., ETH)
    if (entry.native_transfers && Array.isArray(entry.native_transfers)) {
      entry.native_transfers.forEach(tx => {
        // Default to ETH if no token symbol is provided
        const symbol = tx.token_symbol || 'ETH'; 
        // Parse the formatted value
        const amount = parseFloat(tx.value_formatted); 
        // Default to 'send' if direction is not provided
        const direction = tx.direction || 'send'; 

        // Update native token balance
        balances[symbol] = balances[symbol] || 0;
        balances[symbol] += direction === 'incoming' ? amount : -amount;

        // Record transaction details
        transactions.push({
          hash: entry.hash, 
          timestamp: entry.block_timestamp, 
          token: symbol, 
          amount, 
          type: direction === 'incoming' ? 'receive' : 'send', 
          from: tx.from_address, 
          to: tx.to_address 
        });
      });
    }

    // Handle NFT transfers
    if (entry.nft_transfers && Array.isArray(entry.nft_transfers)) {
      entry.nft_transfers.forEach(tx => {
        // Generate a unique symbol for the NFT using its token address
        const symbol = `NFT-${tx.token_address}`; 
        // Default to 1 if no amount is provided
        const amount = parseInt(tx.amount) || 1; 
        // Determine transaction direction
        const direction = entry.from_address === tx.from_address ? 'send' : 'receive'; 

        // Update NFT balance
        balances[symbol] = balances[symbol] || 0;
        balances[symbol] += direction === 'receive' ? amount : -amount;

        // Record transaction details
        transactions.push({
          hash: tx.transaction_hash, // Transaction hash
          timestamp: tx.block_timestamp, // Timestamp of the transaction
          token: symbol, // NFT identifier
          amount,
          type: direction, 
          from: tx.from_address, 
          to: tx.to_address 
        });
      });
    }
  });

  // Return the generated report containing balances and transactions
  return {
    balances, // Final token balances
    transactions // List of all transactions
  };
}

module.exports = {
  generateManualReport
};