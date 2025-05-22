const { Web3 } = require("web3");
const axios = require("axios");

/**
 * Fetch the Ethereum balance for a given address.
 * @async
 * @function getEthereumBalance
 * @param {string} address - The Ethereum wallet address.
 * @returns {number} The balance of the wallet in ETH.
 */
async function getEthereumBalance(address) {

  // Load Infura API key from environment variables
  const INFURA_API_KEY = process.env.INFURA_API_KEY;

  // Initialize a Web3 instance with an Infura provider
  const web3 = new Web3(`https://mainnet.infura.io/${INFURA_API_KEY}`);

  // Fetch the balance in Wei from the Ethereum blockchain
  const balanceInWei = await web3.eth.getBalance(address);

  // Convert the balance from Wei to Ether
  const balanceInEth = web3.utils.fromWei(balanceInWei, "ether");

  // Return the balance as a float
  return parseFloat(balanceInEth);
}

/**
 * Fetch the transaction history for a given Ethereum address.
 * @async
 * @function getEthereumTransactions
 * @param {string} address - The Ethereum wallet address.
 * @returns {Array} An array of transaction objects.
 */
async function getEthereumTransactions(address) {
  // Load Infura API key from environment variables
  const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;

  try {
    // Calculate UNIX timestamp for 1 year ago
    const oneYearAgoTimestamp = Math.floor(Date.now() / 1000) - (365 * 24 * 60 * 60);

    // Etherscan API endpoint
    const apiUrl = `https://api.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=asc&apikey=${ETHERSCAN_API_KEY}`;

    // Make the GET request
    const response = await axios.get(apiUrl);

    // Validate response
    if (response.data.status !== "1" || !response.data.result) {
      return [];
    }

    // Filter and format transactions from the last year
    const transactions = response.data.result
      .filter(tx => Number(tx.timeStamp) >= oneYearAgoTimestamp)
      .map(tx => ({
        txid: tx.hash,
        timestamp: new Date(tx.timeStamp * 1000).toISOString(),
        type: tx.to?.toLowerCase() === address.toLowerCase() ? "receive" : "send",
        amount: parseFloat(web3.utils.fromWei(tx.value || "0", "ether")),
        from: tx.from,
        to: tx.to,
        fee: (tx.gasUsed && tx.gasPrice)
          ? parseFloat(web3.utils.fromWei((BigInt(tx.gasUsed) * BigInt(tx.gasPrice)).toString(), "ether"))
          : 0,
        status: tx.isError === "0" ? "confirmed" : "failed"
      }));

    return transactions;
  } catch (error) {
    // Log the error and return an empty array
    return [];
  }
}

/**
 * Extract Ethereum wallet information.
 * @async
 * @function extractEthereumInformation
 * @param {string} address - The Ethereum wallet address.
 * @returns {Object|null} A JSON object containing the coin, balance, and transactions, or null if an error occurs.
 */
async function fetchEthereumWalletData(address) {
  try {
    // Fetch the Ethereum balance for the given address
    const balance = await getEthereumBalance(address);

    // Fetch the transaction history for the given address
    const transactions = await getEthereumTransactions(address);

    // Construct the result object with balance and transactions
    const result = {
      coin: "ETH", // The cryptocurrency type
      balance: balance, // The wallet balance in Ether
      transactions: transactions, // The transaction history
    };

    // Return the result object
    return result;
  } catch (error) {
    // Log any errors that occur during the extraction process
    console.error("Error getting Ethereum info:", error);

    // Return null to indicate failure
    return null;
  }
}

module.exports = fetchEthereumWalletData;