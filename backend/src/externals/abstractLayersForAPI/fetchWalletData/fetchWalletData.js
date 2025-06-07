const fetchBitcoinWalletData = require('./fetchBitcoinWalletData');
const fetchTokensWalletData = require('./fetchTokensWalletData');

async function fetchWalletData(walletAddress, coinType) {
  switch (coinType) {
    case 'ethereum':
      return await fetchTokensWalletData(walletAddress, '0x1');
    case 'polygon':
      return await fetchTokensWalletData(walletAddress, '0x89');
    case 'avalanche':
      return await fetchTokensWalletData(walletAddress, '0xa86a');
    case 'arbitrum':
      return await fetchTokensWalletData(walletAddress, '0xa4b1');
    case 'optimism':
      return await fetchTokensWalletData(walletAddress, '0x10');
    case 'fantom':
      return await fetchTokensWalletData(walletAddress, '0xfa'); 
    case 'binance':
      return await fetchTokensWalletData(walletAddress, '0x38');
    case 'sepolia':
      return await fetchTokensWalletData(walletAddress, '0xaa36a7');
    case 'bitcoin':
      return await fetchBitcoinWalletData(walletAddress);
    default:
      throw new Error('Unsupported chain');
  }
}

module.exports = fetchWalletData;