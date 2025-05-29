const axios = require('axios');
const fetchBitcoinWalletData = require('../../../externals/abstractLayersForAPI/fetchWalletData/fetchBitcoinWalletData');

jest.mock('axios');

describe('Bitcoin Wallet Data Functions', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('fetchBitcoinWalletData', () => {
        it('should process transactions and format wallet data correctly', async () => {
            const mockTxs = [{
                hash: 'tx1',
                time: Math.floor(Date.now() / 1000) - 1000,
                inputs: [{
                    prev_out: { 
                        addr: 'testAddress',
                        value: 200000000 
                    }
                }],
                out: [{
                    addr: 'recipient',
                    value: 190000000 
                }],
                fee: 10000000 
            }];

            axios.get.mockImplementation((url) => {
                if (url.includes('rawaddr')) {
                    return Promise.resolve({ data: { txs: mockTxs } });
                }
                if (url.includes('addressbalance')) {
                    return Promise.resolve({ data: 100000000 });
                }
                return Promise.reject(new Error('Invalid URL'));
            });

            const walletData = await fetchBitcoinWalletData('testAddress');

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
            axios.get.mockRejectedValue(new Error('API Error'));

            await expect(fetchBitcoinWalletData('testAddress'))
                .rejects
                .toThrow('Failed to extract Bitcoin wallet information');
        });
    });
});