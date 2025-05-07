const axios = require('axios');

/**
 * Fetch the Bitcoin balance for a given address.
 * @async
 * @function getBitcoinBalance
 * @param {string} address - The Bitcoin wallet address.
 * @returns {number} The balance of the wallet in BTC.
 */
async function getBitcoinBalance(address) {
    // Construct the API URL to fetch the balance
    const apiUrl = `https://blockchain.info/q/addressbalance/${address}`;

    try {
        // Send a GET request to the API
        const response = await axios.get(apiUrl);

        // Convert the balance from satoshis to BTC
        const balanceInSatoshis = parseInt(response.data);
        const balanceInBTC = balanceInSatoshis / 100000000;

        // Return the balance in BTC
        return balanceInBTC;
    } catch (error) {
        // Throw an error to indicate failure
        throw new Error('Failed to fetch Bitcoin balance');
    }
}

/**
 * Fetch the transaction history for a given Bitcoin address.
 * @async
 * @function getTransactions
 * @param {string} address - The Bitcoin wallet address.
 * @returns {Array} An array of transaction objects.
 */
async function getTransactions(address) {
    // Construct the API URL to fetch transactions
    const apiUrl = `https://blockchain.info/rawaddr/${address}`;

    try {
        // Send a GET request to the API
        const response = await axios.get(apiUrl);

        // Check if the response contains transaction data
        if (response.data && response.data.txs) {
            // Map the transactions to the desired format
            const transactions = response.data.txs.map(tx => ({
                txid: tx.hash,
                time: tx.time,
                inputs: tx.inputs,
                outputs: tx.out,
            }));

            // Return the mapped transactions
            return transactions;
        } 
        else {
            // Return an empty array
            return [];
        }
    } catch (error) {
        // Throw an error to indicate failure
        throw new Error('Failed to fetch Bitcoin transactions');
    }
}

/**
 * Extract Bitcoin wallet information.
 * @async
 * @function extractBitcoinInformation
 * @param {string} address - The Bitcoin wallet address.
 * @returns {Object} A JSON object containing the coin, balance, and transactions.
 */
async function extractBitcoinInformation(address) {
    try {
        // Fetch transactions and balance for the given Bitcoin address
        const [transactions, balance] = await Promise.all([
            getTransactions(address), // Fetch Bitcoin transactions
            getBitcoinBalance(address), // Fetch Bitcoin balance
        ]);

        // Map the transactions to the desired format
        const mappedTransactions = transactions.map(tx => ({
            txid: tx.txid,
            timestamp: new Date(tx.time * 1000).toISOString(),
            type: tx.inputs.some(input => input.prev_out.addr === address) ? 'send' : 'receive',
            amount: tx.outputs.reduce((sum, output) => sum + (output.addr === address ? output.value : 0), 0) / 1e8,
            from: tx.inputs.map(input => input.prev_out.addr).join(', '),
            to: tx.outputs.map(output => output.addr).join(', '),
            fee: tx.fee / 1e8,
            status: 'confirmed', // Assuming all transactions are confirmed
        }));

        // Return the wallet information in the desired format
        return {
            coin: 'BTC',
            balance: parseFloat(balance), // Convert balance to a float
            transactions: mappedTransactions,
        };
    } catch (error) {
        // Throw an error to indicate failure
        throw new Error('Failed to extract Bitcoin wallet information');
    }
}

module.exports = extractBitcoinInformation;