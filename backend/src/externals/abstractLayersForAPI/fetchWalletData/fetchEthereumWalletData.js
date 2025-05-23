const { Web3 } = require("web3");
const axios = require("axios");

const INFURA_API_KEY = process.env.INFURA_API_KEY;
const web3 = new Web3(`https://mainnet.infura.io/${INFURA_API_KEY}`);

/**
 * @function getEthereumBalance
 * @description Fetch the Ethereum balance for a given address
 */
async function getBalance(address) {
    try {
        // Get balance in Wei
        const balanceInWei = await web3.eth.getBalance(address);

        // Convert Wei to Ether
        const balanceInEth = web3.utils.fromWei(balanceInWei, "ether");

        return parseFloat(balanceInEth);
    } catch (error) {
        // Throw an error if balance fetch fails
        throw new Error("Failed to get balance");
    }
}

/**
 * @function getTransactions
 * @description Fetch the transaction history for a given Ethereum address
 */
async function getTransactions(address) {
    const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;

    try {
        // Calculate one year ago timestamp
        const oneYearAgoTimestamp = Math.floor(Date.now() / 1000) - (365 * 24 * 60 * 60);

        const apiUrl = `https://api.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=asc&apikey=${ETHERSCAN_API_KEY}`;

        const response = await axios.get(apiUrl);

        // Check response validity
        if (response.data.status !== "1" || !response.data.result) return [];

        // Process transactions
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
        // Throw an error if transaction fetch fails
        throw new Error("Failed to fetch Ethereum transactions");
    }
}

/**
 * @function fetchEthereumWalletData
 * @description Extract Ethereum wallet information including balance and transactions
 */
async function fetchEthereumWalletData(address) {
    try {
        // Fetch wallet data in parallel
        const [balance, transactions] = await Promise.all([
            getBalance(address),
            getTransactions(address)
        ]);

        // Build response object
        const result = {
            coin: "ETH",
            balance: balance,
            transactions: transactions
        };

        return result;
    } catch (error) {
        // Throw an error if wallet data fetch fails
        throw new Error("Failed to fetch Ethereum wallet data: " + error.message);
    }
}

module.exports = fetchEthereumWalletData;