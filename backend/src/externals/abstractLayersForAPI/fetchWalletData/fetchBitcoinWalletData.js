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

        return balanceInBTC;
    } catch (error) {
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
    // Calculate timestamp for 365 days ago (in seconds)
    const oneYearAgoTimestamp = Math.floor(Date.now() / 1000) - (365 * 24 * 60 * 60);
    
    // Construct the API URL to fetch transactions
    const apiUrl = `https://blockchain.info/rawaddr/${address}`;

    try {
        // Send a GET request to the API
        const response = await axios.get(apiUrl);

        // Check if the response contains transaction data
        if (response.data && response.data.txs) {
            // Filter transactions from last 365 days and map results
            const transactions = response.data.txs
                .filter(tx => tx.time >= oneYearAgoTimestamp)
                .map(tx => ({
                    txid: tx.hash,
                    time: tx.time,
                    inputs: tx.inputs,
                    outputs: tx.out,
                }));

            return transactions;
        } 
        else return [];
    } catch (error) {
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
async function fetchBitcoinWalletData(address) {
    try {
        // Fetch transactions and balance for the given Bitcoin address
        const [transactions, balance] = await Promise.all([
            getTransactions(address), // Fetch Bitcoin transactions
            getBitcoinBalance(address), // Fetch Bitcoin balance
        ]);

        // Map the transactions 
        const mappedTransactions = transactions.map(tx => {
            // Find if address is in inputs
            const sentFrom = tx.inputs.some(
                input => input.prev_out && input.prev_out.addr === address
            );
        
            // Calculate total received by this address in outputs
            const received = tx.outputs
                .filter(output => output.addr === address)
                .reduce((sum, output) => sum + (output.value || 0), 0);
        
            let type, amount;
            if (received > 0 && !sentFrom) {
                type = "receive";
                amount = received / 1e8;
            } else if (sentFrom) {
                type = "send";
                // Calculate total sent from this address in inputs
                const sent = tx.inputs
                    .filter(input => input.prev_out && input.prev_out.addr === address)
                    .reduce((sum, input) => sum + (input.prev_out.value || 0), 0);
                amount = (sent - received) / 1e8;
            } else {
                type = "other";
                amount = 0;
            }
        
            return {
                txid: tx.txid,
                timestamp: new Date(tx.time * 1000).toISOString(),
                type,
                amount,
                fee: tx.fee ? tx.fee / 1e8 : 0,
            };
        });

        return {
            coin: 'BTC',
            balance: parseFloat(balance), 
            transactions: mappedTransactions,
        };
    } catch (error) {
        throw new Error('Failed to extract Bitcoin wallet information: ' + error.message);
    }
}

module.exports = fetchBitcoinWalletData;