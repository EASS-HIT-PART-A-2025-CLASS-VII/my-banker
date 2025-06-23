const Moralis = require('moralis').default;

const MORALIS_API_KEY = process.env.MORALIS_API_KEY;

let isInitialized = false;

async function initializeMoralis() {
    if (!isInitialized) {
        try {
            await Moralis.start({
                apiKey: MORALIS_API_KEY
            });
            isInitialized = true;
        } catch (error) {
            console.error('Failed to initialize Moralis:', error);
            throw error;
        }
    }
}

async function getBalances(address, chain, symbol) {
    try {
        const result = { tokens: [], nativeBalance: null };

        const nativeResponse = await Moralis.EvmApi.balance.getNativeBalance({
            chain: chain,
            address: address
        });

        if (nativeResponse.raw.balance && Number(nativeResponse.raw.balance) > 0) {
            result.nativeBalance = {
                symbol: symbol,
                balance: Number(nativeResponse.raw.balance) / 1e18
            };
        }

        const tokenResponse = await Moralis.EvmApi.token.getWalletTokenBalances({
            chain: chain,
            address: address
        });

        if (tokenResponse.raw && tokenResponse.raw.length > 0) {
            result.tokens = tokenResponse.raw.map(token => ({
                symbol: token.symbol,
                balance: Number(token.balance) / Math.pow(10, token.decimals),
            }));
        }

        return result;

    } catch (error) {
        throw new Error('Failed to fetch wallet balance: ' + error.message);
    }
}

async function getTransactions(address, chain, symbol) {
    try {
        const nativeResponse = await Moralis.EvmApi.transaction.getWalletTransactions({
            chain: chain,
            order: "DESC",
            address: address
        });

        const tokenResponse = await Moralis.EvmApi.token.getWalletTokenTransfers({
            chain: chain,
            order: "DESC",
            address: address
        });

        const nativeTransactions = nativeResponse.raw.result.map(tx => {
            const isSender = tx.from_address.toLowerCase() === address.toLowerCase();
            const amountNative = Number(tx.value) / 1e18;
            const feeNative = Number(tx.transaction_fee);

            return {
                txid: tx.hash,
                timestamp: tx.block_timestamp,
                type: isSender ? "send" : "receive",
                fee: isSender ? feeNative : 0,
                amount: amountNative,
                symbol: symbol,
                isNative: true
            };
        });

        const tokenTransactions = tokenResponse.raw.result.map(tx => {
            const isSender = tx.from_address.toLowerCase() === address.toLowerCase();
            const amount = Number(tx.value) / Math.pow(10, Number(tx.decimal || 18));

            return {
                txid: tx.transaction_hash,
                timestamp: tx.block_timestamp,
                type: isSender ? "send" : "receive",
                fee: 0,
                amount: amount,
                symbol: tx.token_symbol || 'Unknown',
                isNative: false
            };
        });

        const allTransactions = [...nativeTransactions, ...tokenTransactions]
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        return allTransactions;

    } catch (error) {
        console.error("Transaction fetch error:", error);
        throw new Error("Failed to fetch transactions: " + error.message);
    }
}

async function fetchTokensAndNativeWalletData(address, chain, symbol) {
    try {
        await initializeMoralis();
        const balances = await getBalances(address, chain, symbol);
        const transactions = await getTransactions(address, chain, symbol);

        let chainSymbol;
        switch (chain) {
            case '0x1': chainSymbol = 'ethereum'; break;
            case '0x89': chainSymbol = 'polygon'; break;
            case '0xa86a': chainSymbol = 'avalanche'; break;
            case '0xa4b1': chainSymbol = 'arbitrum'; break;
            case '0x10': chainSymbol = 'optimism'; break;
            case '0xfa': chainSymbol = 'fantom'; break;
            case '0x38': chainSymbol = 'binancecoin'; break;
            case '0xaa36a7': chainSymbol = 'sepolia'; break;
            default: chainSymbol = 'Unknown';
        }

        return {
            chain: chainSymbol,
            balances: balances,
            transactions: transactions
        };
    } catch (error) {
        throw new Error(`${error.message}`);
    }
}

module.exports = fetchTokensAndNativeWalletData;