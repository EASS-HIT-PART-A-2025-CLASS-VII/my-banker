const express = require('express');
const router = express.Router();

const getWalletTransactions = (walletAddress) => {
  return {
    "wallet": [
      {
        "coin": "Bitcoin",
        "balance": 1.2345,
        "transactions": [
          {
            "txid": "e3c1b6a7f5d4...",
            "timestamp": "2024-05-01T12:34:56Z",
            "type": "receive",
            "amount": 0.5,
            "from": "1A2b3C4d5E6f...",
            "to": "1XyZ9w8V7u6T...",
            "fee": 0.0001,
            "status": "confirmed"
          },
          {
            "txid": "b7a4d3c2e1f0...",
            "timestamp": "2024-04-28T09:21:11Z",
            "type": "send",
            "amount": 0.2,
            "from": "1XyZ9w8V7u6T...",
            "to": "1QwErTyUiOpL...",
            "fee": 0.00008,
            "status": "confirmed"
          }
        ]
      },
      {
        "coin": "Ethereum",
        "balance": 10.5678,
        "transactions": [
          {
            "txid": "0xabc123def456...",
            "timestamp": "2024-05-03T15:22:10Z",
            "type": "receive",
            "amount": 3.0,
            "from": "0x1a2b3c4d5e6f...",
            "to": "0x7f8e9d0c1b2a...",
            "fee": 0.0021,
            "status": "confirmed"
          },
          {
            "txid": "0xdef789abc012...",
            "timestamp": "2024-04-30T08:10:45Z",
            "type": "send",
            "amount": 1.25,
            "from": "0x7f8e9d0c1b2a...",
            "to": "0x4e5d6c7b8a9f...",
            "fee": 0.0018,
            "status": "confirmed"
          },
          {
            "txid": "0x987zyx654wvu...",
            "timestamp": "2024-04-25T19:05:33Z",
            "type": "receive",
            "amount": 2.5,
            "from": "0x3b2a1c4d5e6f...",
            "to": "0x7f8e9d0c1b2a...",
            "fee": 0.0020,
            "status": "confirmed"
          }
        ]
      },
      {
        "coin": "Solana",
        "balance": 150.75,
        "transactions": [
          {
            "txid": "5G7h8J9k0L1m...",
            "timestamp": "2024-05-02T11:47:29Z",
            "type": "receive",
            "amount": 50.0,
            "from": "9x8y7z6w5v4u...",
            "to": "3q2w1e4r5t6y...",
            "fee": 0.00005,
            "status": "confirmed"
          },
          {
            "txid": "2B3c4D5e6F7g...",
            "timestamp": "2024-04-29T14:15:00Z",
            "type": "send",
            "amount": 20.5,
            "from": "3q2w1e4r5t6y...",
            "to": "7u8i9o0p1a2s...",
            "fee": 0.00004,
            "status": "confirmed"
          },
          {
            "txid": "8N9m0B1v2C3x...",
            "timestamp": "2024-04-27T17:30:10Z",
            "type": "receive",
            "amount": 30.25,
            "from": "6t5r4e3w2q1z...",
            "to": "3q2w1e4r5t6y...",
            "fee": 0.00003,
            "status": "confirmed"
          }
        ]
      }
    ]
  };
};

router.get('/:walletAddress', async (req, res) => {
  try {
    const walletAddress = req.params.walletAddress;
    const transactions = getWalletTransactions(walletAddress);
    
    res.status(200).json(transactions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred while fetching the wallet transactions." });
  }
});

module.exports = router;
