const fetchTokensAndNativeWalletData = require('./fetchTokensAndNativeWalletData');

async function fetchWalletData(walletAddress, chain) {
  switch (chain) {
    case 'ethereum':
      return await fetchTokensAndNativeWalletData(walletAddress, '0x1', 'ETH');
    case 'polygon':
      return await fetchTokensAndNativeWalletData(walletAddress, '0x89', 'MATIC');
    case 'avalanche':
      return await fetchTokensAndNativeWalletData(walletAddress, '0xa86a', 'AVAX');
    case 'arbitrum':
      return await fetchTokensAndNativeWalletData(walletAddress, '0xa4b1', 'ARB');
    case 'optimism':
      return await fetchTokensAndNativeWalletData(walletAddress, '0x10', 'OP');
    case 'fantom':
      return await fetchTokensAndNativeWalletData(walletAddress, '0xfa', 'FTM'); 
    case 'binance':
      return await fetchTokensAndNativeWalletData(walletAddress, '0x38', 'BNB');
    case 'sepolia':
      return await fetchTokensAndNativeWalletData(walletAddress, '0xaa36a7', 'ETH');
    default:
      throw new Error('Unsupported chain');
  }
}

module.exports = fetchWalletData;