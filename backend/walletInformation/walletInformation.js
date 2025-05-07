/*const axios = require('axios');

// Configuration (replace with your API keys)
const ETHERSCAN_API_KEY = 'AB486YE7ED8U82X66GYU9KXEXKI9NXRTAZ';

async function fetchEthTransactions(address) {
  const url = `https://api.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=desc&apikey=${ETHERSCAN_API_KEY}`;
  const response = await axios.get(url);
  return response.data.result;
}

async function fetchEthBalance(address) {
  const url = `https://api.etherscan.io/api?module=account&action=balance&address=${address}&tag=latest&apikey=${ETHERSCAN_API_KEY}`;
  const response = await axios.get(url);
  return response.data.result;
}

function mapEthTransaction(tx, address) {
  return {
    txid: tx.hash,
    timestamp: new Date(parseInt(tx.timeStamp) * 1000).toISOString(),
    type: tx.from.toLowerCase() === address.toLowerCase() ? 'send' : 'receive',
    amount: parseFloat(tx.value) / 1e18,
    from: tx.from,
    to: tx.to,
    fee: (parseFloat(tx.gasPrice) * parseFloat(tx.gasUsed)) / 1e18,
    status: tx.isError === '0' ? 'confirmed' : 'failed'
  };
}

async function getWalletInfo(address) {
  const [transactions, balance] = await Promise.all([
    fetchEthTransactions(address),
    fetchEthBalance(address)
  ]);

  const mappedTransactions = transactions.map(tx => mapEthTransaction(tx, address));

  return {
    wallet: [
      {
        coin: 'Ethereum',
        balance: parseFloat(balance) / 1e18,
        transactions: mappedTransactions
      }
    ]
  };
}

module.exports = { getWalletInfo };
*/