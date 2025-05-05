const express = require('express');
const router = express.Router();
const getWalletInfo = require('./llmReport');

// POST /api/
router.post('/', async (req, res) => {
  const walletAddress = req.params.publicKey;
  

  try {
    const walletInfo = getWalletInfo(walletAddress);
    res.status(200).json(walletInfo);
  } catch (error) {
    res.status(500).json({ message: "An error occurred while fetching the wallet transactions." });
  }
});

module.exports = router;

