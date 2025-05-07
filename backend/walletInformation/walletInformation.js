const extractEthereumInformation = require('./walletInformationModules/ethereumInformationExtractionModule');
const extractBitcoinInformation = require('./walletInformationModules/bitcoinInformationExtractionModule');

/**
 * @module walletInformation
 * @description Provides functions to extract coins information.
 */
module.exports = {extractEthereumInformation, extractBitcoinInformation};