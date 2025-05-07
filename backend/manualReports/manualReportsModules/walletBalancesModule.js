/**
 * Aggregate wallet balances based on the last state of wallet data.
 * @param {Object} walletInfo - The wallet data object containing coins and their balances.
 * @param {Array} walletInfo.wallet - Array of coin objects, each containing coin name, balance, and transactions.
 * @returns {Object} A JSON object containing the balance for each coin.
 */
function generateWalletBalances(walletInfo) {
    // Initialize an object to store balances
    const balances = {};
  
    // Iterate over each coin in the wallet to extract its balance
    walletInfo.wallet.forEach(coinData => {
      balances[coinData.coin] = coinData.balance;
    });
  
    // Return the balances as a JSON object
    return balances;
}

module.exports = generateWalletBalances;