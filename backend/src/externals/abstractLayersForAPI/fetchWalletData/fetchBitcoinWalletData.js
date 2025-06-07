const axios = require('axios');

/**
 * Fetches the current Bitcoin balance for a wallet
 * Assumes address is a valid Bitcoin address string
 */
async function getBalance(address) {
    const apiUrl = `https://blockchain.info/q/addressbalance/${address}`;

    try {
        const response = await axios.get(apiUrl);
        const balanceInSatoshis = parseInt(response.data);
        const balanceInBTC = balanceInSatoshis / 100000000;

        return balanceInBTC;
    } catch (error) {
        throw new Error('Failed to fetch Bitcoin balance');
    }
}

/**
 * Retrieves one year of transaction history for a Bitcoin wallet
 * Assumes address is a valid Bitcoin address string
 */
async function getTransactions(address) {
    const oneYearAgoTimestamp = Math.floor(Date.now() / 1000) - (365 * 24 * 60 * 60);
    const apiUrl = `https://blockchain.info/rawaddr/${address}`;

    try {
        const response = await axios.get(apiUrl);

        if (response.data && response.data.txs) {
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
 * Extracts complete wallet information including balance and transaction history
 * Assumes address is a valid Bitcoin address string in either legacy or segwit format
 */
async function fetchBitcoinWalletData(address) {
    try {
        const [transactions, balance] = await Promise.all([
            getTransactions(address),
            getBalance(address),
        ]);
        const mappedTransactions = transactions.map(tx => {
            const sentFrom = tx.inputs.some(
                input => input.prev_out && input.prev_out.addr === address
            );
            const received = tx.outputs
                .filter(output => output.addr === address)
                .reduce((sum, output) => sum + (output.value || 0), 0);

            let type, amount;
            
            if (received > 0 && !sentFrom) {
                type = "receive";
                amount = received / 1e8;
            } else if (sentFrom) {
                type = "send";
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
            coin: 'bitcoin',
            balance: parseFloat(balance),
            transactions: mappedTransactions,
        };
    } catch (error) {
        throw new Error('Failed to extract Bitcoin wallet information: ' + error.message);
    }
}

module.exports = fetchBitcoinWalletData;