const fetchEthereumWalletData = require('./fetchEthereumWalletData');
const fetchBitcoinWalletData = require('./fetchBitcoinWalletData');

/**
 * @function walletInformation
 * @description Provides functions to extract coins information.
 */
async function fetchWalletData(walletAddress, coinType) {
  switch (coinType) {
    case 'ethereum':
      return await fetchEthereumWalletData(walletAddress);
    case 'bitcoin':
      return await fetchBitcoinWalletData(walletAddress);
    default:
      throw new Error('Unsupported chain');
  }
}

module.exports = fetchWalletData;