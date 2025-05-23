const axios = require('axios');
const fetchBitcoinWalletData = require('../../../externals/abstractLayersForAPI/fetchWalletData/fetchBitcoinWalletData');

// Mock axios
jest.mock('axios');

describe('Bitcoin Wallet Data Functions', () => {
    // Reset mocks before each test
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('fetchBitcoinWalletData', () => {
        it('should process transactions and format wallet data correctly', async () => {
            // Mock transactions API response
            const mockTxs = [{
                hash: 'tx1',
                time: Math.floor(Date.now() / 1000) - 1000,
                inputs: [{
                    prev_out: { 
                        addr: 'testAddress',
                        value: 200000000 // 2 BTC
                    }
                }],
                out: [{
                    addr: 'recipient',
                    value: 190000000 // 1.9 BTC (0.1 BTC fee)
                }],
                fee: 10000000 // 0.1 BTC
            }];

            axios.get.mockImplementation((url) => {
                if (url.includes('rawaddr')) {
                    return Promise.resolve({ data: { txs: mockTxs } });
                }
                if (url.includes('addressbalance')) {
                    return Promise.resolve({ data: 100000000 }); // 1 BTC
                }
                return Promise.reject(new Error('Invalid URL'));
            });

            // Execute function
            const walletData = await fetchBitcoinWalletData('testAddress');

            // Verify wallet data format
            expect(walletData).toEqual({
                coin: 'BTC',
                balance: 1.0,
                transactions: [{
                    txid: 'tx1',
                    timestamp: expect.any(String),
                    type: 'send',
                    amount: 2.0,
                    fee: 0
                }]
            });
        });

        it('should handle API errors', async () => {
            // Mock API error
            axios.get.mockRejectedValue(new Error('API Error'));

            // Verify error handling
            await expect(fetchBitcoinWalletData('testAddress'))
                .rejects
                .toThrow('Failed to extract Bitcoin wallet information');
        });
    });
});