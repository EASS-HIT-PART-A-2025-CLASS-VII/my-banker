const extractEthereumInformation = require('./walletInformationModules/ethereumInformationExtractionModule');
const extractBitcoinInformation = require('./walletInformationModules/bitcoinInformationExtractionModule');

/**
 * @module walletInformation
 * @description Provides functions to extract coins information.
 */

async function getWalletInformation(walletAddress, coinType) {
  switch (coinType) {
    case 'ethereum':
      return await extractEthereumInformation(walletAddress);
    case 'bitcoin':
      return await extractBitcoinInformation(walletAddress);
    default:
      throw new Error('Invalid coin type. Please use "ethereum" or "bitcoin".');
  }
    
}
module.exports = getWalletInformation;