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

async function getBalance(address, coinType) {
   try {
        const balanceResponse = await Moralis.EvmApi.balance.getNativeBalance({
            chain: coinType,
            address: address
        });

        return Number(balanceResponse.raw.balance) / 1e18;


    } catch (error) {
        throw new Error('Failed to fetch wallet balance: ' + error.message);
    }
}

async function getTransactions(address, coinType){
    const oneYearAgoTimestamp = Math.floor(Date.now() / 1000) - (365 * 24 * 60 * 60);
    try {
        const response = await Moralis.EvmApi.transaction.getWalletTransactions({
            chain: coinType,
            order: "DESC",
            address: address
        });

        return response.raw.result
            .filter(tx => {
                const txTimestamp = new Date(tx.block_timestamp).getTime() / 1000;
                return txTimestamp >= oneYearAgoTimestamp;
            })
            .map(tx => {
                const isSender = tx.from_address.toLowerCase() === address.toLowerCase();
                const amountEth = Number(tx.value) / 1e18;
                const feeEth = Number(tx.transaction_fee);

                return {
                    txid: tx.hash,
                    timestamp: tx.block_timestamp,
                    type: isSender ? "send" : "receive",
                    fee: isSender ? feeEth : 0,
                    amount: amountEth
                };
            });

    } catch (error) {
        throw new Error("Failed to fetch transactions: " + error.message);
    }
}

async function fetchTokensWalletData(address, coinType) {
    try {
        await initializeMoralis();
        const balance = await getBalance(address, coinType);
        const transactions = await getTransactions(address, coinType);
        
        let coinSymbol;
        switch (coinType) {
            case '0x1': coinSymbol = 'ethereum'; break; 
            case '0x89': coinSymbol = 'polygon'; break; 
            case '0xa86a': coinSymbol = 'avalanche'; break; 
            case '0xa4b1': coinSymbol = 'arbitrum'; break; 
            case '0x10': coinSymbol = 'optimism'; break;
            case '0xfa': coinSymbol = 'fantom'; break; 
            case '0x38': coinSymbol = 'binancecoin'; break; 
            case '0xaa36a7': coinSymbol = 'sepolia'; break; 
            default: coinSymbol = 'Unknown';}

        return {
            coin: coinSymbol,
            balance: balance,
            transactions: transactions
        };
    } catch (error) {
        throw new Error(`Failed to fetch wallet data for ${coinType}: ${error.message}`);
    }
}

module.exports = fetchTokensWalletData;
