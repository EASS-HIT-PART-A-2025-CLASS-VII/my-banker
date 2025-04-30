const express = require('express');
const router = express.Router();

/**
 * @route POST /manual-reports
 * @description Generates a manual report based on the provided transaction data.
 * @param {Object} req - The request object.
 * @param {Array} req.body.result - Array of transaction entries.
 * @returns {Object} res - The response object containing balances and transactions.
 * @throws {Error} 400 - If the input data format is invalid.
 * @throws {Error} 500 - If an internal server error occurs.
 */
router.post('/', (req, res) => {
  try {
    const { result } = req.body;

    // Validate that "result" is an array
    if (!Array.isArray(result)) {
      return res.status(400).json({ error: 'Invalid data format: "result" should be an array.' });
    }

    const balances = {}; // Object to track token balances
    const transactions = []; // Array to store transaction details

    // Iterate over each entry in the result array
    result.forEach(entry => {
      // Handle ERC20 transfers
      if (entry.erc20_transfer && Array.isArray(entry.erc20_transfer)) {
        entry.erc20_transfer.forEach(tx => {
          const symbol = tx.token_symbol; // Token symbol (e.g., USDT, DAI)
          const amount = parseFloat(tx.value) / Math.pow(10, parseInt(tx.token_decimals)); // Calculate token amount
          const direction = entry.from_address === tx.from_address ? 'send' : 'receive'; // Determine transaction direction

          // Update token balance
          balances[symbol] = balances[symbol] || 0;
          balances[symbol] += direction === 'receive' ? amount : -amount;

          // Record transaction details
          transactions.push({
            hash: tx.transaction_hash,
            timestamp: tx.block_timestamp,
            token: symbol,
            amount,
            type: direction,
            from: tx.from_address,
            to: tx.to_address
          });
        });
      }

      // Handle native (ETH) transfers
      if (entry.native_transfers && Array.isArray(entry.native_transfers)) {
        entry.native_transfers.forEach(tx => {
          const symbol = tx.token_symbol || 'ETH'; // Default to ETH if no token symbol is provided
          const amount = parseFloat(tx.value_formatted); // Parse the formatted value
          const direction = tx.direction || 'send'; // Default to 'send' if direction is not provided

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
          const symbol = `NFT-${tx.token_address}`; // Use token address as part of the NFT identifier
          const amount = parseInt(tx.amount) || 1; // Default to 1 if no amount is provided
          const direction = entry.from_address === tx.from_address ? 'send' : 'receive'; // Determine transaction direction

          // Update NFT balance
          balances[symbol] = balances[symbol] || 0;
          balances[symbol] += direction === 'receive' ? amount : -amount;

          // Record transaction details
          transactions.push({
            hash: tx.transaction_hash,
            timestamp: tx.block_timestamp,
            token: symbol,
            amount,
            type: direction,
            from: tx.from_address,
            to: tx.to_address
          });
        });
      }
    });

    // Return the generated report
    return res.status(200).json({
      report: {
        balances,
        transactions
      }
    });
  } catch (err) {
    // Log the error and return a 500 response
    console.error('Error generating manual report:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});


module.exports = router;