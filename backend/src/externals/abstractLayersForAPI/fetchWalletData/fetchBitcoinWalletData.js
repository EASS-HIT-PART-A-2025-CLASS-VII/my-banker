const axios = require('axios');

/**
 * @function getBalance
 * @description Fetch the Bitcoin balance for a given address
 */
async function getBalance(address) {
    const apiUrl = `https://blockchain.info/q/addressbalance/${address}`;

    try {
        const response = await axios.get(apiUrl);

        // Convert satoshis to BTC
        const balanceInSatoshis = parseInt(response.data);
        const balanceInBTC = balanceInSatoshis / 100000000;

        return balanceInBTC;
    } catch (error) {
        throw new Error('Failed to fetch Bitcoin balance');
    }
}

/**
 * @function getTransactions
 * @description Fetch the transaction history for a given Bitcoin address
 */
async function getTransactions(address) {
    // Set time range to one year
    const oneYearAgoTimestamp = Math.floor(Date.now() / 1000) - (365 * 24 * 60 * 60);

    const apiUrl = `https://blockchain.info/rawaddr/${address}`;

    try {
        const response = await axios.get(apiUrl);

        // Process transaction data if available
        if (response.data && response.data.txs) {
            // Filter and format transactions
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
        return [];
    } catch (error) {
        throw new Error('Failed to fetch Bitcoin transactions');
    }
}

/**
 * @function fetchBitcoinWalletData
 * @description Extract Bitcoin wallet information including balance and transactions
 */
async function fetchBitcoinWalletData(address) {
    try {
        // Fetch wallet data in parallel
        const [transactions, balance] = await Promise.all([
            getTransactions(address),
            getBalance(address),
        ]);

        // Process transactions
        const mappedTransactions = transactions.map(tx => {
            // Check if address is in transaction inputs
            const sentFrom = tx.inputs.some(
                input => input.prev_out && input.prev_out.addr === address
            );

            // Calculate total received amount
            const received = tx.outputs
                .filter(output => output.addr === address)
                .reduce((sum, output) => sum + (output.value || 0), 0);

            // Determine transaction type and amount
            let type, amount;
            if (received > 0 && !sentFrom) {
                type = "receive";
                amount = received / 1e8;
            } else if (sentFrom) {
                type = "send";
                // Calculate total sent amount
                const sent = tx.inputs
                    .filter(input => input.prev_out && input.prev_out.addr === address)
                    .reduce((sum, input) => sum + (input.prev_out.value || 0), 0);
                amount = (sent - received) / 1e8;
            } else {
                type = "other";
                amount = 0;
            }

            // Format transaction data
            return {
                txid: tx.txid,
                timestamp: new Date(tx.time * 1000).toISOString(),
                type,
                amount,
                fee: tx.fee ? tx.fee / 1e8 : 0,
            };
        });

        // Return formatted wallet data
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