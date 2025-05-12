const express = require('express');
const router = express.Router();
const { extractEthereumInformation, extractBitcoinInformation } = require('./walletInformation');


/**
 * @route POST /
 * @description Fetch Ethereum wallet information for a given public key.
 * @param {express.Request} req - The request object containing the public key in the parameters.
 * @param {express.Response} res - The response object to send the wallet information or an error message.
 * @returns {Promise<void>} Sends a JSON response with wallet information or an error message.
 */
router.post('/', async (req, res) => {
  const walletAddress = req.body.publicKey;
  
  try {
    const walletInfo = await extractBitcoinInformation(walletAddress);
    res.status(200).json(walletInfo);
  } catch (error) {
    res.status(500).json({ message: "An error occurred while fetching the wallet transactions." });
  }
});

module.exports = router;

