const { Web3 } = require("web3");
const axios = require("axios");

const INFURA_API_KEY = process.env.INFURA_API_KEY;
const web3 = new Web3(`https://mainnet.infura.io/${INFURA_API_KEY}`);

/**
 * Fetches the current Ethereum balance for a wallet
 * Assumes address is a valid Ethereum address string starting with 0x
 */
async function getBalance(address) {
    try {
        const balanceInWei = await web3.eth.getBalance(address);
        const balanceInEth = web3.utils.fromWei(balanceInWei, "ether");

        return parseFloat(balanceInEth);
    } catch (error) {
        throw new Error("Failed to get balance");
    }
}

/**
 * Retrieves one year of transaction history for an Ethereum wallet
 * Assumes address is a valid Ethereum address string and ETHERSCAN_API_KEY is set
 */
async function getTransactions(address) {
    const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;

    try {
        const oneYearAgoTimestamp = Math.floor(Date.now() / 1000) - (365 * 24 * 60 * 60);
        const apiUrl = `https://api.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=asc&apikey=${ETHERSCAN_API_KEY}`;
        const response = await axios.get(apiUrl);

        if (response.data.status !== "1" || !response.data.result) return [];

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
        throw new Error("Failed to fetch Ethereum transactions");
    }
}

/**
 * Extracts complete wallet information including balance and transaction history
 * Assumes address is a valid Ethereum address string and required API keys are configured
 */
async function fetchEthereumWalletData(address) {
    try {
        const [balance, transactions] = await Promise.all([
            getBalance(address),
            getTransactions(address)
        ]);
        const result = {
            coin: "ETH",
            balance: balance,
            transactions: transactions
        };

        return result;
    } catch (error) {
        throw new Error("Failed to fetch Ethereum wallet data: " + error.message);
    }
}

module.exports = fetchEthereumWalletData;