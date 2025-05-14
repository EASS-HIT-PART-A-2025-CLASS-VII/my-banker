const { Web3 } = require("web3");
const axios = require("axios");

// Initialize a Web3 instance with an Infura provider
const web3 = new Web3("https://mainnet.infura.io/v3/YOUR_INFURA_API_KEY");

/**
 * Fetch the Ethereum balance for a given address.
 * @async
 * @function getEthereumBalance
 * @param {string} address - The Ethereum wallet address.
 * @returns {number} The balance of the wallet in ETH.
 */
async function getEthereumBalance(address) {
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
  try {
    // Construct the API URL to fetch transactions from Etherscan
    const apiUrl = `https://api.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=asc&apikey=YOUR_ETHERSCAN_API_KEY`;

    // Send a GET request to the Etherscan API
    const response = await axios.get(apiUrl);

    // Extract the transactions from the API response
    const transactions = response.data.result;

    // Map the transactions to the desired format
    return transactions.map(tx => ({
      txid: tx.hash, // Transaction hash
      timestamp: new Date(tx.timeStamp * 1000).toISOString(), // Convert timestamp to ISO format
      type: tx.to.toLowerCase() === address.toLowerCase() ? "receive" : "send", // Determine transaction type
      amount: web3.utils.fromWei(tx.value, "ether"), // Convert value from Wei to Ether
      from: tx.from, // Sender address
      to: tx.to, // Receiver address
      fee: tx.gasUsed && tx.gasPrice
        ? web3.utils.fromWei((tx.gasUsed * tx.gasPrice).toString(), "ether") // Calculate transaction fee
        : "0", // Default fee to "0" if gasUsed or gasPrice is missing
      status: tx.isError === "0" ? "confirmed" : "failed", // Determine transaction status
    }));
  } catch (error) {
    // Return an empty array if an error occurs
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
async function extractEthereumInformation(address) {
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

module.exports = extractEthereumInformation;