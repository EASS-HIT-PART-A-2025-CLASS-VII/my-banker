const Moralis = require('moralis').default;

async function getWalletBalances() {
    try {
        await Moralis.start({
            apiKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6IjY5MjAxMzM4LWFkNGQtNGU5OS05ZmQwLTZhODU0Yzk4MTZhYSIsIm9yZ0lkIjoiNDUxMTI2IiwidXNlcklkIjoiNDY0MTcyIiwidHlwZUlkIjoiNGQ4ZTc2YzQtZGE2MC00MDc5LTllZGEtN2RmODM4ODAzZDAwIiwidHlwZSI6IlBST0pFQ1QiLCJpYXQiOjE3NDkxMjc2OTksImV4cCI6NDkwNDg4NzY5OX0.oJEOZkLNZxxND_pmWDio4mJEiLEo6jaABsAb7LvJV1c'
        });

        const result = { tokens: [], nativeBalance: null };

        // Get native token balance
        const nativeResponse = await Moralis.EvmApi.balance.getNativeBalance({
            chain: '0x1',
            address: '0x9a5671C11004444F49F2aBd683eDf7A60E2ee8d3'
        });

        // Only add native balance if it's greater than 0
        if (nativeResponse.raw.balance && Number(nativeResponse.raw.balance) > 0) {
            result.nativeBalance = {
                symbol: 'ETH',
                balance: Number(nativeResponse.raw.balance) / 1e18
            };
        }

        // Get ERC20 token balances
        const tokenResponse = await Moralis.EvmApi.token.getWalletTokenBalances({
            chain: '0x1',
            address: '0x9a5671C11004444F49F2aBd683eDf7A60E2ee8d3'
        });

        // Only add tokens if there are any
        if (tokenResponse.raw && tokenResponse.raw.length > 0) {
            result.tokens = tokenResponse.raw.map(token => ({
                symbol: token.symbol,
                balance: Number(token.balance) / Math.pow(10, token.decimals),
            }));
        }

        console.log('Wallet Balances:', JSON.stringify(result, null, 2));
        return result;

    } catch (error) {
        console.error('Error fetching wallet balances:', error);
        throw error;
    }
}

// Execute the function
getWalletBalances();